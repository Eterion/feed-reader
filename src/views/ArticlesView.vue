<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue';
import { getFolderArticles } from '@/utils/getFolderArticles';
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import {
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
  startOfDay,
  sub,
} from 'date-fns';
import { isNotNil } from 'es-toolkit';

const props = defineProps<{
  folderId?: number;
  feedUrl?: string;
  articleLink?: string;
}>();

const feedsStore = useFeedsStore();
const feed = reactive(useFeed(() => props.feedUrl));

const folderArticles = computed(() => {
  if (isNotNil(props.folderId))
    return getFolderArticles(props.folderId, {
      articles: feedsStore.articles,
      feeds: feedsStore.feeds,
      folders: feedsStore.folders,
    });
});

const articleList = computed(() => {
  return folderArticles.value || feed.articles;
});

const mappedArticles = computed(() => {
  const now = new Date();
  return articleList.value.map((article) => ({
    ...article,
    isUnread: !article.isRead,
    isActive: article.link === props.articleLink,
    isoDate: article.data.isoDate ? parseISO(article.data.isoDate) : now,
    markRead: async () => {
      if (props.feedUrl)
        await feedsStore.markFeedRead([
          { feedUrl: props.feedUrl, link: article.link },
        ]);
    },
    markUnread: async () => {
      if (props.feedUrl)
        await feedsStore.markFeedUnread([
          { feedUrl: props.feedUrl, link: article.link },
        ]);
    },
  }));
});

const sortedArticles = computed(() => {
  return [...mappedArticles.value].sort((a, b) => {
    return isAfter(a.isoDate, b.isoDate) ? -1 : 1;
  });
});

const groupedArticles = computed(() => {
  const today = startOfDay(new Date());
  const weekAgo = sub(today, { weeks: 1 });
  return [
    {
      title: 'Today',
      items: sortedArticles.value.filter((article) => {
        return isAfter(article.isoDate, today);
      }),
    },
    {
      title: 'This week',
      items: sortedArticles.value.filter((article) => {
        return isWithinInterval(article.isoDate, {
          start: weekAgo,
          end: today,
        });
      }),
    },
    {
      title: 'More than 7 days ago',
      items: sortedArticles.value.filter((article) => {
        return isBefore(article.isoDate, weekAgo);
      }),
    },
  ];
});
</script>

<template>
  <div :class="$style.el">
    <div v-if="sortedArticles.length">
      <template v-for="group in groupedArticles" :key="group.title">
        <div v-if="group.items.length" :class="$style.group">
          <div :class="$style.group_title">{{ group.title }}</div>
          <ul :class="$style.list">
            <li v-for="article in group.items" :key="article.link">
              <ArticleItem
                :active="article.isActive"
                :feed-url="article.feedUrl"
                :folder-id="folderId"
                :link="article.link"
                :title="article.data.title"
                :unread="article.isUnread"
                @mark-read="article.markRead"
                @mark-unread="article.markUnread" />
            </li>
          </ul>
        </div>
      </template>
    </div>
    <div v-else>No articles found</div>
  </div>
</template>

<style module lang="scss">
.el {
  padding: 12px 12px 64px;
}

.group {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &_title {
    color: var(--light-text);
    font-size: 0.75rem;
    padding: 10px;
  }
}

.list {
  list-style: none;
  padding: 0;
  & > :where(li):not(:last-child) {
    margin-bottom: 1px;
  }
}
</style>
