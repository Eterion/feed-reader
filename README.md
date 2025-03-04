# feed-reader

> Super simple feed reader without bells and whistles.

Currently works only in development mode - starts an electron app. Feed articles
are downloaded every 10 minutes and stored into `db.json` file in current
directory. Folders and feeds are also in the same db file.

```shell
npm ci
npm run dev
```
