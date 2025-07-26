import bcrypt from 'bcrypt';
import { findUserByEmail, createUser,createtenant } from '../../models/authiModel/signupmodel.js';
import { v4 as uuidv4 } from 'uuid';

const signup = async (req, res) => {
  const { tenantName, fullname, category, email, password } = req.body;
  const tenantId=uuidv4();

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createtenant({tenantId,tenantName,category})
  
    await createUser({ tenantId,fullname, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export { signup };
