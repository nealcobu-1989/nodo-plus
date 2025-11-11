import { Response } from 'express';
import { PrismaClient, ProfileSubmissionStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { uploadFile, deleteFile, getFileDownloadUrl } from '../services/fileStorage.service';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

const includeSubmissionRelations = {
  attachments: {
    orderBy: { uploadedAt: 'asc' as const },
  },
} as const;

async function getUserCompany(userId: string) {
  return prisma.edTechCompany.findUnique({
    where: { userId },
  });
}

function buildUpdatePayload(body: any, shouldSubmit: boolean) {
  const updateData: any = {};

  if (typeof body.answers !== 'undefined') {
    updateData.answers = body.answers ?? {};
  }

  if (typeof body.summarySnapshot !== 'undefined') {
    updateData.summarySnapshot = body.summarySnapshot ?? {};
  }

  if (typeof body.summaryText !== 'undefined') {
    updateData.summaryText = body.summaryText ?? null;
  }

  if (typeof body.consentData !== 'undefined') {
    updateData.consentData = body.consentData ?? {};
  }

  if (typeof body.sectionProgress !== 'undefined') {
    updateData.sectionProgress = body.sectionProgress ?? {};
  }

  if (typeof body.status !== 'undefined') {
    updateData.status = body.status;
  }

  if (shouldSubmit) {
    updateData.status = ProfileSubmissionStatus.SUBMITTED;
    updateData.submittedAt = new Date();
  }

  return updateData;
}

type AuthFileRequest = AuthRequest & {
  file?: Express.Multer.File;
};

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-z0-9.\-_]/gi, '_');
}

function buildStorageKey(submissionId: string, questionId: string, originalName: string) {
  const safeName = sanitizeFilename(originalName);
  const unique = randomUUID();
  return `profile-submissions/${submissionId}/${questionId}/${unique}-${safeName}`;
}

export const profileSubmissionController = {
  async getCurrent(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const submission = await prisma.profileSubmission.findFirst({
        where: {
          userId,
          status: { not: ProfileSubmissionStatus.ARCHIVED },
        },
        include: includeSubmissionRelations,
        orderBy: { createdAt: 'desc' },
      });

      return res.json(submission);
    } catch (error: any) {
      console.error('Error fetching current profile submission:', error);
      return res.status(500).json({ error: 'Error fetching profile submission' });
    }
  },

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const submission = await prisma.profileSubmission.findUnique({
        where: { id },
        include: includeSubmissionRelations,
      });

      if (!submission || submission.userId !== userId) {
        return res.status(404).json({ error: 'Profile submission not found' });
      }

      return res.json(submission);
    } catch (error: any) {
      console.error('Error fetching profile submission:', error);
      return res.status(500).json({ error: 'Error fetching profile submission' });
    }
  },

  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const company = await getUserCompany(userId);

      const submission = await prisma.profileSubmission.create({
        data: {
          userId,
          edtechCompanyId: company?.id ?? null,
          answers: req.body.answers ?? {},
          summarySnapshot: req.body.summarySnapshot ?? {},
          summaryText: req.body.summaryText ?? null,
          consentData: req.body.consentData ?? {},
          sectionProgress: req.body.sectionProgress ?? {},
        },
      });

      const result = await prisma.profileSubmission.findUnique({
        where: { id: submission.id },
        include: includeSubmissionRelations,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating profile submission:', error);
      return res.status(500).json({ error: 'Error creating profile submission' });
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const body = req.body ?? {};

      const submission = await prisma.profileSubmission.findUnique({
        where: { id },
      });

      if (!submission || submission.userId !== userId) {
        return res.status(404).json({ error: 'Profile submission not found' });
      }

      const shouldSubmit =
        body.status === ProfileSubmissionStatus.SUBMITTED &&
        submission.status !== ProfileSubmissionStatus.SUBMITTED;

      const updateData = buildUpdatePayload(body, shouldSubmit);

      const updated = await prisma.profileSubmission.update({
        where: { id },
        data: updateData,
        include: includeSubmissionRelations,
      });

      return res.json(updated);
    } catch (error: any) {
      console.error('Error updating profile submission:', error);
      return res.status(500).json({ error: 'Error updating profile submission' });
    }
  },

  async uploadAttachment(req: AuthFileRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const { questionId } = req.body;
      const file = req.file;

      if (!questionId || typeof questionId !== 'string') {
        return res.status(400).json({ error: 'questionId is required' });
      }

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const submission = await prisma.profileSubmission.findUnique({
        where: { id },
      });

      if (!submission || submission.userId !== userId) {
        return res.status(404).json({ error: 'Profile submission not found' });
      }

      const key = buildStorageKey(submission.id, questionId, file.originalname);

      await uploadFile({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      const attachment = await prisma.profileAttachment.create({
        data: {
          submissionId: submission.id,
          questionId,
          filename: file.originalname,
          fileUrl: key,
          contentType: file.mimetype,
          sizeBytes: file.size,
          storageProvider: 'r2',
        },
      });

      const downloadUrl = await getFileDownloadUrl(key);

      return res.status(201).json({
        ...attachment,
        downloadUrl,
      });
    } catch (error: any) {
      console.error('Error uploading attachment:', error);
      return res.status(500).json({ error: 'Error uploading attachment' });
    }
  },

  async deleteAttachment(req: AuthRequest, res: Response) {
    try {
      const { id, attachmentId } = req.params;
      const userId = req.userId!;

      const submission = await prisma.profileSubmission.findUnique({
        where: { id },
      });

      if (!submission || submission.userId !== userId) {
        return res.status(404).json({ error: 'Profile submission not found' });
      }

      const attachment = await prisma.profileAttachment.findUnique({
        where: { id: attachmentId },
      });

      if (!attachment || attachment.submissionId !== submission.id) {
        return res.status(404).json({ error: 'Attachment not found' });
      }

      await deleteFile(attachment.fileUrl);

      await prisma.profileAttachment.delete({
        where: { id: attachment.id },
      });

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting attachment:', error);
      return res.status(500).json({ error: 'Error deleting attachment' });
    }
  },

  async getAttachmentUrl(req: AuthRequest, res: Response) {
    try {
      const { id, attachmentId } = req.params;
      const userId = req.userId!;

      const submission = await prisma.profileSubmission.findUnique({
        where: { id },
      });

      if (!submission || submission.userId !== userId) {
        return res.status(404).json({ error: 'Profile submission not found' });
      }

      const attachment = await prisma.profileAttachment.findUnique({
        where: { id: attachmentId },
      });

      if (!attachment || attachment.submissionId !== submission.id) {
        return res.status(404).json({ error: 'Attachment not found' });
      }

      const url = await getFileDownloadUrl(attachment.fileUrl);

      return res.json({ url });
    } catch (error: any) {
      console.error('Error getting attachment url:', error);
      return res.status(500).json({ error: 'Error getting attachment url' });
    }
  },
};


