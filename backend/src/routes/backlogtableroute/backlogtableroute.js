import express from 'express';
import { getAllbacklogitmes} from '../../controllers/Backlogtablecontroller/backlogtablecontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';
import projectidextractor from '../../middleware/projectidextractor.js';

//  a new Express router for populating users linked to the tenant for the frontend use
const router = express.Router();

// Route to query requirments for populating the backlogtable
// This route is executing authMiddleware and projectidextractor to extract the JWT token details
router.get('/backlog', projectidextractor,authMiddleware,getAllbacklogitmes);

// Export the router to be used in the main app
export default router;