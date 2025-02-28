import type { Article } from '@/types/Article';
import type { Feed } from '@/types/Feed';
import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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

export async function readDb(): Promise<Database> {
  await ensureDbFile();
  const db = await readFile(DB_FILE, 'utf8');
  return JSON.parse(db);
}

export async function writeDb(db: Database = { articles: [], feeds: [] }) {
  await writeFile(DB_FILE, JSON.stringify(db), 'utf8');
}
