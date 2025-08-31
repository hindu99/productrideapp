import express from 'express';
import { updatecardstatus } from '../../controllers/Kanbanboardcontroller/cardpositioncontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';

// Route definitions for updating the status of Kanban board cards


// Create a new Express router for populating users linked to the tenant for the frontend use
const router = express.Router();

// Route to query requirments for populating the kanban board 
// This route is executing authMiddleware to extract the JWT token details
router.post('/cardposition', authMiddleware, updatecardstatus);

// Export the router to be used in the main app
export default router;
