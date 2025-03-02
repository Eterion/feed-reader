<script lang="ts">
interface Injection {
  id: string;
  required?: boolean;
}

const injectionKey = Symbol() as InjectionKey<Injection>;

function defineInputField(customValue: Partial<Injection>) {
  const provided: Injection = reactive({
    id: `inputField_${useId()}`,
    required: toRefs(customValue).required,
  });
  provide(injectionKey, provided);
  return toRefs(provided);
}

export function useInputField() {
  const fallback: Injection = reactive({ id: `inputField_${useId()}` });
  const injected = inject(injectionKey, fallback);
  return toRefs(injected);
}
</script>

<script setup lang="ts">
import type { InjectionKey } from 'vue';

const props = defineProps<{
  label?: string;
  required?: boolean;
}>();

const { id } = defineInputField(props);
</script>

<template>
  <div>
    <div v-if="label" :class="$style.label">
      <label :for="id">{{ label }}</label>
    </div>
    <slot />
  </div>
</template>

<style module lang="scss">
.label {
  font-weight: bold;
  margin-bottom: 6px;
}
</style>
