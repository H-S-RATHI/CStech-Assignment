const express = require('express');
const router = express.Router();
const { createAgent, getAgents, deleteAgent } = require('../controllers/agentController');
const { authenticateToken } = require('../middleware/auth');

// Agent routes
router.post('/', authenticateToken, createAgent);
router.get('/', authenticateToken, getAgents);
router.delete('/:id', authenticateToken, deleteAgent);

module.exports = router;