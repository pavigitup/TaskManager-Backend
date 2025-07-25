// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import authRoutes from './routes/auth';
// import taskRoutes from './routes/tasks';
// import commentRoutes from './routes/comments';

// const app = express();

// // Security middleware
// app.use(helmet());
// app.use(cors());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: { 
//     success: false, 
//     message: 'Too many requests from this IP, please try again later.' 
//   }
// });
// app.use(limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/tasks/:id/comments', commentRoutes);



// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ 
//     success: false, 
//     message: 'Route not found' 
//   });
// });

// // Global error handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
  
//   res.status(err.status || 500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
//   });
// });

// export default app;