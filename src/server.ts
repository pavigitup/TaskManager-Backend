import express from 'express';
import cors from 'cors';
import connectDB  from './config/database';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import authRoutes from './routes/auth';
// import taskRoutes from './routes/kanban';

import commentRoutes from './routes/comments';
import taskRoutes from './routes/tasks';


dotenv.config();

// import app from './app';

// const PORT = process.env.PORT || 8001;
// console.log(`🚀 Server running on port ${PORT}`);


// const startServer = async (): Promise<void> => {
//   try {
//     await connectDB();
    
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🔗 Health check: http://localhost:${PORT}/health`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();




connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // ✅ allow frontend origin
  credentials: true               // ✅ allow cookies
}));
app.use(express.json());
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:id/comments', commentRoutes);

// Add this near the other route definitions
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});
// app.use('/api/tasks', taskRoutes);
// app.use('/api/columns', taskRoutes);  // Add this line
// app.use('/api/tasks', commentRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});