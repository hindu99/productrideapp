import bcrypt from 'bcrypt';
import { findUserByEmail, createUser,createtenant } from '../../models/authiModel/signupmodel.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';




const signup = async (req, res) => {
  const { tenantName, fullname, category, email, password,role} = req.body;
  const tenantId=uuidv4();

//Checking the user 
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
// Using bcrypt hasing the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating tenant and user  
    await createtenant({tenantId,tenantName,category})
  
    await createUser({ tenantId,fullname, email, password: hashedPassword,role });

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

    //Constructing user details for token 
    const JWTtokendetails = {
      userId: userdetailes.user_id,  
      tenantId: userdetailes.tenant_id,
      email: userdetailes.email,
      fullname: userdetailes.fullname,
      role:userdetailes.role,
    };

    //JWT token , this is send to the frontend , which has the secret key, details and expiry

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
