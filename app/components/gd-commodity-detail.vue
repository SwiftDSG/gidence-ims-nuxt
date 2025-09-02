<template>
  <div class="gd-commodity" :data-view="view">
    <div class="gd-commodity-header">
      <div class="gd-commodity-header-information">
        <gd-button-icon icon="close" type="secondary" @click="emits('close')" />
        <span class="gd-commodity-header-information-title gd-headline-3">{{
          commodity.name
        }}</span>
      </div>
      <gd-button-icon icon="ellipsis" type="secondary" />
    </div>
    <div class="gd-commodity-body">
      <div class="gd-commodity-body-specifications">
        <div
          v-for="(specification, i) in commodity.specification"
          :key="i"
          class="gd-commodity-body-specifications-item"
        >
          <span class="gd-commodity-body-specifications-item-label gd-body-5">
            {{ specification.label }}
          </span>
          <span
            class="gd-commodity-body-specifications-item-value gd-headline-5"
          >
            {{ specification.value }}
          </span>
        </div>
      </div>
      <gd-table
        :header="['Nomor', 'Status', 'Vendor', 'Verifikasi', 'Kadaluarsa', '']"
      >
        <gd-item v-for="item in items" :key="item.id" :item="item" />
      </gd-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { CommodityResponse } from "~/types/commodity";

  const props = defineProps<{
    commodity: CommodityResponse;
  }>();
  const emits = defineEmits<{
    (event: "close"): void;
  }>();
  const { items, getItemsByCommodity } = useItem();
  const { view } = useMain();

  watch(
    () => props.commodity,
    async (val) => {
      if (val && val.id) {
        await getItemsByCommodity(val.id);
      }
    },
    { immediate: true }
  );
</script>

<style lang="scss" scoped>
  .gd-commodity {
    position: relative;
    left: 20vw;
    width: calc(100% - 20vw);
    height: 100svh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    &-header {
      position: relative;
      width: 100%;
      height: 3rem;
      padding: 0.5rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-information {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
    &-body {
      position: relative;
      width: 100%;
      padding: 0.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      &-specifications {
        position: relative;
        width: 100%;
        border-radius: 0.5rem;
        background-color: var(--background-depth-two-color);
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        &::after {
          pointer-events: none;
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          border: var(--border);
          box-sizing: border-box;
        }
        &-item {
          position: relative;
          width: calc(100% / 4);
          padding: 0.25rem 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-label {
            color: var(--font-secondary-color);
            white-space: nowrap;
          }
          &-value {
            position: relative;
            white-space: nowrap;
          }
          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100% + 1px);
            height: calc(100% + 1px);
            border: var(--border);
            box-sizing: border-box;
          }
        }
      }
      &-table {
        position: relative;
        width: 100%;
        border-radius: 0.5rem;
        border: var(--border);
        box-sizing: border-box;
        display: flex;
        overflow: auto;
        &-items {
          position: relative;
          width: 100%;
          border-collapse: collapse;
          &-header {
            width: 100%;
            background-color: var(--background-depth-two-color);
            border-bottom: var(--border);
            box-sizing: border-box;
            &-data {
              position: sticky;
              top: 0;
              left: 0;
              padding: 0.5rem;
              box-sizing: border-box;
              background-color: var(--background-depth-two-color);
              color: var(--font-secondary-color);
              text-align: left;
              white-space: nowrap;
            }
          }
          &-body {
            width: 100%;
          }
        }
      }
    }
    &[data-view="small"] {
      left: 0;
      width: 100vw;
      height: auto;
      background-color: var(--background-depth-two-color);
      .gd-commodity-header {
        height: auto;
        align-items: flex-start;
        &-information {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        > *:last-child {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }
      }
      .gd-commodity-body {
        padding: 0 0.5rem 0.5rem 0.5rem;
        &-specifications {
          &-item {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
</style>
