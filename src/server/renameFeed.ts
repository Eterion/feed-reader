import type { FastifyPluginAsync } from 'fastify';
import { readDb, writeDb } from './utils/readOrWriteDb';

export const renameFeed: FastifyPluginAsync = async (server) => {
  server.patch<{
    Params: { feedId: string };
    Body: { name: string };
  }>('/feeds/:feedId', async (request, reply) => {
    const db = await readDb();
    const feed = db.feeds.find((feed) => {
      return feed.id === request.params.feedId;
    });
    if (feed) {
      feed.name = request.body.name;
      await writeDb(db);
      reply.status(204);
    } else {
      reply.notFound('Feed not found.');
    }
  });
};
