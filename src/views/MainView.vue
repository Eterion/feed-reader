<script setup lang="ts">
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { watchImmediate } from '@vueuse/core';
import { parseISO } from 'date-fns';
import { computed } from 'vue';

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

const article = computed(() => {
  return articles.value.find(({ link }) => {
    return link === articleLink.value;
  })?.data;
});

const notSelected = computed(() => {
  return !props.articleLink;
});

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeStyle: 'short',
});

const formattedDate = computed(() => {
  if (article.value?.isoDate)
    return DateFormatter.format(parseISO(article.value.isoDate));
  return 'Unknown date';
});

// Mark article as read when viewed
watchImmediate(
  [() => props.feedId, articleLink],
  async ([feedId, articleLink]) => {
    if (feedId && articleLink)
      await feedsStore.markRead([
        { feedId, link: decodeURIComponent(articleLink) },
      ]);
  },
);
</script>

<template>
  <div :class="$style.el">
    <div v-if="notSelected"></div>
    <div :class="$style.article" v-else-if="article">
      <h1 :class="$style.title">
        <a :href="article.link" target="_blank" rel="noreferrer">
          {{ article.title }}
        </a>
      </h1>
      <div :class="$style.date">{{ formattedDate }}</div>
      <p>{{ article.content ?? article.summary }}</p>
    </div>
  </div>
</template>

<style module lang="scss">
.el {
  padding: 36px;
}

.title {
  :where(a) {
    color: var(--text);
    font-size: 2rem;
    font-weight: bold;
    text-decoration: underline;
    &:hover {
      color: var(--primary);
    }
  }
}

.date {
  color: var(--text-light);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>
