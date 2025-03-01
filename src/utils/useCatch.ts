import { isAxiosError } from 'axios';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

export function useCatch(error: MaybeRefOrGetter<unknown>) {
  const message = computed(() => {
    const e = toValue(error);
    return isAxiosError(e) ? e.response?.data.message : e;
  });

  function inform() {
    alert(message.value);
  }

  return {
    inform,
  };
}
