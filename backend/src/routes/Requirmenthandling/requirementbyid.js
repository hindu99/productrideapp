import express from 'express';
import { getRequirementByIdController } from '../../controllers/Requirementhandlingcontroller/requirementhandlingcontroller.js';
import authMiddleware from '../../middleware/authmiddleware.js';

const router = express.Router();

// GET /api/requirements/:id  → fetch a single requirement
router.get('/requirements/:id', authMiddleware, getRequirementByIdController);

export default router;
