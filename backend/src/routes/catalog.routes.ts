import { Router } from 'express';
import { catalogController } from '../controllers/catalog.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

export const catalogRoutes = Router();

// Catálogo público (para consultantes)
catalogRoutes.get('/solutions', catalogController.getSolutions);
catalogRoutes.get('/solutions/:id', catalogController.getSolution);
catalogRoutes.get('/filters', catalogController.getFilters);
catalogRoutes.post('/solutions/:id/contact', catalogController.contactEdTech);

// Exportación (solo consultantes y admin)
catalogRoutes.get('/export', authenticate, requireRole('CONSULTANT', 'ADMIN'), catalogController.exportCatalog);

