<template>
  <button
    :class="`
      gd-button
      gd-button-${type}
      ${disabled ? 'gd-button-disabled' : ''}
    `"
    @click="emits('click')"
    :disabled="disabled"
    type="button"
  >
    <div
      class="gd-button-text gd-button-text"
      :style="!icon ? 'width: 100%; justify-content: center' : ''"
    >
      {{ text }}
    </div>
    <div v-if="icon" class="gd-button-icon">
      <gd-svg :name="icon" :color="color" />
    </div>
  </button>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    text: string;
    type: "primary" | "secondary" | "success" | "error";
    icon?: string;
    disabled?: boolean;
  }>();
  const emits = defineEmits<{
    (event: "click"): void;
  }>();

  const color = computed<
    "primary" | "secondary" | "tertiary" | "error" | "success"
  >(() => {
    switch (props.type) {
      case "primary":
        return "tertiary";
      case "secondary":
        return "primary";
      case "success":
        return "success";
      case "error":
        return "error";
    }
  });
</script>

<style lang="scss" scoped>
  .gd-button {
    cursor: pointer;
    position: relative;
    width: auto;
    height: 2rem;
    border-radius: 0.5rem;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.2s ease-in-out;
    overflow: hidden;
    * {
      pointer-events: none;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.5rem;
      border: var(--border);
      background-color: rgba(128, 128, 128, 0);
      box-sizing: border-box;
      transition: 0.25s background-color;
    }
    &-icon,
    &-text {
      position: relative;
      width: 100%;
      height: 100%;
      color: var(--font-primary-color);
      padding: 0 0.5rem;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    &-text {
      padding: 0 0.5rem;
      & + .gd-button-icon {
        position: relative;
        left: -0.5rem;
        width: 1rem;
        height: 2rem;
        margin-left: 0.25rem;
        padding: 0;
        flex-shrink: 0;
      }
    }
    &:hover {
      &::after {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }

    &.gd-button-primary {
      background-color: var(--primary-color);
      .gd-button-text {
        color: var(--font-tertiary-color);
      }
    }
    &.gd-button-secondary {
      background-color: var(--background-depth-one-color);
      .gd-button-text {
        color: var(--font-primary-color);
      }
    }
    &.gd-button-success {
      background-color: var(--success-color);
      .gd-button-text {
        color: var(--font-primary-color);
      }
    }
    &.gd-button-error {
      background-color: var(--error-color);
      .gd-button-text {
        color: var(--font-primary-color);
      }
    }

    &.gd-button-disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
