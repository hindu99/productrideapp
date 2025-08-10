import express from 'express';
import { handleRequirementData } from '../../controllers/requirementhandlingcontroller/requirementhandlingcontroller.js';

const router = express.Router();

router.post('/requirementdata', handleRequirementData); 

export default router; 
