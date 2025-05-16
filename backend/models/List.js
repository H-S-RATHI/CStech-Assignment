const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  totalLeads: { type: Number, default: 0 },
  status: { type: String, default: 'Uploaded' }
});

module.exports = mongoose.model('List', listSchema);