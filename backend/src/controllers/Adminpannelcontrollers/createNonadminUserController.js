import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createNonAdminUser, findUserByEmail } from '../../models/adminpannelmodels/createusermodel';
import authMiddleware from '../middleware/authmiddleware.js';

// Load environment variables from .env file
dotenv.config();

// Controller function to create a non-admin user
const createusers = async (req, res) => {
  // Extract user details from request body
  const { fullname, email, password } = req.body;
  // Extract tenantId and role from request (set by authMiddleware)
  //authMiddleware is decoding the JWT and then collectin this info
  const tenantId = req.tenantId;
  const role = req.role;

  // Validate required fields
  if (!fullname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the new user in the database
    await createNonAdminUser({ tenantId, fullname, email, password: hashedPassword, role });

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors during registration
    console.error('User Registration Error:', error);
    res.status(500).json({ message: 'Server error during User Registration' });
  }
};

// Export the controller function
export { createusers };
