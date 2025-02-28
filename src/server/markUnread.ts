import type { FastifyPluginAsync } from 'fastify';
import { readDb, writeDb } from './utils/readOrWriteDb';

export const markUnread: FastifyPluginAsync = async (server) => {
  server.post<{
    Body: { feedId: string; link: string }[];
  }>('/mark-unread', async (request, reply) => {
    const db = await readDb();
    const articles = db.articles.filter((article) => {
      return request.body.some((item) => {
        const isSameFeed = item.feedId === article.feedId;
        const isSameLink = item.link === article.link;
        return isSameFeed && isSameLink;
      });
    });
    articles.forEach((article) => {
      article.isRead = false;
    });
    await writeDb(db);
    reply.status(204);
  });
};
