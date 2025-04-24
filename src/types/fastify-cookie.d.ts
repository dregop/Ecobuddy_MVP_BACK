import '@fastify/cookie';

declare module 'fastify' {
  interface FastifyReply {
    setCookie(name: string, value: string, options?: any): this;
    clearCookie(name: string, options?: any): this;
  }

  interface FastifyRequest {
    cookies: Record<string, string>;
  }
}
