<template>
  <client-only>
    <div class="gd-input" :class="props.disabled ? 'gd-input-disabled' : ''">
      <label v-if="props.label" class="gd-input-label gd-headline-6">
        {{ props.label }}
      </label>
      <input
        :id="id"
        :name="props.name"
        :type="type"
        class="gd-input-text"
        :class="props.class || 'gd-headline-5'"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :maxLength="props.limit"
        autocomplete="off"
        v-model="value"
        @input="onChange"
        @focus="emits('focus')"
        @blur="emits('blur')"
      />
      <div
        v-if="props.type === 'password'"
        class="gd-input-show"
        @click="() => (type = type === 'text' ? 'password' : 'text')"
      >
        <gd-svg :name="type === 'text' ? 'eye' : 'eye-off'" color="secondary" />
      </div>
    </div>
  </client-only>
</template>

<script lang="ts" setup>
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

  const value = ref(props.value);
  const type = ref(props.type || "text");

  const id = ref(
    `gd-input-text-${Math.random().toString(36).substring(2, 15)}`
  );

  const onChange = (e: Event) => {
    if (props.disabled) return;
    const target = e.target as HTMLInputElement;
    value.value = target.value;
    emits("change", target.value);
  };

  watch(
    () => props.value,
    (val) => {
      if (val !== value.value) {
        value.value = val;
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
    &.gd-input-disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>
