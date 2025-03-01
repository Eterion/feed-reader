import type { FastifyPluginAsync } from 'fastify';
import { readDb, writeDb } from './utils/readOrWriteDb';

export const moveFeed: FastifyPluginAsync = async (server) => {
  server.patch<{
    Body: { feedId: string; folderId?: number };
  }>('/feeds/move', async (request, reply) => {
    const db = await readDb();
    const feed = db.feeds.find((feed) => feed.id === request.body.feedId);
    if (feed) {
      if (request.body.folderId) feed.parentId = request.body.folderId;
      else delete feed.parentId;
      await writeDb(db);
      reply.status(204);
    } else {
      reply.badRequest("Feed doesn't exist.");
    }
  });
};
