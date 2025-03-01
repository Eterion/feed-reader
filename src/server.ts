import fastifySensible from '@fastify/sensible';
import fastifyVite from '@fastify/vite';
import fastify from 'fastify';
import { addFeed } from './server/addFeed';
import { addFolder } from './server/addFolder';
import { deleteFeed } from './server/deleteFeed';
import { markRead } from './server/markRead';
import { markUnread } from './server/markUnread';
import { moveFeed } from './server/moveFeed';
import { refresh } from './server/refresh';
import { renameFeed } from './server/renameFeed';

const server = fastify();
await server.register(fastifyVite, {
  root: process.cwd(),
  spa: true,
});

server.register(fastifySensible);
server.get('/*', (_, reply) => reply.html());

server.register(addFeed);
server.register(addFolder);
server.register(deleteFeed);
server.register(markRead);
server.register(markUnread);
server.register(moveFeed);
server.register(refresh);
server.register(renameFeed);

await server.vite.ready();
const port = 5173;
await server.listen({ port });
console.log('Local: http://localhost:' + port);
