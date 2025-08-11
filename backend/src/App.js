import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB} from './config/dbconfig.js';
 // Importing the database configuration from config/dbconfig.js
import requirementBoxRoutes from './routes/authentication/requirementbox.js';
import authRoutes from './routes/authentication/auth.js'
import createNonAminUserRoutes from './routes/adminpages/createnonadminuser.js'



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
(async () => {
  try {
    await connectDB();
    console.log('Database connection established');
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
})();

// Routes
app.use('/api', requirementBoxRoutes);
app.use('/api', authRoutes)
app.use('/api', createNonAminUserRoutes)


app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
