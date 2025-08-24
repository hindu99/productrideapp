import express from 'express';
import { getallprojects } from '../../controllers/projectquerycontroller/projectquerycontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';

// Create a new Express router for populating users linked to the tenant for the frontend use
const router = express.Router();

// Route to query projects
// This route is executing authMiddleware to extract the JWT token details
router.post('/findprojects', authMiddleware, getallprojects);

// Export the router to be used in the main app
export default router;
