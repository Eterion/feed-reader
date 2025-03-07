import type { Database } from '@/types/Database';
import { access, constants, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Promisable } from 'type-fest';
import { updateTrayIcon } from '../tray';

const FILE = join(process.cwd(), 'db.json');

async function ensureDbFile() {
  try {
    await access(FILE, constants.W_OK);
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

async function readDb(): Promise<Database> {
  await ensureDbFile();
  const fileContents = await readFile(FILE, 'utf8');
  const db: Database = JSON.parse(fileContents);
  setTrayIconFromUnreadCount(db);
  return db;
}

async function writeDb(db: Database) {
  setTrayIconFromUnreadCount(db);
  await writeFile(FILE, JSON.stringify(db), 'utf8');
}

async function __useDb<TReturn>(
  callback: (db: Database) => Promisable<TReturn>,
  readonly?: boolean,
): Promise<TReturn> {
  const db = await readDb();
  const result = await callback(db);
  if (!readonly) await writeDb(db);
  return result;
}

export function useDb<TReturn>(
  callback: (db: Database) => Promisable<TReturn>,
): Promise<TReturn> {
  return __useDb(callback);
}

export function useReadonlyDb<TReturn>(
  callback: (db: Database) => Promisable<TReturn>,
): Promise<TReturn> {
  return __useDb(callback, true);
}
