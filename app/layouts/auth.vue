<template>
  <client-only>
    <nuxt-page />
    <gd-alert />
  </client-only>
</template>

<script lang="ts" setup>
  import "~/assets/styles/global.scss";

  const { rem } = useMain();

  function resizeHandler(): void {
    rem.value = parseInt(getComputedStyle?.(document.body)?.fontSize) || 24;
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  }

  onMounted(() => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );

    window.addEventListener("resize", resizeHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });
</script>

<style lang="scss" scoped>
  .gd {
    position: relative;
    width: 100vw;
    height: 100svh;
    display: flex;
    flex-direction: column;
  }
</style>
