import { randomBytes } from 'node:crypto';
import { readDb } from './readOrWriteDb';

export async function generateFeedId() {
  const { feeds } = await readDb();
  let id: string;
  do {
    id = randomBytes(2).toString('hex');
  } while (feeds.some((feed) => feed.id === id));
  return id;
}
