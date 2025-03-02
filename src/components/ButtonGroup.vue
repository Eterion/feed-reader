<template>
  <div :class="$style.el">
    <slot />
  </div>
</template>

<style module lang="scss">
.el {
  align-items: center;
  column-gap: 6px;
  display: flex;
  justify-content: flex-end;
}
</style>
