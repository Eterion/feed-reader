export function getFolderFolders(
  folderId: number,
  {
    folders,
  }: {
    folders: Folder[];
  },
  result: Folder[] = [],
): Folder[] {
  const children = folders.filter((folder) => folder.parentId === folderId);
  result.push(...children);
  children.forEach((child) => getFolderFolders(child.id, { folders }, result));
  return result;
}
