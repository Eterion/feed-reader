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
    <slot />
  </button>
</template>

<style module lang="scss">
.el {
  --button-bg: var(--gray-surface);
  --button-text: var(--text);
  --button-hover: var(--hover-surface);
  align-items: center;
  background-color: var(--button-bg);
  border-radius: 6px;
  border: none;
  color: var(--button-text);
  display: flex;
  font-size: 0.9375rem;
  justify-content: center;
  padding: 6px 12px;
  text-align: center;
  &:not([disabled]):hover {
    background-color: var(--button-hover);
    cursor: pointer;
  }
  &:active {
    --button-hover: oklch(from var(--button-bg) calc(l * 0.9) c h);
  }
}

.loading {
  cursor: wait;
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
</style>
