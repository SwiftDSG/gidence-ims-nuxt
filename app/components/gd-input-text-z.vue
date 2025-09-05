<template>
  <client-only>
    <div
      class="gd-input"
      :class="{
        'gd-input-disabled': props.disabled,
        'gd-input-error': props.error,
      }"
    >
      <label v-if="props.label" :for="id" class="gd-input-label gd-headline-6">
        {{ props.label }}
      </label>
      <input
        :id="id"
        :name="props.name"
        :type="inputType"
        class="gd-input-text"
        :class="props.class || 'gd-headline-5'"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :maxLength="props.limit"
        :aria-invalid="!!props.error"
        :aria-describedby="props.error ? `${id}-error` : undefined"
        autocomplete="off"
        :value="inputValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div
        v-if="props.type === 'password'"
        class="gd-input-show"
        @click="togglePasswordVisibility"
        :aria-label="inputType === 'text' ? 'Hide password' : 'Show password'"
      >
        <gd-svg
          :name="inputType === 'text' ? 'eye' : 'eye-off'"
          color="secondary"
        />
      </div>
      <div
        v-if="props.error"
        :id="`${id}-error`"
        class="gd-input-error-message"
      >
        {{ props.error }}
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
  import { computed, ref } from "vue";

  const props = defineProps<{
    label?: string;
    value: string;
    placeholder?: string;
    name?: string;
    type?: "text" | "password";
    limit?: number;
    error?: string;
    disabled?: boolean;
    class?: string;
  }>();

  const emits = defineEmits<{
    (event: "change", value: string): void;
    (event: "focus"): void;
    (event: "blur"): void;
  }>();

  // Generate a unique ID for the input
  const id = ref(
    `gd-input-text-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`
  );

  // Use computed with getter/setter for two-way binding
  const inputValue = computed({
    get: () => props.value,
    set: (value) => {
      if (!props.disabled) {
        emits("change", value);
      }
    },
  });

  // Password visibility toggle
  const isPasswordVisible = ref(false);
  const inputType = computed(() => {
    if (props.type === "password") {
      return isPasswordVisible.value ? "text" : "password";
    }
    return props.type || "text";
  });

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
  };

  // Event handlers
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    inputValue.value = target.value;
  };

  const handleFocus = () => {
    if (!props.disabled) {
      emits("focus");
    }
  };

  const handleBlur = () => {
    if (!props.disabled) {
      emits("blur");
    }
  };
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

    &-show {
      cursor: pointer;
      position: absolute;
      right: 0.25rem;
      width: 2rem;
      height: 2rem;
      padding: 0 0.5rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-error {
      border-color: var(--error-color);

      .gd-input-text {
        border-color: var(--error-color);
      }
    }

    &-error-message {
      color: var(--error-color);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    &.gd-input-disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>
