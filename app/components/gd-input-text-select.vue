<template>
  <gd-popover :visible="opened" @close="opened = false">
    <template #trigger>
      <div
        class="gd-input"
        :class="`${disabled ? 'gd-input-disabled' : ''} ${
          opened ? 'gd-input-opened' : ''
        }`"
      >
        <label v-if="props.label" class="gd-input-label gd-headline-6">
          {{ props.label }}
        </label>
        <input
          :id="id"
          :name="props.name"
          class="gd-input-text"
          ref="gdInputText"
          :class="props.class || 'gd-headline-5'"
          :disabled="disabled"
          :placeholder="props.placeholder"
          autocomplete="off"
          v-model="value"
          @input="onChange"
          @focus="onFocus"
        />
        <div class="gd-input-arrow">
          <gd-svg name="arrow-down" color="secondary" />
        </div>
      </div>
    </template>
    <template #content>
      <div class="gd-input-options" ref="gdInputOptions">
        <span v-if="!options.length" class="gd-input-options-message gd-body-5"
          >Tidak ada opsi</span
        >
        <gd-button-menu
          v-for="option in options"
          :key="option.value"
          :text="option.label"
          :type="props.type"
          @click="onClick({ label: option.label, value: option.value })"
        />
      </div>
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
    placeholder: string;
    label?: string;
    name?: string;
    error?: string;
    class?: string;
    small?: boolean;
    strict?: boolean;
    disabled?: boolean;
  }>();
  const emits = defineEmits<{
    (event: "update", value: { label: string; value: string }): void;
  }>();

  const gdInputText = ref<HTMLInputElement>();
  const gdInputOptions = ref<HTMLDivElement>();
  const gdInputOptionFocused = ref<HTMLButtonElement>();

  const value = ref(props.model.label);

  const options = ref<
    {
      label: string;
      value: string;
    }[]
  >(props.options);
  const opened = ref(false);
  const id = ref(
    `gd-input-text-${Math.random().toString(36).substring(2, 15)}`
  );

  const disabled = computed(
    () => props.disabled || (props.strict && props.options.length === 0)
  );

  const onFocus = () => {
    if (!props.disabled) {
      onChange();
    }
  };
  const onChange = () => {
    if (props.disabled) return;

    if (!opened.value) opened.value = true;
    if (!value.value) {
      options.value = props.options;
      return;
    }

    options.value = props.options.filter((option) =>
      option.label
        .toLowerCase()
        .split(" ")
        .join("")
        .includes(value.value.toLowerCase().split(" ").join(""))
    );
  };
  const onClick = (option: { label: string; value: string }) => {
    gdInputOptionFocused.value = undefined;
    props.model.label = option.label;
    props.model.value = option.value;
    value.value = option.label;
    gdInputText.value?.focus();
    opened.value = false;
  };
  const onKeypress = (e: KeyboardEvent) => {
    // detect arrow up or down
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const gdInputOptionButtons = gdInputOptions.value?.children || [];
      if (gdInputOptionButtons.length === 0) return;

      // handle arrow key navigation
      if (e.key === "ArrowUp") {
        // move focus to the previous option
        const prev =
          gdInputOptionFocused.value?.previousElementSibling ||
          gdInputOptionButtons[gdInputOptionButtons.length - 1];
        if (prev) {
          gdInputOptionFocused.value = prev as HTMLButtonElement;
        }
      } else if (e.key === "ArrowDown") {
        // move focus to the next option
        const next =
          gdInputOptionFocused.value?.nextElementSibling ||
          gdInputOptionButtons[0];
        if (next) {
          gdInputOptionFocused.value = next as HTMLButtonElement;
        }
      }
      if (gdInputOptionFocused.value) {
        gdInputOptionFocused.value.focus();
      }
    }
    // if enter key is pressed
    else if (e.key === "Enter" && gdInputOptionFocused.value) {
      // select the highlighted option
      e.preventDefault();
      gdInputOptionFocused.value.click();
    }
    // Otherwise set the focus back to the input, and continue typing
    else if (gdInputOptionFocused.value) {
      if (e.key === " ") {
        e.preventDefault();
        gdInputOptionFocused.value.click();
        return;
      }
      gdInputOptionFocused.value = undefined;
      gdInputText.value?.focus();
    }
  };

  watch(
    () => props.options,
    (val) => {
      options.value = val;
    }
  );
  watch(
    () => opened.value,
    (val) => {
      if (val) {
        window.addEventListener("keydown", onKeypress);
      } else {
        window.removeEventListener("keydown", onKeypress);
        gdInputOptionFocused.value = undefined;

        if (props.strict) {
          const option = props.options.find((option) =>
            option.label
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(value.value.toLowerCase().split(" ").join(""))
          );
          if (!option) {
            props.model.label = "";
            props.model.value = "";
            value.value = "";
          } else {
            props.model.label = option.label;
            props.model.value = option.value;
            value.value = option.label;
          }
        } else {
          const option = props.options.find((option) =>
            option.label
              .toLowerCase()
              .split(" ")
              .join("")
              .includes(value.value.toLowerCase().split(" ").join(""))
          );
          if (!option) {
            props.model.label = value.value;
            props.model.value = value.value;
          } else {
            props.model.label = option.label;
            props.model.value = option.value;
            value.value = option.label;
          }
        }
      }
    }
  );
</script>

<style lang="scss" scoped>
  .gd-input {
    cursor: pointer;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    &-label {
      position: relative;
      width: 100%;
      height: 1rem;
      display: flex;
      align-items: center;
      color: var(--font-secondary-color);
    }
    &-text {
      position: relative;
      width: 100%;
      height: 2rem;
      padding: 0 0.5rem;
      border-radius: 0.5rem;
      border: var(--border);
      color: var(--font-primary-color);
      box-sizing: border-box;
      background-color: var(--background-depth-one-color);
      transition: border-color 0.25s ease-in-out;
      &::placeholder {
        opacity: 0.5;
        transition: opacity 0.25s ease-in-out;
      }
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        &::placeholder {
          opacity: 1;
        }
      }
      &:hover {
        &::placeholder {
          opacity: 1;
        }
      }
    }
    &-arrow {
      cursor: pointer;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 2rem;
      height: 2rem;
      padding: 0 0.5rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease;
    }
    &.gd-input-opened {
      .gd-input-arrow {
        transform: rotate(180deg);
      }
    }
    &.gd-input-disabled {
      cursor: not-allowed;
      opacity: 0.5;
      * {
        pointer-events: none;
      }
    }
  }
</style>

<style lang="scss">
  .gd-input-options {
    overflow-y: auto;
    &-message {
      position: relative;
      width: 100%;
      height: 2rem;
      color: var(--font-secondary-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
