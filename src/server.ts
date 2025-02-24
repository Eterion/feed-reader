import fastifySensible from '@fastify/sensible';
import fastifyVite from '@fastify/vite';
import { randomBytes } from 'crypto';
import { isAfter, parseISO } from 'date-fns';
import { omit } from 'es-toolkit';
import fastify from 'fastify';
import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import RssParser from 'rss-parser';
import type { Article } from './types/Article';
import type { Feed } from './types/Feed';

const DB_FILE = join(process.cwd(), 'db.json');

interface Database {
  articles: Article[];
  feeds: Feed[];
}

async function ensureDbFile() {
  try {
    await access(DB_FILE, constants.W_OK);
  } catch {
    await writeDb();
  }
}

async function readDb(): Promise<Database> {
  await ensureDbFile();
  const db = await readFile(DB_FILE, 'utf8');
  return JSON.parse(db);
}

async function writeDb(db: Database = { articles: [], feeds: [] }) {
  await writeFile(DB_FILE, JSON.stringify(db), 'utf8');
}

async function generateFeedId() {
  const { feeds } = await readDb();
  let id: string;
  do {
    id = randomBytes(2).toString('hex');
  } while (feeds.some((feed) => feed.id === id));
  return id;
}

async function downloadFeedArticles(feedIds: string[] = []) {
  const db = await readDb();
  const rssParser = new RssParser();
  const feeds = await Promise.all(
    db.feeds
      .filter((feed) => {
        if (feedIds.length) return feedIds.includes(feed.id);
        return true;
      })
      .map(async (feed) => ({
        feedId: feed.id,
        data: await rssParser.parseURL(feed.url),
      })),
  );
  const items = feeds.flatMap(({ data, feedId }) =>
    data.items.map((item) => ({
      feedId,
      data: item,
    })),
  );
  const now = new Date();
  const getArticleDate = (articleData: Article['data']) =>
    articleData.isoDate ? parseISO(articleData.isoDate) : now;
  items.forEach((item) => {
    const itemLink = item.data.link;
    const itemDate = getArticleDate(item.data);
    if (itemLink) {
      const downloadedArticle = db.articles.find((article) => {
        const isSameFeed = article.feedId === item.feedId;
        const isSameLink = article.link === itemLink;
        return isSameFeed && isSameLink;
      });
      if (downloadedArticle) {
        if (isAfter(itemDate, getArticleDate(downloadedArticle.data))) {
          downloadedArticle.data = item.data;
          downloadedArticle.isRead = false;
        }
      } else {
        db.articles.push({
          data: item.data,
          feedId: item.feedId,
          isRead: false,
          link: itemLink,
        });
      }
    }
  });
  await writeDb(db);
  return db;
}

const server = fastify();
await server.register(fastifyVite, {
  root: process.cwd(),
  spa: true,
});

server.register(fastifySensible);
server.get('/*', (_, reply) => reply.html());

server.get('/refresh', async (_, reply) => {
  const db = await downloadFeedArticles();
  reply.send(db);
});

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

server.post<{
  Body: { feedId: string; link: string }[];
}>('/mark-read', async (request, reply) => {
  const db = await readDb();
  const articles = db.articles.filter((article) => {
    return request.body.some((item) => {
      const isSameFeed = item.feedId === article.feedId;
      const isSameLink = item.link === article.link;
      return isSameFeed && isSameLink;
    });
  });
  articles.forEach((article) => {
    article.isRead = true;
  });
  await writeDb(db);
  reply.status(204);
});

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

await server.vite.ready();
const port = 5173;
await server.listen({ port });
console.log('Local: http://localhost:' + port);
