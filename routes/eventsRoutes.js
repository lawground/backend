const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticateToken = require('../middleware/authenticate');


router.post('/events', authenticateToken, eventController.createEvent);
router.get('/events', authenticateToken, eventController.getAllEvents);
router.put('/events/:id', authenticateToken, eventController.updateEvent);
router.delete('/events/:id', authenticateToken, eventController.deleteEvent);

module.exports = router;
