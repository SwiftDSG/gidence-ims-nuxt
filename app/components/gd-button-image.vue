<template>
  <button
    :class="`
      gd-button
      ${disabled ? 'gd-button-disabled' : ''}
    `"
    @click="emits('click')"
    :disabled="disabled"
    type="button"
  >
    <div class="gd-button-wrapper">
      <image v-if="src" :src="src" class="gd-button-wrapper-image" />
      <div v-else-if="text" class="gd-button-wrapper-text gd-headline-5">
        {{ text }}
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    src?: string;
    text?: string;
    disabled?: boolean;
  }>();
  const emits = defineEmits<{
    (event: "click"): void;
  }>();
</script>

<style lang="scss" scoped>
  .gd-button {
    cursor: pointer;
    position: relative;
    width: 2rem;
    height: 2rem;
    border-radius: 0.75rem;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.2s ease-in-out;
    overflow: hidden;
    * {
      pointer-events: none;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.75rem;
      border: var(--border);
      box-sizing: border-box;
    }
    &-wrapper {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background-color: var(--primary-color);
      display: flex;
      align-items: center;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      &-image,
      &-text {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      &-image {
        object-fit: cover;
        background-size: cover;
        background-position: center;
      }
      &-text {
        color: var(--font-tertiary-color);
      }
    }
    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }
    &.gd-button-disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
