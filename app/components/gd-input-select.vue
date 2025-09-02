<template>
  <gd-popover :visible="opened" @close="opened = false">
    <template #trigger>
      <button
        :class="small ? 'gd-select-small' : ''"
        class="gd-select"
        @click.prevent="handleClick"
      >
        <span class="gd-select-text gd-headline-6">
          {{ props.model.label }}
        </span>
        <div class="gd-select-icon">
          <gd-svg name="arrow-down" color="primary" />
        </div>
      </button>
    </template>
    <template #content>
      <gd-button-menu
        v-for="option in props.options"
        :key="option.value"
        :text="option.label"
        :type="props.type"
        @click="
          () => {
            props.model.label = option.label;
            props.model.value = option.value;
          }
        "
      />
    </template>
  </gd-popover>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    type: "primary" | "secondary" | "tertiary" | "success" | "error";
    options: {
      label: string;
      value: string;
    }[];
    model: {
      label: string;
      value: string;
    };
    small?: boolean;
    disabled?: boolean;
  }>();
  const emits = defineEmits<{
    (event: "update", value: { label: string; value: string }): void;
  }>();

  const opened = ref(false);

  const handleClick = () => {
    console.log("Button clicked");
    if (!props.disabled) {
      opened.value = !opened.value;
    }
  };

  watch(
    () => opened.value,
    (v) => {
      console.log("Popover opened:", v);
    }
  );
</script>

<style lang="scss" scoped>
  .gd-select {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 2rem;
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    border: var(--border);
    background-color: var(--background-depth-one-color);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    transition: 0.25s background-color,
      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-in-out;

    * {
      pointer-events: none;
    }

    &-text {
      position: relative;
      white-space: nowrap;
      color: var(--font-primary-color);
      opacity: 0.75;
      transition: 0.25s opacity;
    }
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
    &.gd-select-small {
      height: 1rem;
      padding: 0 0.125rem 0 0.25rem;
      gap: 0.125rem;
    }

    &:hover {
      background-color: var(--background-depth-three-color);
      .gd-button-icon,
      .gd-button-text {
        opacity: 1;
      }
    }
    &:active {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }
</style>
