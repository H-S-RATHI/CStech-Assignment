const express = require('express');
const router = express.Router();
const { uploadList, getLists, getListDistribution, deleteList } = require('../controllers/listController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../utils/fileUpload');

// List routes
router.post('/upload', authenticateToken, upload.single('file'), uploadList);
router.get('/', authenticateToken, getLists);
router.get('/:id/distribution', authenticateToken, getListDistribution);
router.delete('/:id', authenticateToken, deleteList);

module.exports = router;