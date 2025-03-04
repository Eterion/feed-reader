<script setup lang="ts">
import { minutesToMilliseconds } from 'date-fns';
import { useFeedsStore } from './utils/useFeedsStore';

const feedsStore = useFeedsStore();
feedsStore.refresh();

useIntervalFn(() => {
  feedsStore.refresh();
}, minutesToMilliseconds(10));

const feedsWidth = useLocalStorage('feedsWidth', 360);
const articlesWidth = useLocalStorage('articlesWidth', 560);
const whatToResize = ref<'feeds' | 'articles'>();
const mouse = reactive(useMouse({ type: 'client' }));

watchEffect(() => {
  switch (whatToResize.value) {
    case 'articles':
      articlesWidth.value = mouse.x - feedsWidth.value;
      break;
    case 'feeds':
      feedsWidth.value = mouse.x;
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

.sidebar {
  border-right: 1px solid var(--border);
  bottom: 0;
  padding-right: calc(#{$-draggable-width} / 2);
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
  width: v-bind('`${feedsWidth}px`');
}

.articles {
  left: v-bind('`${feedsWidth}px`');
  width: v-bind('`${articlesWidth}px`');
}

.main {
  padding-left: calc(
    v-bind('`${feedsWidth}px`') + v-bind('`${articlesWidth}px`')
  );
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
