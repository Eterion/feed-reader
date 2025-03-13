<script setup lang="ts">
import { useInputField } from './InputField.vue';

const props = defineProps<{
  autofocus?: boolean;
}>();

const modelValue = defineModel<string>();
const editorRef = useTemplateRef('editor');
const { focused } = useFocusWithin(editorRef);
const hovered = useElementHover(editorRef);
const { id, required } = useInputField();

const inputRef = useTemplateRef('input');
onMounted(async () => {
  await nextTick();
  if (props.autofocus) {
    inputRef.value?.focus();
  }
});
</script>

<template>
  <div
    ref="editor"
    :class="[
      $style.editor,
      {
        [$style.focused]: focused,
        [$style.hovered]: hovered,
      },
    ]">
    <input
      ref="input"
      v-model="modelValue"
      :id="id"
      :required="required"
      :class="$style.input"
      type="text" />
  </div>
</template>

<style module lang="scss">
.editor {
  align-items: stretch;
  background-color: var(--input-surface);
  border: 1px solid var(--input-light-border);
  border-bottom-width: 0;
  border-radius: var(--small-radius);
  display: flex;
  flex-grow: 1;
  position: relative;
  z-index: 0;
  &::before {
    border-bottom: 1px solid var(--input-border);
    border-radius: inherit;
    bottom: 0;
    content: '';
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }
  &.hovered {
    &::before {
      border-color: var(--input-dark-border);
    }
  }
  &.focused {
    &::before {
      border-color: var(--primary);
      border-width: 2px;
    }
  }
}

.input {
  background-color: transparent;
  border: none;
  flex-grow: 1;
  min-width: 0;
  outline: none;
  padding: 10px 12px;
  width: 100%;
}
</style>
