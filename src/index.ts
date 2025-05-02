// backend/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import supabase from './services/supabase';
import impactRoutes from './routes/impact';
import userRoutes from './routes/user';
import { verifyJwt } from './plugins/verifyJwt';
import cookie from '@fastify/cookie';
import { jwtVerify } from 'jose';
import { prisma } from './services/prisma';
import dailyImpactRoutes from './routes/dailyImpact';

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: 'http://127.0.0.1:8081',
  credentials: true,
});


await fastify.register(cookie);

fastify.decorate('supabase', supabase);

// routes
fastify.register(impactRoutes, { prefix: '/impact' });
fastify.register(dailyImpactRoutes, { prefix: '/daily-impact' });
fastify.register(userRoutes, { prefix: '/user' });

fastify.get('/', async () => {
  return { status: 'EcoBuddy backend is running' };
});

// Route GET /auth/callback
fastify.get('/auth/callback', async (request, reply) => {
  const { token } = request.query as { token?: string };

  if (!token) {
    console.log('token manquant');
    return reply.status(400).send({ error: 'Token manquant' });
  }

  try {
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!);
    await jwtVerify(token, secret, { algorithms: ['HS256'] });

    // Pose le cookie HttpOnly
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1h
    });

    console.log('[COOKIE] Token envoyé au client via cookie:', token);

    // Redirige vers ton écran React Native
    return reply.send({ success: true });
  } catch (err) {
    request.log.error(err, 'Échec vérification JWT');
    return reply.status(401).send({ error: 'Token invalide' });
  }
});


fastify.get('/me', { preHandler: verifyJwt }, async (request, reply) => {
  const email = request.user?.email;

  if (!email) {
    return reply.code(401).send({ error: 'Utilisateur non authentifié' });
  }

  const user = await prisma.user.findUnique({
    where: { email, activated: true },
    select: {
      id: true,
      email: true,
      pseudo: true,
    },
  });

  if (!user) {
    return reply.code(404).send({ error: 'Utilisateur introuvable' });
  }
  
  console.log('[ME] Utilisateur récupéré :', user);
  return { user };
});

fastify.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });