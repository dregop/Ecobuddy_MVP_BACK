import { FastifyInstance } from 'fastify';
import { prisma } from '../services/prisma';

export default async function impactRoutes(fastify: FastifyInstance) {
  // GET /impact - récupère tous les impacts
  fastify.get('/', async () => {
    return await prisma.impact.findMany();
  });

  // POST /impact - enregistre un impact utilisateur
  fastify.post('/', async (request, reply) => {
    try {
      const body = request.body as {
        userId: string;
        totalImpact: number;
        categoryDetails: Record<string, number>;
        answers: Record<string, any>;
      };

      const impact = await prisma.impact.create({
        data: {
          userId: body.userId,
          totalImpact: body.totalImpact,
          categoryDetails: body.categoryDetails,
          answers: body.answers,
        },
      });

      return reply.code(201).send(impact);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Failed to create impact' });
    }
  });

  fastify.get('/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const impact = await prisma.impact.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // si tu stockes plusieurs impacts
    });

    if (!impact) {
      return reply.code(200).send({
        totalImpact: 0,
        categoryDetails: {},
        answers: {},
      }); // ✅ Évite les erreurs côté front
    }

    return reply.send(impact);
  });

}
