const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }
});

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true }
});

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
});

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  totalLeads: { type: Number, default: 0 },
  status: { type: String, default: 'Uploaded' }
});

const User = mongoose.model('User', userSchema);
const Agent = mongoose.model('Agent', agentSchema);
const Lead = mongoose.model('Lead', leadSchema);
const List = mongoose.model('List', listSchema);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'));
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });
    
    // Create and assign token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agent routes
app.post('/api/agents', authenticateToken, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) return res.status(400).json({ message: 'Agent already exists' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword
    });
    
    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent: { id: agent._id, name, email, mobile } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/agents', authenticateToken, async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/agents/:id', authenticateToken, async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List upload and distribution
app.post('/api/lists/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const leads = [];
    
    // Parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validate required fields
        if (data.FirstName && data.Phone) {
          leads.push({
            firstName: data.FirstName,
            phone: data.Phone,
            notes: data.Notes || ''
          });
        }
      })
      .on('end', async () => {
        // Get all agents
        const agents = await Agent.find();
        if (agents.length === 0) {
          return res.status(400).json({ message: 'No agents available for distribution' });
        }
        
        // Create new list
        const list = new List({
          name: fileName,
          totalLeads: leads.length,
          status: 'Distributed'
        });
        await list.save();
        
        // Distribute leads among agents
        const leadsPerAgent = Math.floor(leads.length / agents.length);
        const remainder = leads.length % agents.length;
        
        let leadIndex = 0;
        for (let i = 0; i < agents.length; i++) {
          const agentLeadCount = i < remainder ? leadsPerAgent + 1 : leadsPerAgent;
          
          for (let j = 0; j < agentLeadCount && leadIndex < leads.length; j++) {
            const lead = new Lead({
              ...leads[leadIndex],
              assignedTo: agents[i]._id
            });
            await lead.save();
            leadIndex++;
          }
        }
        
        // Delete the uploaded file
        fs.unlinkSync(filePath);
        
        res.status(201).json({ 
          message: 'List uploaded and distributed successfully',
          list: {
            id: list._id,
            name: list.name,
            totalLeads: list.totalLeads,
            status: list.status
          }
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/lists', authenticateToken, async (req, res) => {
  try {
    const lists = await List.find().sort({ uploadDate: -1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/lists/:id/distribution', authenticateToken, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    
    // Get leads distribution for this list
    const leads = await Lead.find().populate('assignedTo');
    
    // Group leads by agent
    const distribution = {};
    leads.forEach(lead => {
      const agentId = lead.assignedTo._id.toString();
      if (!distribution[agentId]) {
        distribution[agentId] = {
          agent: {
            id: lead.assignedTo._id,
            name: lead.assignedTo.name,
            email: lead.assignedTo.email
          },
          leads: []
        };
      }
      distribution[agentId].leads.push({
        id: lead._id,
        firstName: lead.firstName,
        phone: lead.phone,
        notes: lead.notes
      });
    });
    
    res.json({
      list,
      distribution: Object.values(distribution)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/lists/:id', authenticateToken, async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create initial admin user if none exists
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('Admin user created: admin@example.com / admin123');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createAdminUser();
});