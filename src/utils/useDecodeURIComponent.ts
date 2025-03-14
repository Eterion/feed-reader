export function useDecodeURIComponent(
  encodedURIComponentOrGetter: MaybeRefOrGetter<string | undefined>,
) {
  return computed(() => {
    const encodedURIComponent = toValue(encodedURIComponentOrGetter);
    if (encodedURIComponent) return decodeURIComponent(encodedURIComponent);
  });
}
