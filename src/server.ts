import fastifySensible from '@fastify/sensible';
import fastifyVite from '@fastify/vite';
import fastify from 'fastify';

const server = fastify();
await server.register(fastifyVite, {
  root: process.cwd(),
  spa: true,
});

server.register(fastifySensible);
server.get('/*', (_, reply) => reply.html());

await server.vite.ready();
const port = 5173;
await server.listen({ port });
console.log('Local: http://localhost:' + port);
