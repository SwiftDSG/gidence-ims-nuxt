<template>
  <div
    class="gd-commodity"
    :class="props.selected ? 'gd-commodity-selected' : ''"
  >
    <div class="gd-commodity-header">
      <div class="gd-commodity-header-data">
        <span class="gd-commodity-header-data-name gd-headline-4">
          {{ props.commodity.name }}
        </span>
        <span class="gd-commodity-header-data-code gd-body-4">
          {{ props.commodity.code }}
        </span>
      </div>
    </div>
    <div class="gd-commodity-body">
      <div class="gd-commodity-body-data">
        <span class="gd-commodity-body-data-label gd-body-5">Kategori</span>
        <span class="gd-commodity-body-data-value gd-headline-5">
          {{ props.commodity.category_name }}
        </span>
      </div>
      <div class="gd-commodity-body-data">
        <span class="gd-commodity-body-data-label gd-body-5">Kuantitas</span>
        <span class="gd-commodity-body-data-value gd-headline-5">
          {{ props.commodity.quantity }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { CommodityResponse } from "~/types/commodity";

  const props = defineProps<{
    commodity: CommodityResponse;
    selected: boolean;
  }>();
  const { getCategoryName } = useCategory();
</script>

<style lang="scss" scoped>
  .gd-commodity {
    cursor: pointer;
    position: relative;
    width: 100%;
    padding: 0.5rem;
    border-bottom: var(--border);
    box-sizing: border-box;
    background-color: var(--background-depth-one-color);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    &-header {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      &-data {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        &-code {
          color: var(--font-secondary-color);
        }
      }
    }
    &-body {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      &-data {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        &-label {
          color: var(--font-secondary-color);
        }
      }
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--primary-color);
      transition: 0.25s opacity;
      opacity: 0;
    }
    &.gd-commodity-selected {
      &::before {
        opacity: 0.05;
      }
    }
  }
</style>
