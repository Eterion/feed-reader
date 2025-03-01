<script setup lang="ts">
import { computed } from 'vue';
import XIcon from './@icons/XIcon.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    width?: number;
  }>(),
  {
    width: 560,
  },
);

const visible = defineModel<boolean>('visible');
const widthStyle = computed(() => ({ width: props.width + 'px' }));
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-from-class="$style.vHidden"
      :leave-to-class="$style.vHidden"
      :enter-active-class="$style.vActive"
      :leave-active-class="$style.vActive">
      <div v-if="visible" :class="$style.el">
        <div :class="$style.backdrop" />
        <div :class="$style.modal" :style="widthStyle">
          <h2 :class="$style.title">{{ title }}</h2>
          <slot />
          <button :class="$style.close" type="button" @click="visible = false">
            <XIcon />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style module lang="scss">
.el {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 0;
}

.backdrop {
  background-color: var(--backdrop-surface);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: -1;
}

.modal {
  background-color: var(--foreground);
  border-radius: 12px;
  box-shadow: var(--high-shadow);
  padding: 36px;
  position: relative;
}

.title {
  border-bottom: 2px solid var(--border);
  color: var(--text);
  font-size: 1.25rem;
  line-height: 1;
  margin-bottom: 36px;
  padding: 0 0 12px;
}

.close {
  align-items: center;
  background-color: transparent;
  border: none;
  color: var(--light-text);
  cursor: pointer;
  display: flex;
  height: 60px;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  width: 60px;
  &:hover {
    color: var(--text);
  }
}

.vHidden {
  .backdrop {
    opacity: 0;
  }
  .modal {
    opacity: 0;
    scale: 0.9;
  }
}

.vActive {
  $-speed: 200ms;
  transition-duration: $-speed;
  .backdrop {
    transition-duration: $-speed;
    transition-property: opacity;
  }
  .modal {
    transition-duration: $-speed;
    transition-property: opacity, scale;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}
</style>
