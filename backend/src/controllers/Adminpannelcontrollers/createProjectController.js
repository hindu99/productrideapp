import dotenv from 'dotenv';
import { createProjectInDB } from '../../models/Adminpannelmodels/createProjectModel.js';

// Load environment variables from .env file
dotenv.config();

// Controller function to create a new project
const createProject = async (req, res) => {
  // Extract project details from request body
  const { projectname, projectdescription } = req.body;

  // Extract tenantId from request (set by authMiddleware)
  const userId = req.userId;
  const tenantId=req.tenantId

  // Validate required fields
  if (!projectname || !projectdescription) {
    return res.status(400).json({ message: 'Project name and description are required.' });
  }

  try {
    // Create the new project in the database
    await createProjectInDB({ tenantId,userId,projectname, projectdescription  });

    // Respond with success message
    res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    // Handle errors during project creation
    console.error('Project Creation Error:', error);
    res.status(500).json({ message: 'Server error during project creation' });
  }
};

// Export the controller function
export { createProject };
