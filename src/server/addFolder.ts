import type { Folder } from '@/types/Folder';
import type { FastifyPluginAsync } from 'fastify';
import { generateFolderId } from './utils/generateFolderId';
import { readDb, writeDb } from './utils/readOrWriteDb';

export const addFolder: FastifyPluginAsync = async (server) => {
  server.put<{
    Body: { name: string; parentId?: number };
  }>('/folder', async (request, reply) => {
    const db = await readDb();
    const folder: Folder = {
      id: await generateFolderId(),
      name: request.body.name,
      parentId: request.body.parentId,
    };
    db.folders.push(folder);
    await writeDb(db);
    reply.send(folder);
  });
};
