import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { edtechRoutes } from './routes/edtech.routes';
import { adminRoutes } from './routes/admin.routes';
import { catalogRoutes } from './routes/catalog.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL === '*' ? true : (process.env.FRONTEND_URL || 'http://localhost:3000'),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/edtech', edtechRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalog', catalogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

