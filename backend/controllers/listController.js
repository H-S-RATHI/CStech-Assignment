const fs = require('fs');
const csv = require('csv-parser');
const List = require('../models/List');
const Lead = require('../models/Lead');
const Agent = require('../models/Agent');

// Upload and distribute a list
const uploadList = async (req, res) => {
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
};

// Get all lists
const getLists = async (req, res) => {
  try {
    const lists = await List.find().sort({ uploadDate: -1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list distribution
const getListDistribution = async (req, res) => {
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
};

// Delete a list
const deleteList = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadList,
  getLists,
  getListDistribution,
  deleteList
};