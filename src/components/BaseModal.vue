<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    width?: number;
  }>(),
  {
    width: 560,
  },
);

defineEmits<{
  hidden: [];
  hide: [];
  show: [];
  shown: [];
}>();

const visible = defineModel<boolean>('visible');
const widthStyle = computed(() => ({ width: props.width + 'px' }));
const hide = () => (visible.value = false);
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-from-class="$style.vHidden"
      :leave-to-class="$style.vHidden"
      :enter-active-class="$style.vActive"
      :leave-active-class="$style.vActive"
      @before-enter="$emit('show')"
      @after-enter="$emit('shown')"
      @before-leave="$emit('hide')"
      @after-leave="$emit('hidden')">
      <div v-if="visible" :class="$style.el">
        <div :class="$style.backdrop" />
        <div :class="$style.modal" :style="widthStyle">
          <h2 v-if="title" :class="$style.title">{{ title }}</h2>
          <slot :hide="hide" />
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
  padding: 24px;
  position: relative;
}

.title {
  color: var(--light-text);
  font-size: 0.8125rem;
  font-weight: normal;
  margin-bottom: 12px;
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
  $-speed: 150ms;
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
