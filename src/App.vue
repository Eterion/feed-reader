<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { minutesToMilliseconds } from 'date-fns';
import { useFeedsStore } from './utils/useFeedsStore';

const feedsStore = useFeedsStore();
feedsStore.refresh();

useIntervalFn(() => {
  feedsStore.refresh();
}, minutesToMilliseconds(10));
</script>

<template>
  <div :class="[$style.sidebar, $style.feeds]">
    <div :class="$style.sidebar_scrollable">
      <RouterView name="feeds" />
    </div>
  </div>
  <div :class="[$style.sidebar, $style.articles]">
    <div :class="$style.sidebar_scrollable">
      <RouterView name="articles" />
    </div>
  </div>
  <main :class="$style.main">
    <RouterView />
  </main>
</template>

<style module lang="scss">
.sidebar {
  border-right: 1px solid var(--border);
  bottom: 0;
  position: fixed;
  top: 0;
  &_scrollable {
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
}

.feeds {
  left: 0;
  width: var(--feeds-width);
}

.articles {
  left: var(--feeds-width);
  width: var(--articles-width);
}

.main {
  padding-left: calc(var(--feeds-width) + var(--articles-width));
}
</style>
