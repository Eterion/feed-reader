import { useReadonlyDb } from './useDb';

export async function generateFolderId() {
  return await useReadonlyDb((db) => {
    const knownIds = db.folders.map(({ id }) => id);
    return Math.max(0, ...knownIds) + 1;
  });
}
