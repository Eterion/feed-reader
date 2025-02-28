import type { Feed } from '@/types/Feed';
import { omit } from 'es-toolkit';
import type { FastifyPluginAsync } from 'fastify';
import RssParser from 'rss-parser';
import { generateFeedId } from './utils/generateFeedId';
import { readDb, writeDb } from './utils/readOrWriteDb';

export const addFeed: FastifyPluginAsync = async (server) => {
  server.put<{
    Body: { url: string };
  }>('/feeds', async (request, reply) => {
    const db = await readDb();
    if (db.feeds.some((feed) => feed.url === request.body.url))
      return reply.conflict('Feed already exists.');
    const parser = new RssParser();
    const rss = await parser.parseURL(request.body.url);
    const feed: Feed = {
      data: omit(rss, ['items']),
      id: await generateFeedId(),
      name: rss.title,
      url: request.body.url,
    };
    db.feeds.push(feed);
    await writeDb(db);
    reply.send(feed);
  });
};
