import type { Database } from '@/types/Database';
import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { updateTrayIcon } from '../tray';

const DB_FILE = join(process.cwd(), 'db.json');

async function ensureDbFile() {
  try {
    await access(DB_FILE, constants.W_OK);
  } catch {
    await writeDb({
      articles: [],
      feeds: [],
      folders: [],
    });
  }
}

function setTrayIconFromUnreadCount(db: Database) {
  updateTrayIcon({
    unreadCount: db.articles.filter((article) => {
      return !article.isRead;
    }).length,
  });
}

export async function readDb(): Promise<Database> {
  await ensureDbFile();
  const fileContents = await readFile(DB_FILE, 'utf8');
  const db: Database = JSON.parse(fileContents);
  setTrayIconFromUnreadCount(db);
  return db;
}

export async function writeDb(db: Database) {
  setTrayIconFromUnreadCount(db);
  await writeFile(DB_FILE, JSON.stringify(db), 'utf8');
}
