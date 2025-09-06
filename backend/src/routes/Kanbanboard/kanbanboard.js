import express from 'express';
import { getAllRequirements } from '../../controllers/Kanbanboardcontroller/kanbanboardcontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';
import projectidextractor from '../../middleware/projectidextractor.js';

//  a new Express router for populating users linked to the tenant for the frontend use
const router = express.Router();

// Route to query requirments for populating the kanban board 
// This route is executing authMiddleware to extract the JWT token details
router.get('/board', projectidextractor,authMiddleware,getAllRequirements);

// Export the router to be used in the main app
export default router;