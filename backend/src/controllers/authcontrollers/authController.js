import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../models/signupModel.js';

const signup = async (req, res) => {
  const { tenant, fullname, organisation, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({ tenant, fullname, organisation, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export { signup };
