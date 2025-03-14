<script setup lang="ts">
import { useDecodeURIComponent } from '@/utils/useDecodeURIComponent';
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { parseISO } from 'date-fns';
import sanitize from 'sanitize-html';

const props = defineProps<{
  feedUrl?: string;
  articleLink?: string;
}>();

const decodedFeedUrl = useDecodeURIComponent(() => props.feedUrl);
const decodedArticleLink = useDecodeURIComponent(() => props.articleLink);
const feedsStore = useFeedsStore();
const { articles } = useFeed(decodedFeedUrl);

const article = computed(() => {
  return articles.value.find(({ link }) => {
    return link === decodedArticleLink.value;
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
  [decodedFeedUrl, decodedArticleLink, () => article.value?.isRead],
  async ([feedUrl, articleLink, isRead]) => {
    if (feedUrl && articleLink && isRead === false)
      await feedsStore.markFeedRead([{ feedUrl, link: articleLink }]);
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
