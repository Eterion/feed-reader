import PromptModal from '@/components/PromptModal.vue';

export function showPrompt(
  message: string,
  {
    defaultValue,
    onOk,
    title,
  }: {
    defaultValue?: string;
    onOk?: (value: string) => PromiseLike<unknown>;
    title?: string;
  } = {},
) {
  return new Promise<string | void>((resolve) => {
    const el = document.createElement('div');
    const app = createApp({
      setup() {
        const visible = ref(false);
        onMounted(() => {
          visible.value = true;
        });
        return () =>
          h(PromptModal, {
            defaultValue,
            message,
            title,
            visible: visible.value,
            onOk: async (value) => {
              try {
                await onOk?.(value);
                resolve(value);
                visible.value = false;
              } catch (e) {
                alert(e);
              }
            },
            onCancel: () => {
              resolve();
              visible.value = false;
            },
            onHidden: () => {
              app.unmount();
              el.remove();
            },
          });
      },
    });
    document.body.appendChild(el);
    app.mount(el);
  });
}
