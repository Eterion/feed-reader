<script setup lang="ts">
import MarkdownIt from 'markdown-it';

const props = defineProps<{
  markdown: string;
}>();

const html = computed(() => {
  return MarkdownIt().render(props.markdown);
});
</script>

<template>
  <div v-html="html" />
</template>
