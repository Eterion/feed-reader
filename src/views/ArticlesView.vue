<script setup lang="ts">
import ArticleItem from '@/components/ArticleItem.vue';
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import {
  endOfDay,
  isAfter,
  isBefore,
  isToday,
  isWithinInterval,
  parseISO,
  sub,
} from 'date-fns';

const props = defineProps<{
  feedId?: string;
  articleLink?: string;
}>();

const feedsStore = useFeedsStore();
const { articles } = useFeed(() => props.feedId);

const articleLink = computed(() => {
  if (props.articleLink) {
    return decodeURIComponent(props.articleLink);
  }
});

const now = new Date();
const mappedArticles = computed(() => {
  return articles.value.map((article) => ({
    ...article,
    isUnread: !article.isRead,
    isActive: article.link === articleLink.value,
    isoDate: article.data.isoDate ? parseISO(article.data.isoDate) : now,
    markRead: async () => {
      if (props.feedId)
        await feedsStore.markFeedRead([
          { feedId: props.feedId, link: article.link },
        ]);
    },
    markUnread: async () => {
      if (props.feedId)
        await feedsStore.markFeedUnread([
          { feedId: props.feedId, link: article.link },
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
  const yesterday = sub(endOfDay(now), { days: 1 });
  const weekAgo = sub(yesterday, { weeks: 1 });
  return [
    {
      title: 'Today',
      items: sortedArticles.value.filter((article) => {
        return isToday(article.isoDate);
      }),
    },
    {
      title: 'This Week',
      items: sortedArticles.value.filter((article) => {
        return isWithinInterval(article.isoDate, {
          start: yesterday,
          end: weekAgo,
        });
      }),
    },
    {
      title: 'Two Weeks Ago',
      items: sortedArticles.value.filter((article) => {
        return isBefore(article.isoDate, weekAgo);
      }),
    },
  ];
});

const notSelected = computed(() => {
  return !props.feedId;
});
</script>

<template>
  <div :class="$style.el">
    <div v-if="notSelected"></div>
    <div v-else-if="sortedArticles.length">
      <template v-for="group in groupedArticles" :key="group.title">
        <div v-if="group.items.length" :class="$style.group">
          <div :class="$style.group_title">{{ group.title }}</div>
          <ul :class="$style.list">
            <li v-for="article in group.items" :key="article.link">
              <ArticleItem
                :active="article.isActive"
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
