import { Router } from 'express';
import { edtechController } from '../controllers/edtech.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

export const edtechRoutes = Router();

// Rutas protegidas - solo EdTechs
edtechRoutes.use(authenticate);
edtechRoutes.use(requireRole('EDTECH', 'ADMIN'));

edtechRoutes.get('/profile', edtechController.getProfile);
edtechRoutes.put('/profile', edtechController.updateProfile);
edtechRoutes.get('/solutions', edtechController.getSolutions);
edtechRoutes.post('/solutions', edtechController.createSolution);
edtechRoutes.get('/solutions/:id', edtechController.getSolution);
edtechRoutes.put('/solutions/:id', edtechController.updateSolution);
edtechRoutes.post('/solutions/:id/submit', edtechController.submitSolution);
edtechRoutes.get('/solutions/:id/preview', edtechController.previewSolution);
edtechRoutes.post('/solutions/:id/evidences', edtechController.addEvidence);
edtechRoutes.delete('/solutions/:id/evidences/:evidenceId', edtechController.deleteEvidence);

