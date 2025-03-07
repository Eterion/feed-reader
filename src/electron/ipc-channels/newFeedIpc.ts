import type { Feed } from '@/types/Feed';
import { isNotNil, omit } from 'es-toolkit';
import RssParser from 'rss-parser';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { generateFeedId } from '../utils/generateFeedId';
import { useDb } from '../utils/useDb';

export const newFeedIpc: IpcChannel<[url: string, parentId?: number], Feed> = {
  name: IpcName.NewFeed,
  handler: async (_event, url, parentId) => {
    new URL(url); // Check if url is valid
    return await useDb(async (db) => {
      if (db.feeds.some((feed) => feed.url === url))
        throw new Error('Feed already exists.');
      const parser = new RssParser();
      const rss = await parser.parseURL(url);
      const feed: Feed = {
        data: omit(rss, ['items']),
        id: await generateFeedId(),
        name: rss.title,
        url: url,
        ...(isNotNil(parentId) && { parentId }),
      };
      db.feeds.push(feed);
      return feed;
    });
  },
};
