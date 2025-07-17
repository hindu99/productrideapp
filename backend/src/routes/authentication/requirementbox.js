import express from 'express';
import { handleRequirementBox } from '../../controllers/authcontrollers/requirementboxcontroller.js';

const router = express.Router();

router.post('/requirementbox', handleRequirementBox); 

export default router; 
