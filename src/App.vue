<script setup lang="ts">
import { minutesToMilliseconds } from 'date-fns';
import { useFeedsStore } from './utils/useFeedsStore';

const feedsStore = useFeedsStore();
feedsStore.refresh();

useIntervalFn(() => {
  feedsStore.refresh();
}, minutesToMilliseconds(10));

const feedsEdgePx = useLocalStorage('feeds-edge-px', 325);
const articlesEdgeVw = useLocalStorage('articles-edge-vw', 45);
const whatToResize = ref<'feeds' | 'articles'>();
const mouse = reactive(useMouse({ type: 'client' }));
const windowSize = reactive(useWindowSize());

watchEffect(() => {
  switch (whatToResize.value) {
    case 'articles':
      articlesEdgeVw.value = (mouse.x / windowSize.width) * 100;
      break;
    case 'feeds':
      feedsEdgePx.value = mouse.x;
  }
});

useEventListener('pointerup', (event) => {
  if (whatToResize.value) {
    event.preventDefault();
    whatToResize.value = undefined;
  }
});
</script>

<template>
  <Teleport to="body">
    <div :class="[$style.sidebar, $style.feeds]">
      <div :class="$style.sidebar_scrollable">
        <RouterView name="feeds" />
        <div
          :class="[
            $style.resizable,
            { [$style.dragging]: whatToResize === 'feeds' },
          ]"
          @mousedown.left.prevent="whatToResize = 'feeds'"
          @touchstart.prevent="whatToResize = 'feeds'" />
      </div>
    </div>
    <div :class="[$style.sidebar, $style.articles]">
      <div :class="$style.sidebar_scrollable">
        <RouterView name="articles" />
        <div
          :class="[
            $style.resizable,
            { [$style.dragging]: whatToResize === 'articles' },
          ]"
          @mousedown.left.prevent="whatToResize = 'articles'"
          @touchstart.prevent="whatToResize = 'articles'" />
      </div>
    </div>
  </Teleport>
  <main :class="$style.main">
    <RouterView />
  </main>
</template>

<style module lang="scss">
$-draggable-width: 6px;
$-feeds-edge: v-bind('`${feedsEdgePx}px`');
$-articles-edge: v-bind('`${articlesEdgeVw}vw`');

.sidebar {
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
  width: $-feeds-edge;
}

.articles {
  background-color: var(--foreground);
  border: 1px solid var(--border);
  border-bottom-width: 0;
  border-top-left-radius: 12px;
  left: $-feeds-edge;
  width: calc(#{$-articles-edge} - #{$-feeds-edge});
}

.main {
  background-color: var(--foreground);
  border-top: 1px solid var(--border);
  margin-left: $-articles-edge;
  min-height: 100dvh;
}

.resizable {
  bottom: 0;
  cursor: ew-resize;
  display: block;
  left: calc(100% - #{$-draggable-width} / 2);
  position: absolute;
  top: 0;
  transition-duration: 200ms;
  transition-property: background-color;
  width: $-draggable-width;
  &:hover {
    background-color: var(--border);
  }
  &.dragging {
    background-color: var(--primary);
  }
}
</style>
