const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');

// Create a new agent
const createAgent = async (req, res) => {
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
};

// Get all agents
const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an agent
const deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAgent,
  getAgents,
  deleteAgent
};