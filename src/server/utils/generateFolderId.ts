import { readDb } from './readOrWriteDb';

export async function generateFolderId() {
  const db = await readDb();
  const knownIds = db.folders.map(({ id }) => id);
  return Math.max(0, ...knownIds) + 1;
}
