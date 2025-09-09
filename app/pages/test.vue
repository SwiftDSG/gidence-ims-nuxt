<template>
  <div class="gd-test">
    <gd-input-text-opus
      v-model="inputOpus"
      label="Input Opus"
      placeholder="Enter text for Input Opus"
      :limit="50"
    />
    <gd-input-text-gpt
      :value="inputGpt"
      label="Input GPT"
      placeholder="Enter text for Input GPT"
      :limit="50"
    />
    <gd-input-text-z
      :value="inputZ"
      label="Input Z"
      placeholder="Enter text for Input Z"
      :limit="50"
    />
  </div>
</template>

<script lang="ts" setup>
  const inputOpus = ref("");
  const inputGpt = ref("");
  const inputZ = ref("");

  onMounted(() => {
    console.log("Component mounted");
  })
</script>
