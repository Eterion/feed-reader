<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { minutesToMilliseconds } from 'date-fns';
import { useFeedsStore } from './utils/useFeedsStore';

const feedsStore = useFeedsStore();
feedsStore.refreshFeeds();

useIntervalFn(() => {
  feedsStore.refreshFeeds();
}, minutesToMilliseconds(10));
</script>

<template>
  <div :class="$style.feeds">
    <RouterView name="feeds" />
  </div>
  <div :class="$style.articles">
    <RouterView name="articles" />
  </div>
  <main :class="$style.main">
    <RouterView />
  </main>
</template>

<style module lang="scss">
.feeds {
  border-right: 1px solid var(--border);
  bottom: 0;
  left: 0;
  overflow-y: auto;
  position: fixed;
  scrollbar-width: thin;
  top: 0;
  width: var(--feeds-width);
}

.articles {
  border-right: 1px solid var(--border);
  bottom: 0;
  left: var(--feeds-width);
  overflow-y: auto;
  position: fixed;
  scrollbar-width: thin;
  top: 0;
  width: var(--articles-width);
}

.main {
  padding-left: calc(var(--feeds-width) + var(--articles-width));
}
</style>
