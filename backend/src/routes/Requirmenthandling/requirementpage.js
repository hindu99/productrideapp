import express from 'express';
import { createrequirement } from '../../controllers/Requirementhandlingcontroller/requirementhandlingcontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';

// Create a new Express router for admin user creation routes
const router = express.Router();

// Route to create a non-admin user
// This route is executing authMiddleware to extract the JWT token details
router.post('/requirementdata', authMiddleware, createrequirement);

// Export the router to be used in the main app
export default router;
