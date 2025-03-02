<template>
  <div :class="$style.el">
    <slot />
  </div>
</template>

<style module lang="scss">
.el {
  justify-content: flex-end;
  display: flex;
  column-gap: 6px;
  align-items: center;
}
</style>
