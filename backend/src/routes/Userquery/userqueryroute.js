import express from 'express';
import { getAllUsers } from '../../controllers/Userquerycontrollers/userquerycontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';

// Create a new Express router for populating users linked to the tenant for the frontend use
const router = express.Router();

// Route to query users
// This route is executing authMiddleware to extract the JWT token details
router.post('/findusers', authMiddleware, getAllUsers);

// Export the router to be used in the main app
export default router;
