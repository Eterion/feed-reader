<script lang="ts">
interface MenuInstance {
  id: string;
  hide: () => unknown;
}

const useContextMenuStore = defineStore('contextMenu', () => {
  const instances = ref<MenuInstance[]>([]);
  function create(payload: MenuInstance) {
    instances.value.push(payload);
    function discard() {
      remove(instances.value, (item) => {
        return item.id === payload.id;
      });
    }
    function hideAllExcept(id: MenuInstance['id']) {
      instances.value.forEach((item) => {
        if (item.id !== id) {
          item.hide();
        }
      });
    }
    return { discard, hideAllExcept };
  }
  return { create, instances };
});
</script>

<script setup lang="ts" generic="TIconSlot extends string = string">
import { useEscapeStack } from '@/utils/useEscapeStack';
import {
  autoUpdate,
  flip,
  useFloating,
  type VirtualElement,
} from '@floating-ui/vue';
import { ary, cloneDeep, remove } from 'es-toolkit';
import type { Promisable } from 'type-fest';

const props = defineProps<{
  referenceElement: HTMLElement | null;
  items: {
    caption: string;
    danger?: boolean;
    iconSlot: TIconSlot;
    onClick: (event: Event) => Promisable<unknown>;
  }[];
}>();

const id = useId();
const isOpen = defineModel<boolean>('open');
const reference = ref<VirtualElement>();
const floating = useTemplateRef('floating');
const { floatingStyles, placement } = useFloating(reference, floating, {
  middleware: [flip()],
  open: isOpen,
  placement: 'bottom-start',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
});

const hide = () => (isOpen.value = false);
const contextMenu = useContextMenuStore().create({ id, hide });
const escapeStack = reactive(useEscapeStack(isOpen, hide));
onClickOutside(floating, ary(hide, 0));

onBeforeUnmount(() => {
  escapeStack.discard();
  contextMenu.discard();
});

whenever(isOpen, () => {
  contextMenu.hideAllExcept(id);
});

watchImmediate(
  () => props.referenceElement,
  (el) => (reference.value = el || undefined),
);

const mouse = reactive(useMouse({ type: 'client' }));
useEventListener(
  () => props.referenceElement,
  'contextmenu',
  (event) => {
    event.preventDefault();
    reference.value = {
      getBoundingClientRect() {
        const { x, y } = cloneDeep(mouse);
        return {
          bottom: y,
          height: 0,
          left: x,
          right: x,
          top: y,
          width: 0,
          x,
          y,
        };
      },
    };
    isOpen.value = true;
  },
  { capture: true },
);

const mappedItems = computed(() => {
  return props.items.map((item) => ({
    ...item,
    onClick: async (event: Event) => {
      isOpen.value = false;
      await item.onClick(event);
    },
  }));
});
</script>

<template>
  <Teleport to="body" :disabled="!isOpen">
    <Transition
      :enter-from-class="$style.vHidden"
      :leave-to-class="$style.vHidden"
      :enter-active-class="$style.vActive"
      :leave-active-class="$style.vActive">
      <div
        v-if="isOpen"
        ref="floating"
        :class="$style.floating"
        :style="floatingStyles">
        <div :class="$style.el" :data-placement="placement">
          <ul :class="$style.list">
            <li v-for="item in mappedItems" :key="item.caption">
              <a
                href=""
                :class="[$style.item, { [$style.danger]: item.danger }]"
                @click.prevent="item.onClick">
                <span :class="$style.icon">
                  <slot :name="item.iconSlot" />
                </span>
                <span>
                  {{ item.caption }}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style module lang="scss">
.el {
  background-color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--low-shadow);
  padding: 6px;
  &[data-placement='right-start'],
  &[data-placement='bottom-start'] {
    border-top-left-radius: 6px;
  }
  &[data-placement='right-end'],
  &[data-placement='top-start'] {
    border-bottom-left-radius: 6px;
  }
  &[data-placement='left-start'],
  &[data-placement='bottom-end'] {
    border-top-right-radius: 6px;
  }
  &[data-placement='left-end'],
  &[data-placement='top-end'] {
    border-bottom-right-radius: 6px;
  }
}

.list {
  list-style: none;
  padding: 0;
}

.item {
  --icon-color: var(--light-text);
  align-items: center;
  border-radius: var(--small-radius);
  color: var(--text);
  column-gap: 1ch;
  display: flex;
  font-size: 0.8125rem;
  padding: 6px 18px 6px 10px;
  text-decoration: none;
  transition-duration: 200ms;
  transition-property: background-color;
  &:hover {
    --icon-color: var(--text);
    background-color: var(--hover-surface);
  }
  &.danger {
    --icon-color: var(--danger);
  }
  .icon {
    align-items: center;
    color: var(--icon-color);
    display: flex;
    flex-shrink: 0;
    height: 16px;
    justify-content: center;
    width: 16px;
    :where(svg) {
      height: inherit;
      width: inherit;
    }
  }
}

.vHidden {
  .el {
    opacity: 0;
    scale: 0.75;
  }
}

.vActive {
  transition-duration: 100ms;
  transition-property: none;
  .el {
    transition-duration: 100ms;
    transition-property: opacity, scale;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &[data-placement='right-start'],
    &[data-placement='bottom-start'] {
      transform-origin: left top;
    }
    &[data-placement='right-end'],
    &[data-placement='top-start'] {
      transform-origin: left bottom;
    }
    &[data-placement='left-start'],
    &[data-placement='bottom-end'] {
      transform-origin: right top;
    }
    &[data-placement='left-end'],
    &[data-placement='top-end'] {
      transform-origin: right bottom;
    }
  }
}
</style>
