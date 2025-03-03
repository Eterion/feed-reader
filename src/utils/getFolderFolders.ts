import type { Database } from '@/types/Database';
import type { Folder } from '@/types/Folder';

export function getFolderFolders(
  folderId: number,
  { folders }: Pick<Database, 'folders'>,
  result: Folder[] = [],
): Folder[] {
  const children = folders.filter((folder) => folder.parentId === folderId);
  result.push(...children);
  children.forEach((child) => getFolderFolders(child.id, { folders }, result));
  return result;
}
