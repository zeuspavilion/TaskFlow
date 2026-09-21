import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import User from './models/User';
import Task from './models/Task';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'To-Do API Server is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Seed demo data
async function seedInitialData() {
  try {
    const existingDemo = await User.findOne({ email: 'demo@taskflow.io' });
    let demoUserId;
    if (!existingDemo) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      const demoUser = await User.create({
        email: 'demo@taskflow.io',
        password: hashedPassword,
        name: 'Demo User',
      });
      demoUserId = demoUser._id;
      console.log('✅ Demo account initialized: demo@taskflow.io / password123');
    } else {
      demoUserId = existingDemo._id;
    }

    const taskCount = await Task.countDocuments({ user: demoUserId });
    if (taskCount === 0) {
      const now = new Date();
      await Task.create([
        {
          user: demoUserId,
          title: 'Complete Mobile App Assignment',
          description: 'Ensure all features, priority filters, and UI are fully functional.',
          priority: 'high',
          category: 'Work',
          dateTime: now,
          deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          isCompleted: false,
        },
        {
          user: demoUserId,
          title: 'Review TaskFlow Architecture',
          description: 'Inspect React Native native-stack and Express backend.',
          priority: 'medium',
          category: 'Study',
          dateTime: now,
          deadline: new Date(now.getTime() + 48 * 60 * 60 * 1000),
          isCompleted: true,
          completedAt: now,
        },
        {
          user: demoUserId,
          title: 'Setup MongoDB persistence',
          description: 'Automatic in-memory failover configured for zero downtime.',
          priority: 'low',
          category: 'Personal',
          dateTime: now,
          deadline: new Date(now.getTime() + 72 * 60 * 60 * 1000),
          isCompleted: false,
        },
      ]);
      console.log('✅ Demo tasks populated');
    }
  } catch (err) {
    console.warn('Seeding warning:', err);
  }
}

// Connect to Database
async function connectDatabase() {
  try {
    console.log('Connecting to primary MongoDB URI...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to MongoDB database successfully');
    await seedInitialData();
  } catch (error: any) {
    console.warn('⚠️ Local MongoDB not reachable. Starting fast in-memory MongoDB engine...');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to in-memory MongoDB engine successfully at', uri);
      await seedInitialData();
    } catch (memErr: any) {
      console.error('Failed to initialize in-memory database:', memErr);
    }
  }
}

// Start Server immediately
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  connectDatabase();
});

export default app;
