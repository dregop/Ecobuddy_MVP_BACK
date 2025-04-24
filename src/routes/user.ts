import { FastifyInstance } from 'fastify';
import { prisma } from '../services/prisma';
import supabase from '../services/supabase';
import dotenv from 'dotenv'
import { verifyJwt } from '../plugins/verifyJwt';
import { jwtVerify } from 'jose';

dotenv.config();

export default async function userRoutes(fastify: FastifyInstance) {
  // POST /user/invite
  fastify.post('/invite', async (request, reply) => {
    const { email, pseudo, answers, totalImpact, categoryDetails } = request.body as {
      email: string;
      pseudo: string;
      totalImpact: number;
      categoryDetails: Record<string, number>;
      answers: Record<string, any>;
    };

  // 1. Crée d'abord le user dans Supabase Auth
  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: false,
  });

  if (createError && createError.message !== 'User already registered') {
    return reply.code(400).send({ error: createError.message });
  }

  // 2. Enregistre dans Prisma avec le même ID que Supabase
  const user = await prisma.user.upsert({
    where: { id: data.user?.id },
    update: { pseudo },
    create: {
      id: data.user?.id,
      email,
      pseudo,
    },
  });

  // 3. Envoie le lien magique avec redirect
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.FRONT_URL}`,
    },
  });

  if (otpError) {
    return reply.code(400).send({ error: otpError.message });
  }

  // 4 Enregistre aussi l'impact si présent
  if (answers && totalImpact) {
    await prisma.impact.create({
      data: {
        userId: user.id,
        totalImpact,
        categoryDetails,
        answers,
      },
    });
  }

    return reply.code(200).send({ message: 'Invitation sent!' });
  });

  fastify.post('/complete-registration', { preHandler: verifyJwt }, async (request, reply) => {
    const { password, pseudo } = request.body as {
      password: string;
      pseudo?: string;
    };

    const user = request.user; // issu du JWT via verifyJwt
    if (!user) return reply.status(401).send({ error: 'Non authentifié' });

  if (password.length < 6) {
    return reply.status(400).send({
      error: 'Le mot de passe doit contenir au moins 6 caractères.',
    });
  }

    // 1. Définir le mot de passe via l'API admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.sub, {
      password,
    });

    if (updateError) {
      request.log.error(updateError, 'Erreur lors de la définition du mot de passe');
      return reply.code(500).send({ error: 'Impossible de définir le mot de passe.' });
    }

    // 2. Mettre à jour la table User (Prisma)
    await prisma.user.update({
      where: { id: user.sub },
      data: {
        activated: true,
        ...(pseudo && { pseudo }), // ajoute pseudo s'il est présent
      },
    });

    return reply.send({ message: 'Compte activé avec succès' });
  });


  // POST /user/login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Vérifie si le compte est activé
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.activated) {
    return reply.code(401).send({ error: 'Merci de valider votre compte via le lien reçu par email.' });
  }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      request.log.warn({ email, reason: error?.message || 'Pas de session' }, 'Échec de connexion');
      return reply.code(401).send({ error: 'Email ou mot de passe invalide' });
    }

    const { access_token } = data.session;

    reply.setCookie('token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 // 1h
    });

    console.log('[COOKIE] Token envoyé au client via cookie:', access_token);

    return reply.send({
      session: data.session,
      user: data.user,
    });
  });

  // POST /user/logout
  fastify.post('/logout', async (request, reply) => {
  reply.clearCookie('token', { path: '/' });
  return reply.send({ success: true });
});
}
