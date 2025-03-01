<script setup lang="ts">
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { watchImmediate } from '@vueuse/core';
import { parseISO } from 'date-fns';
import sanitize from 'sanitize-html';
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
  });
});

const articleData = computed(() => {
  return article.value?.data;
});

const notSelected = computed(() => {
  return !props.articleLink;
});

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeStyle: 'short',
});

const formattedDate = computed(() => {
  if (articleData.value?.isoDate)
    return DateFormatter.format(parseISO(articleData.value.isoDate));
  return 'Unknown date';
});

const contentHtml = computed(() => {
  const unsafeContent =
    articleData.value?.content ||
    articleData.value?.contentSnippet ||
    articleData.value?.summary;
  if (unsafeContent) return sanitize(unsafeContent);
});

watchImmediate(
  [() => props.feedId, articleLink, () => article.value?.isRead],
  async ([feedId, articleLink, isRead]) => {
    if (feedId && articleLink && isRead === false)
      await feedsStore.markFeedRead([
        { feedId, link: decodeURIComponent(articleLink) },
      ]);
  },
);
</script>

<template>
  <div :class="$style.el">
    <div v-if="notSelected"></div>
    <div :class="$style.article" v-else-if="articleData">
      <h1 :class="$style.title">
        <a :href="articleData.link" target="_blank" rel="noreferrer">
          {{ articleData.title }}
        </a>
      </h1>
      <div :class="$style.date">{{ formattedDate }}</div>
      <p v-html="contentHtml"></p>
    </div>
  </div>
</template>

<style module lang="scss">
.el {
  padding: 36px 36px 64px;
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
  color: var(--light-text);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>
