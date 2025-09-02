<template>
  <button
    class="gd-button"
    type="button"
    @click="emits('click')"
    :style="!props.text ? 'width: 2rem; justify-content: center;' : ''"
  >
    <div v-if="props.icon" class="gd-button-icon">
      <gd-svg :name="props.icon" :color="props.type" />
    </div>
    <span v-if="props.text" class="gd-button-text gd-headline-6">
      {{ props.text }}
    </span>
  </button>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    type: "primary" | "secondary" | "tertiary" | "success" | "error";
    text?: string;
    icon?: string;
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
    width: 100%;
    height: 2rem;
    padding: 0 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background-color: transparent;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 0.5rem;
    transition: 0.25s background-color,
      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-in-out;
    &-icon {
      position: relative;
      width: 0.85rem;
      height: 0.85rem;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0.75;
      transition: 0.25s opacity;
    }
    &-text {
      position: relative;
      white-space: nowrap;
      color: var(--font-primary-color);
      opacity: 0.75;
      transition: 0.25s opacity;
    }
    &:hover {
      background-color: var(--background-depth-three-color);
      .gd-button-icon,
      .gd-button-text {
        opacity: 1;
      }
    }
    &:active {
      transform: scale(0.9);
      opacity: 0.8;
    }
    &:focus {
      outline: none;
      background-color: var(--background-depth-three-color);
      .gd-button-icon,
      .gd-button-text {
        opacity: 1;
      }
    }
  }
</style>
