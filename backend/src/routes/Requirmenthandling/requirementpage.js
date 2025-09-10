import express from 'express';
import authMiddleware from '../../middleware/authmiddleware.js';
import { createrequirement, updateRequirementController } from '../../controllers/Requirementhandlingcontroller/requirementhandlingcontroller.js';


// Create a new Express router for admin user creation routes
const router = express.Router();

// Route to create a non-admin user
// This route is executing authMiddleware to extract the JWT token details
router.post('/requirementdata', authMiddleware, createrequirement);
router.put('/requirements/:id', authMiddleware, updateRequirementController);

// Export the router to be used in the main app
export default router;
