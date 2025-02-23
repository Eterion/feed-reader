<script setup lang="ts">
import { useFeed } from '@/utils/useFeed';
import { useFeedsStore } from '@/utils/useFeedsStore';
import { watchImmediate } from '@vueuse/core';
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

watchImmediate(
  [() => props.feedId, articleLink],
  async ([feedId, articleLink]) => {
    if (feedId && articleLink)
      await feedsStore.markRead([
        { feedId, link: decodeURIComponent(articleLink) },
      ]);
  },
);

const notSelected = computed(() => {
  return !props.articleLink;
});
</script>

<template>
  <div>
    <div v-if="notSelected"></div>
    <template v-else-if="article">
      <a :href="article.link" target="_blank" rel="noreferrer">
        <h1>{{ article.title }}</h1>
      </a>
      <div>{{ article.isoDate }}</div>
      <p>{{ article.content ?? article.summary }}</p>
    </template>
  </div>
</template>
