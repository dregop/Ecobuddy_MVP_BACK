import { FastifyInstance } from 'fastify';
import { prisma } from '../services/prisma';
import { subDays } from 'date-fns';

export default async function dailyImpactRoutes(fastify: FastifyInstance) {
  // POST /daily-impact - crée un enregistrement journalier
  fastify.post('/', async (request, reply) => {
    try {
      const { userId, date, dailyImpact, impactDelta } = request.body as {
        userId: string;
        date: string;
        dailyImpact: number;
        impactDelta?: number;
      };

      const impact = await prisma.dailyImpact.create({
        data: {
          userId,
          dailyImpact,
          impactDelta,
        },
      });

      return reply.code(201).send(impact);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Failed to save daily impact' });
    }
  });

  // GET /daily-impact/:userId - récupère tous les impacts d'un utilisateur triés
  fastify.get('/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const impacts = await prisma.dailyImpact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(impacts);
  });

  // GET /daily-impact/:userId/yesterday - récupère l'impact d'hier
  fastify.get('/:userId/yesterday', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const yesterday = subDays(new Date(), 1);

    const impact = await prisma.dailyImpact.findFirst({
      where: {
        userId,
        createdAt: yesterday,
      },
    });

    if (!impact) {
      return reply.send({});
    }

    return reply.send(impact);
  });
}
