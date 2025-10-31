import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Helper para ordenamiento
function getOrderBy(sortBy: string, sortOrder: string): any {
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  
  const sortMap: { [key: string]: any } = {
    name: { name: order },
    createdAt: { createdAt: order },
    pedagogicalScore: { pedagogicalScore: order },
    adaptabilityScore: { adaptabilityScore: order },
    impactScore: { impactScore: order },
    organizationalScore: { organizationalScore: order },
    technicalQualityScore: { technicalQualityScore: order },
    affordabilityScore: { affordabilityScore: order }
  };
  
  return sortMap[sortBy] || { createdAt: 'desc' };
}

export const catalogController = {
  async getSolutions(req: Request, res: Response) {
    try {
      const {
        levels,
        areas,
        productTypes,
        contexts,
        devices,
        priceRange,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = '1',
        limit = '20'
      } = req.query;

      const where: any = {
        status: 'APPROVED'
      };

      // Filtros
      if (levels) {
        where.levels = { hasSome: Array.isArray(levels) ? levels : [levels] };
      }
      if (areas) {
        where.areas = { hasSome: Array.isArray(areas) ? areas : [areas] };
      }
      if (productTypes) {
        where.productTypes = { hasSome: Array.isArray(productTypes) ? productTypes : [productTypes] };
      }
      if (contexts) {
        where.contexts = { hasSome: Array.isArray(contexts) ? contexts : [contexts] };
      }
      if (devices) {
        where.devices = { hasSome: Array.isArray(devices) ? devices : [devices] };
      }
      if (priceRange) {
        where.priceRange = priceRange;
      }
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [solutions, total] = await Promise.all([
        prisma.solution.findMany({
          where,
          select: {
            id: true,
            name: true,
            description: true,
            websiteUrl: true,
            logoUrl: true,
            pedagogicalScore: true,
            adaptabilityScore: true,
            impactScore: true,
            organizationalScore: true,
            technicalQualityScore: true,
            affordabilityScore: true,
            edtechCompany: {
              select: {
                name: true,
                country: true,
                contactEmail: true
              }
            }
          },
          skip,
          take: limitNum,
          orderBy: getOrderBy(sortBy as string, sortOrder as string)
        }),
        prisma.solution.count({ where })
      ]);

      res.json({
        solutions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSolution(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const solution = await prisma.solution.findUnique({
        where: {
          id,
          status: 'APPROVED'
        },
        include: {
          edtechCompany: true,
          evidences: true
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

  async getFilters(req: Request, res: Response) {
    try {
      const catalogs = await prisma.catalog.findMany({
        where: { active: true },
        orderBy: [{ type: 'asc' }, { order: 'asc' }]
      });

      // Agrupar por tipo
      const filters: any = {};
      catalogs.forEach(cat => {
        if (!filters[cat.type]) {
          filters[cat.type] = [];
        }
        filters[cat.type].push({
          value: cat.value,
          label: cat.label
        });
      });

      res.json(filters);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async contactEdTech(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message, contactInfo } = req.body;

      const solution = await prisma.solution.findUnique({
        where: { id },
        include: {
          edtechCompany: true
        }
      });

      if (!solution) {
        return res.status(404).json({ error: 'Solution not found' });
      }

      // TODO: Enviar email a la EdTech con el mensaje del consultante

      res.json({ message: 'Contact request sent' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async exportCatalog(req: Request, res: Response) {
    // TODO: Implementar exportación CSV/PDF con filtros aplicados
    res.json({ message: 'Export not implemented yet' });
  }
};

