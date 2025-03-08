import { remove } from 'es-toolkit';
import type { WatchSource } from 'vue';

const stack = ref<
  {
    discard: () => unknown;
    hide: () => unknown;
    id: PropertyKey;
  }[]
>([]);

useEventListener('keydown', (event) => {
  if (event.key === 'Escape' && stack.value.length) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const item = stack.value[0];
    item.hide();
    item.discard();
  }
});

export function useEscapeStack(
  visible: WatchSource<boolean | undefined>,
  hide: () => unknown,
) {
  const id = Symbol();

  function discard() {
    remove(stack.value, (item) => {
      return item.id === id;
    });
  }

  const stop = watchImmediate(visible, (visible) => {
    if (visible) {
      stack.value.unshift({
        discard,
        hide,
        id,
      });
    } else {
      discard();
    }
  });

  tryOnBeforeUnmount(stop);

  return {
    discard,
    id,
    stack,
  };
}
