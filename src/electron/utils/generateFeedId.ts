import { randomBytes } from 'node:crypto';
import { useReadonlyDb } from './useDb';

export async function generateFeedId() {
  return await useReadonlyDb((db) => {
    let id: string;
    do {
      id = randomBytes(2).toString('hex');
    } while (db.feeds.some((feed) => feed.id === id));
    return id;
  });
}
