const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List' }
});

module.exports = mongoose.model('Lead', leadSchema);