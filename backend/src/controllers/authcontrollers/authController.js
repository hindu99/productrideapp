import bcrypt from 'bcrypt';
import { findUserByEmail, createUser,createtenant } from '../../models/authiModel/signupmodel.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';




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
}

const login=async(req,res)=>{
  const{email,password}=req.body;

  try{

    const userdetailes = await findUserByEmail(email);
    if(!userdetailes){
      return res.status(400).json({ message: 'User not registered.' });
    }

    const passwordcheck= await bcrypt.compare(password,userdetailes.password)
    if (!passwordcheck){
      return res.status(400).json({message:'password doesnt match,please try again'})
    }

    const JWTtokendetails = {
      userId: userdetailes.userID,  
      tenantId: userdetailes.tenantID,
      email: userdetailes.email,
      fullname: userdetailes.fullname,
    };

    const token = jwt.sign(JWTtokendetails, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }


}

export { signup,login }
