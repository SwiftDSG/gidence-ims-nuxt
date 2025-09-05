<template>
  <client-only>
    <div class="gd-input" :class="props.disabled ? 'gd-input-disabled' : ''">
      <label
        v-if="props.label"
        class="gd-input-label gd-headline-6"
        :id="labelId"
        :for="id"
      >
        {{ props.label }}
      </label>

      <input
        :id="id"
        :name="props.name"
        :type="typeRef"
        class="gd-input-text"
        :class="props.class || 'gd-headline-5'"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :maxLength="props.limit"
        autocomplete="off"
        v-model="model"
        :aria-labelledby="props.label ? labelId : undefined"
        :aria-disabled="props.disabled || undefined"
        @focus="emits('focus')"
        @blur="emits('blur')"
      />

      <div
        v-if="props.type === 'password'"
        class="gd-input-show"
        role="button"
        tabindex="0"
        @click="toggleVisible"
        @keydown.enter.prevent="toggleVisible"
        @keydown.space.prevent="toggleVisible"
        :aria-label="typeRef === 'text' ? 'Hide password' : 'Show password'"
      >
        <gd-svg
          :name="typeRef === 'text' ? 'eye' : 'eye-off'"
          color="secondary"
        />
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

  // v-model proxy that preserves your existing API (prop: value, event: change)
  const model = computed<string>({
    get: () => props.value,
    set: (val) => {
      if (!props.disabled) emits("change", val);
    },
  });

  // input type handling (keeps the toggle local but reacts if prop changes)
  const typeRef = ref(props.type ?? "text");
  watch(
    () => props.type,
    (t) => (typeRef.value = t ?? "text")
  );
  const toggleVisible = () => {
    typeRef.value = typeRef.value === "text" ? "password" : "text";
  };

  // deterministic id (avoids hydration issues while keeping your pattern)
  const baseId =
    props.name && props.name.trim()
      ? `gd-input-text-${props.name}`
      : `gd-input-text-${Math.random().toString(36).slice(2, 10)}`;

  const id = ref(baseId);
  const labelId = `${baseId}-label`;
</script>

<style lang="scss" scoped>
  /* unchanged */
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
