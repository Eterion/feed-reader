<script setup lang="ts">
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { isAfter, parseISO } from 'date-fns';
import { computed } from 'vue';
import { type RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  feedId?: string;
  articleLink?: string;
}>();

const feedsStore = useFeedsStore();
const { articles } = useFeed(() => props.feedId);

const mappedArticles = computed(() => {
  return articles.value.map((article) => ({
    ...article,
    to: {
      params: { articleLink: encodeURIComponent(article.link) },
    } satisfies RouteLocationRaw,
    markUnread: async () => {
      if (props.feedId) {
        await feedsStore.markUnread([
          { feedId: props.feedId, link: article.link },
        ]);
      }
    },
  }));
});

const sortedArticles = computed(() => {
  return [...mappedArticles.value].sort((a, b) => {
    const aDate = a.data.isoDate;
    const bDate = b.data.isoDate;
    if (aDate && bDate)
      return isAfter(parseISO(aDate), parseISO(bDate)) ? -1 : 1;
    if (aDate) return -1;
    if (bDate) return 1;
    return 0;
  });
});

const notSelected = computed(() => {
  return !props.feedId;
});
</script>

<template>
  <div>
    <div v-if="notSelected">Select a feed</div>
    <ul v-else-if="sortedArticles.length">
      <li v-for="article in sortedArticles" :key="article.link">
        <RouterLink
          :to="article.to"
          :class="[$style.link, { [$style.unread]: !article.isRead }]">
          {{ article.data.title }}
        </RouterLink>
        | <a href="" @click.prevent="article.markUnread">Mark unread</a>
      </li>
    </ul>
    <div v-else>No articles found</div>
  </div>
</template>

<style module lang="scss">
.link {
  &.unread {
    font-weight: bold;
  }
}
</style>
