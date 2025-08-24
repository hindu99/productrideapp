import express from 'express';
import { createProject } from '../../controllers/Adminpannelcontrollers/createProjectController.js';
import authMiddleware from '../../middleware/authmiddleware.js';

// Create a new Express router for project creation
const router = express.Router();

// Route to create a project
// This route is executing authMiddleware to extract the JWT token details
router.post('/createproject', authMiddleware, createProject);

// Export the router to be used in the main app
export default router;
