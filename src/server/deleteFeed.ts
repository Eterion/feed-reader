import type { FastifyPluginAsync } from 'fastify';
import { readDb, writeDb } from './utils/readOrWriteDb';

export const deleteFeed: FastifyPluginAsync = async (server) => {
  server.delete<{
    Params: { feedId: string };
  }>('/feeds/:feedId', async (request, reply) => {
    const db = await readDb();
    if (db.feeds.some((feed) => feed.id === request.params.feedId)) {
      db.feeds = db.feeds.filter((feed) => {
        return feed.id !== request.params.feedId;
      });
      db.articles = db.articles.filter((article) => {
        return article.feedId !== request.params.feedId;
      });
      await writeDb(db);
      reply.status(204);
    } else {
      reply.notFound('Feed not found.');
    }
  });
};
