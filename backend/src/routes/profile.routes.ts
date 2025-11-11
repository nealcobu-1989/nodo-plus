import { Router } from 'express';
import multer from 'multer';
import { profileSubmissionController } from '../controllers/profileSubmission.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

export const profileSubmissionRoutes = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
});

profileSubmissionRoutes.use(authenticate);
profileSubmissionRoutes.use(requireRole('EDTECH', 'ADMIN'));

profileSubmissionRoutes.get('/current', profileSubmissionController.getCurrent);
profileSubmissionRoutes.post('/', profileSubmissionController.create);
profileSubmissionRoutes.get('/:id', profileSubmissionController.getById);
profileSubmissionRoutes.put('/:id', profileSubmissionController.update);
profileSubmissionRoutes.post(
  '/:id/attachments',
  upload.single('file'),
  profileSubmissionController.uploadAttachment,
);
profileSubmissionRoutes.delete(
  '/:id/attachments/:attachmentId',
  profileSubmissionController.deleteAttachment,
);
profileSubmissionRoutes.get(
  '/:id/attachments/:attachmentId/url',
  profileSubmissionController.getAttachmentUrl,
);


