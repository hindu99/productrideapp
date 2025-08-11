import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { createNonAdminUser, findUserByEmail } from '../../models/adminpannelmodels/createusermodel';

dotenv.config();

const createusers = async (req, res) => {
  const { fullname, email, password } = req.body;
  const tenantId = req.tenantId;
  const role = req.role;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createNonAdminUser({ tenantId, fullname, email, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('User Registration Error:', error);
    res.status(500).json({ message: 'Server error during User Registration' });
  }
};

export { createusers };
