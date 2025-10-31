import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

export const adminRoutes = Router();

// Solo administradores
adminRoutes.use(authenticate);
adminRoutes.use(requireRole('ADMIN'));

// Dashboard
adminRoutes.get('/dashboard', adminController.getDashboard);

// Revisión de perfiles
adminRoutes.get('/pending-profiles', adminController.getPendingProfiles);
adminRoutes.get('/profiles/:id', adminController.getProfile);
adminRoutes.post('/profiles/:id/approve', adminController.approveProfile);
adminRoutes.post('/profiles/:id/reject', adminController.rejectProfile);
adminRoutes.post('/profiles/:id/request-changes', adminController.requestChanges);

// Gestión de catálogos
adminRoutes.get('/catalogs', adminController.getCatalogs);
adminRoutes.post('/catalogs', adminController.createCatalog);
adminRoutes.put('/catalogs/:id', adminController.updateCatalog);
adminRoutes.delete('/catalogs/:id', adminController.deleteCatalog);

// Gestión de preguntas/cuestionarios
adminRoutes.get('/questions', adminController.getQuestions);
adminRoutes.post('/questions', adminController.createQuestion);
adminRoutes.put('/questions/:id', adminController.updateQuestion);
adminRoutes.delete('/questions/:id', adminController.deleteQuestion);

// Reglas de semáforos
adminRoutes.get('/traffic-light-rules', adminController.getTrafficLightRules);
adminRoutes.put('/traffic-light-rules', adminController.updateTrafficLightRules);

// Métricas y exportaciones
adminRoutes.get('/metrics', adminController.getMetrics);
adminRoutes.get('/export/solutions', adminController.exportSolutions);
adminRoutes.get('/export/institutions', adminController.exportInstitutions);

// Gestión de consultantes
adminRoutes.get('/consultants', adminController.getConsultants);
adminRoutes.post('/consultants', adminController.createConsultant);
adminRoutes.put('/consultants/:id/activate', adminController.activateConsultant);
adminRoutes.put('/consultants/:id/deactivate', adminController.deactivateConsultant);

// Gestión de instituciones educativas
adminRoutes.get('/institutions', adminController.getInstitutions);
adminRoutes.get('/institutions/:id', adminController.getInstitution);

