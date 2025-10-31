import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const edtechController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const profile = await prisma.edTechCompany.findUnique({
        where: { userId },
        include: {
          solutions: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const data = req.body;

      const profile = await prisma.edTechCompany.update({
        where: { userId },
        data
      });

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSolutions(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;

      const company = await prisma.edTechCompany.findUnique({
        where: { userId }
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const solutions = await prisma.solution.findMany({
        where: { edtechCompanyId: company.id },
        include: {
          evidences: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(solutions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createSolution(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const data = req.body;

      const company = await prisma.edTechCompany.findUnique({
        where: { userId }
      });

      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      const solution = await prisma.solution.create({
        data: {
          ...data,
          edtechCompanyId: company.id,
          status: 'DRAFT'
        }
      });

      res.status(201).json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSolution(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const company = await prisma.edTechCompany.findUnique({
        where: { userId }
      });

      const solution = await prisma.solution.findFirst({
        where: {
          id,
          edtechCompanyId: company?.id
        },
        include: {
          evidences: true,
          edtechCompany: true
        }
      });

      if (!solution) {
        return res.status(404).json({ error: 'Solution not found' });
      }

      res.json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSolution(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;
      const data = req.body;

      const company = await prisma.edTechCompany.findUnique({
        where: { userId }
      });

      const solution = await prisma.solution.updateMany({
        where: {
          id,
          edtechCompanyId: company?.id,
          status: { in: ['DRAFT', 'CHANGES_REQUESTED'] }
        },
        data
      });

      if (solution.count === 0) {
        return res.status(404).json({ error: 'Solution not found or cannot be edited' });
      }

      const updatedSolution = await prisma.solution.findUnique({
        where: { id }
      });

      res.json(updatedSolution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async submitSolution(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const company = await prisma.edTechCompany.findUnique({
        where: { userId }
      });

      const solution = await prisma.solution.updateMany({
        where: {
          id,
          edtechCompanyId: company?.id
        },
        data: {
          status: 'PENDING'
        }
      });

      if (solution.count === 0) {
        return res.status(404).json({ error: 'Solution not found' });
      }

      res.json({ message: 'Solution submitted for review' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async previewSolution(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const company = await prisma.edTechCompany.findUnique({
        where: { userId }
      });

      const solution = await prisma.solution.findFirst({
        where: {
          id,
          edtechCompanyId: company?.id
        },
        include: {
          evidences: true,
          edtechCompany: true
        }
      });

      if (!solution) {
        return res.status(404).json({ error: 'Solution not found' });
      }

      res.json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async addEvidence(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const evidence = await prisma.evidence.create({
        data: {
          ...data,
          solutionId: id
        }
      });

      res.status(201).json(evidence);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteEvidence(req: AuthRequest, res: Response) {
    try {
      const { evidenceId } = req.params;

      await prisma.evidence.delete({
        where: { id: evidenceId }
      });

      res.json({ message: 'Evidence deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

