import { Router } from 'express';
import multer from 'multer';
import { institutionProfileSubmissionController } from '../controllers/institutionProfileSubmission.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

export const institutionProfileSubmissionRoutes = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
});

institutionProfileSubmissionRoutes.use(authenticate);
institutionProfileSubmissionRoutes.use(requireRole('IE', 'ADMIN'));

institutionProfileSubmissionRoutes.get('/current', institutionProfileSubmissionController.getCurrent);
institutionProfileSubmissionRoutes.post('/', institutionProfileSubmissionController.create);
institutionProfileSubmissionRoutes.get('/:id', institutionProfileSubmissionController.getById);
institutionProfileSubmissionRoutes.put('/:id', institutionProfileSubmissionController.update);
institutionProfileSubmissionRoutes.post(
  '/:id/attachments',
  upload.single('file'),
  institutionProfileSubmissionController.uploadAttachment,
);
institutionProfileSubmissionRoutes.delete(
  '/:id/attachments/:attachmentId',
  institutionProfileSubmissionController.deleteAttachment,
);
institutionProfileSubmissionRoutes.get(
  '/:id/attachments/:attachmentId/url',
  institutionProfileSubmissionController.getAttachmentUrl,
);

