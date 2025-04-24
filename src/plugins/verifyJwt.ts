import { FastifyRequest, FastifyReply } from 'fastify';
import { jwtVerify } from 'jose';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies?.token;

  console.log('[verifyJwt] Token extrait du cookie :', token ?? '(aucun)');

  if (!token) {
    console.warn('[verifyJwt] Aucun token trouvé dans les cookies.');
    return reply.status(401).send({ error: 'Missing token' });
  }

  try {
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });

    console.log('[verifyJwt] Token valide. Payload :', payload);

    request.user = {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (err) {
    console.error('[verifyJwt] Échec de vérification du token :', err);
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}
