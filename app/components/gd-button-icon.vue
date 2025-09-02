<template>
  <button
    type="button"
    @click="emits('click')"
    :disabled="props.disabled"
    :class="`
      gd-button
      gd-button-${props.type}
      ${props.disabled ? 'gd-button-disabled' : ''}
      ${props.borderless ? 'gd-button-borderless' : ''}
    `"
  >
    <div class="gd-button-icon">
      <gd-svg :name="props.icon" :color="props.type" />
    </div>
    <span
      v-if="props.tooltip"
      class="gd-button-tooltip gd-headline-6"
      :class="
        props.tooltip.position
          ? `gd-button-tooltip-${props.tooltip.position}`
          : ''
      "
      >{{ props.tooltip.text }}</span
    >
  </button>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    type: "primary" | "secondary" | "tertiary" | "success" | "error";
    icon: string;
    borderless?: boolean;
    tooltip?: {
      text: string;
      position: "top" | "bottom" | "left" | "right";
    };
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
    padding: 0 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--background-depth-one-color);
    border: var(--border);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 0.5rem;
    transition: 0.25s background-color,
      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-in-out;
    &-icon {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
    }
    &-tooltip {
      pointer-events: none;
      position: absolute;
      height: 1rem;
      border-radius: 0.25rem;
      background-color: var(--font-primary-color);
      color: var(--background-depth-one-color);
      padding: 0 0.25rem;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      opacity: 0;

      &.gd-button-tooltip-top {
        bottom: calc(100% + 0.25rem);
        left: 50%;
        transform: translateX(-50%) scale(0.8);
        &::after {
          content: " ";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -0.25rem;
          border-width: 0.25rem;
          border-style: solid;
          border-color: var(--font-primary-color) transparent transparent
            transparent;
        }
      }
      &.gd-button-tooltip-bottom {
        top: calc(100% + 0.25rem);
        left: 50%;
        transform: translateX(-50%) scale(0.8);
        &::after {
          content: " ";
          position: absolute;
          bottom: 100%; /* To the top of the tooltip */
          left: 50%;
          margin-left: -0.25rem;
          border-width: 0.25rem;
          border-style: solid;
          border-color: transparent transparent var(--font-primary-color)
            transparent;
        }
      }
      &.gd-button-tooltip-left {
        right: calc(100% + 0.25rem);
        top: 50%;
        transform: translateY(-50%) scale(0.8);
        &::after {
          content: " ";
          position: absolute;
          top: 50%;
          left: 100%; /* To the right of the tooltip */
          margin-top: -0.25rem;
          border-width: 0.25rem;
          border-style: solid;
          border-color: transparent transparent transparent
            var(--font-primary-color);
        }
      }
      &.gd-button-tooltip-right {
        left: calc(100% + 0.25rem);
        top: 50%;
        transform: translateY(-50%) scale(0.8);
        &::after {
          content: " ";
          position: absolute;
          top: 50%;
          right: 100%; /* To the left of the tooltip */
          margin-top: -0.25rem;
          border-width: 0.25rem;
          border-style: solid;
          border-color: transparent var(--font-primary-color) transparent
            transparent;
        }
      }
    }
    &:hover {
      background-color: var(--background-depth-three-color);
      .gd-button-tooltip {
        opacity: 1;
        &.gd-button-tooltip-top {
          transform: translateX(-50%) scale(1);
        }
        &.gd-button-tooltip-bottom {
          transform: translateX(-50%) scale(1);
        }
        &.gd-button-tooltip-left {
          transform: translateY(-50%) scale(1);
        }
        &.gd-button-tooltip-right {
          transform: translateY(-50%) scale(1);
        }
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
    &.gd-button-borderless {
      border: none;
      background-color: transparent;
    }
  }
</style>
