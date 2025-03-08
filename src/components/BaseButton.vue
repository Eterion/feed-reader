<script setup lang="ts">
defineProps<{
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  primary?: boolean;
  submit?: boolean;
}>();

defineEmits<{
  click: [event: Event];
}>();
</script>

<template>
  <button
    :class="[
      $style.el,
      {
        [$style.loading]: loading,
        [$style.primary]: primary,
        [$style.danger]: danger,
      },
    ]"
    :disabled="disabled || loading"
    :type="submit ? 'submit' : 'button'"
    @click="$emit('click', $event)">
    <div :class="$style.slot"><slot /></div>
    <div v-if="loading" :class="$style.loader" />
  </button>
</template>

<style module lang="scss">
.el {
  --button-bg: var(--gray-surface);
  --button-text: var(--text);
  --button-hover: var(--hover-surface);
  align-items: center;
  background-color: var(--button-bg);
  border: none;
  border-radius: 6px;
  color: var(--button-text);
  display: flex;
  font-size: 0.9375rem;
  justify-content: center;
  padding: 6px 12px;
  text-align: center;
  white-space: nowrap;
  &:active {
    --button-hover: oklch(from var(--button-bg) calc(l * 0.9) c h);
  }
  &:not([disabled]):hover {
    background-color: var(--button-hover);
    cursor: pointer;
  }
}

.primary {
  --button-bg: var(--primary-surface);
  --button-text: var(--text-on-primary-surface);
  --button-hover: oklch(from var(--button-bg) calc(l * 1.1) c h);
}

.danger {
  --button-bg: var(--danger-surface);
  --button-text: var(--text-on-danger-surface);
  --button-hover: oklch(from var(--button-bg) calc(l * 1.1) c h);
}

.loading {
  cursor: wait;
  position: relative;
  .slot {
    visibility: hidden;
  }
}

.loader {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  &::after {
    animation-duration: 1200ms;
    animation-iteration-count: infinite;
    animation-name: spin;
    animation-timing-function: linear;
    border: 2px solid color(from var(--button-text) srgb r g b / 0.15);
    border-radius: 50%;
    border-top-color: var(--button-text);
    content: '';
    height: 1em;
    width: 1em;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
