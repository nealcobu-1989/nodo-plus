import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { calculateTrafficLights } from '../services/trafficLight.service';

const prisma = new PrismaClient();

export const adminController = {
  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const [edtechs, solutions, institutions, pending] = await Promise.all([
        prisma.edTechCompany.count(),
        prisma.solution.count({ where: { status: 'APPROVED' } }),
        prisma.institution.count({ where: { status: 'APPROVED' } }),
        prisma.solution.count({ where: { status: 'PENDING' } })
      ]);

      res.json({
        stats: {
          edtechs,
          solutions,
          institutions,
          pending
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPendingProfiles(req: Request, res: Response) {
    try {
      const profiles = await prisma.solution.findMany({
        where: { status: 'PENDING' },
        include: {
          edtechCompany: true,
          evidences: true
        },
        orderBy: { createdAt: 'asc' }
      });

      res.json(profiles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const solution = await prisma.solution.findUnique({
        where: { id },
        include: {
          edtechCompany: true,
          evidences: true
        }
      });

      if (!solution) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async approveProfile(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.userId!;

      // Calcular semáforos
      const solution = await prisma.solution.findUnique({
        where: { id }
      });

      if (!solution) {
        return res.status(404).json({ error: 'Solution not found' });
      }

      const trafficLights = await calculateTrafficLights(solution.questionnaireData as any);

      // Aprobar y actualizar semáforos
      const approved = await prisma.solution.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: adminId,
          ...trafficLights
        }
      });

      res.json(approved);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async rejectProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const solution = await prisma.solution.update({
        where: { id },
        data: {
          status: 'REJECTED'
        }
      });

      // TODO: Enviar email de rechazo con motivo

      res.json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async requestChanges(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { comments } = req.body;

      const solution = await prisma.solution.update({
        where: { id },
        data: {
          status: 'CHANGES_REQUESTED'
        }
      });

      // TODO: Enviar email con comentarios

      res.json(solution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCatalogs(req: Request, res: Response) {
    try {
      const catalogs = await prisma.catalog.findMany({
        orderBy: [{ type: 'asc' }, { order: 'asc' }]
      });

      res.json(catalogs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createCatalog(req: Request, res: Response) {
    try {
      const catalog = await prisma.catalog.create({
        data: req.body
      });

      res.status(201).json(catalog);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateCatalog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const catalog = await prisma.catalog.update({
        where: { id },
        data: req.body
      });

      res.json(catalog);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteCatalog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.catalog.delete({
        where: { id }
      });

      res.json({ message: 'Catalog deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getQuestions(req: Request, res: Response) {
    // TODO: Implementar gestión de preguntas
    res.json({ message: 'Questions management not implemented yet' });
  },

  async createQuestion(req: Request, res: Response) {
    // TODO: Implementar
    res.json({ message: 'Not implemented yet' });
  },

  async updateQuestion(req: Request, res: Response) {
    // TODO: Implementar
    res.json({ message: 'Not implemented yet' });
  },

  async deleteQuestion(req: Request, res: Response) {
    // TODO: Implementar
    res.json({ message: 'Not implemented yet' });
  },

  async getTrafficLightRules(req: Request, res: Response) {
    try {
      const rules = await prisma.trafficLightRule.findMany({
        where: { active: true }
      });

      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateTrafficLightRules(req: Request, res: Response) {
    // TODO: Implementar actualización de reglas
    res.json({ message: 'Not implemented yet' });
  },

  async getMetrics(req: Request, res: Response) {
    // TODO: Implementar métricas detalladas
    res.json({ message: 'Detailed metrics not implemented yet' });
  },

  async exportSolutions(req: Request, res: Response) {
    // TODO: Implementar exportación CSV/PDF
    res.json({ message: 'Export not implemented yet' });
  },

  async exportInstitutions(req: Request, res: Response) {
    // TODO: Implementar exportación CSV/PDF
    res.json({ message: 'Export not implemented yet' });
  },

  async getConsultants(req: Request, res: Response) {
    try {
      const consultants = await prisma.user.findMany({
        where: { role: 'CONSULTANT' },
        include: {
          consultantProfile: true
        }
      });

      res.json(consultants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createConsultant(req: Request, res: Response) {
    // TODO: Implementar creación de consultante con email automático
    res.json({ message: 'Not implemented yet' });
  },

  async activateConsultant(req: Request, res: Response) {
    // TODO: Implementar
    res.json({ message: 'Not implemented yet' });
  },

  async deactivateConsultant(req: Request, res: Response) {
    // TODO: Implementar
    res.json({ message: 'Not implemented yet' });
  },

  async getInstitutions(req: Request, res: Response) {
    try {
      const institutions = await prisma.institution.findMany({
        include: {
          user: {
            select: {
              email: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json({ institutions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getInstitution(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const institution = await prisma.institution.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
              createdAt: true
            }
          }
        }
      });

      if (!institution) {
        return res.status(404).json({ error: 'Institution not found' });
      }

      res.json(institution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Gestión de Profile Submissions
  async getAllSubmissions(req: AuthRequest, res: Response) {
    try {
      const submissions = await prisma.profileSubmission.findMany({
        where: {
          status: {
            not: 'ARCHIVED'
          }
        },
        include: {
          user: {
            select: {
              email: true,
              role: true
            }
          },
          edtechCompany: {
            select: {
              name: true,
              userId: true
            }
          },
          institution: {
            select: {
              name: true,
              userId: true
            }
          },
          solution: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSubmission(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const submission = await prisma.profileSubmission.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
              role: true
            }
          },
          edtechCompany: {
            select: {
              name: true,
              userId: true
            }
          },
          institution: {
            select: {
              name: true,
              userId: true
            }
          },
          solution: {
            select: {
              name: true
            }
          },
          attachments: true
        }
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json(submission);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSubmission(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { answers, consentData, sectionProgress, summarySnapshot, summaryText, status } = req.body;

      const submission = await prisma.profileSubmission.findUnique({
        where: { id }
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const updated = await prisma.profileSubmission.update({
        where: { id },
        data: {
          answers: answers ?? submission.answers,
          consentData: consentData ?? submission.consentData,
          sectionProgress: sectionProgress ?? submission.sectionProgress,
          summarySnapshot: summarySnapshot ?? submission.summarySnapshot,
          summaryText: summaryText ?? submission.summaryText,
          status: status ?? submission.status,
          updatedAt: new Date()
        }
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async archiveSubmission(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const submission = await prisma.profileSubmission.findUnique({
        where: { id }
      });

      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      const archived = await prisma.profileSubmission.update({
        where: { id },
        data: {
          status: 'ARCHIVED'
        }
      });

      res.json(archived);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

