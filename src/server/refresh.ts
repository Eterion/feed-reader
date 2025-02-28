import type { FastifyPluginAsync } from 'fastify';
import { downloadFeedArticles } from './utils/downloadFeedArticles';

export const refresh: FastifyPluginAsync = async (server) => {
  server.get('/refresh', async (_, reply) => {
    const db = await downloadFeedArticles();
    reply.send(db);
  });
};
