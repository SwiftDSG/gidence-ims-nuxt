<template>
  <div class="gd-page" :data-view="view">
    <div
      class="gd-page-commodities"
      :style="
        view === 'small' ? `${commoditySelected ? 'z-index: 1' : ''}` : ''
      "
    >
      <div class="gd-page-commodities-header">
        <span class="gd-page-commodities-header-title gd-headline-3">
          Komoditas
        </span>
      </div>
      <gd-commodity
        v-for="commodity in commodities"
        :key="commodity.id"
        :commodity="commodity"
        :selected="commoditySelected?.id === commodity.id"
        @click="commoditySelected = commodity"
      />
    </div>
    <gd-commodity-detail
      v-if="commoditySelected"
      :commodity="commoditySelected"
      style="z-index: 2"
      @close="commoditySelected = null"
    />
    <div v-else class="gd-page-commodity">
      <div class="gd-page-commodity-null">
        <span class="gd-page-commodity-null-message gd-body-4">
          Silahkan pilih komoditas
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { CommodityResponse } from "~/types/commodity";

  definePageMeta({
    middleware: "auth",
  });

  const { view } = useMain();
  const { commodities, getCommodities } = useCommodity();

  const commoditySelected = ref<CommodityResponse | null>(null);

  onMounted(async () => {
    await getCommodities();
  });
</script>

<style lang="scss" scoped>
  .gd-page {
    position: relative;
    width: 100%;
    height: 100svh;
    display: flex;
    overflow: hidden;
    &-commodities {
      position: absolute;
      width: 20vw;
      height: 100svh;
      border-right: var(--border);
      background-color: var(--background-depth-two-color);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      &-header {
        position: relative;
        width: 100%;
        height: 3rem;
        padding: 0.5rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    &-commodity {
      position: relative;
      left: 20vw;
      width: calc(100% - 20vw);
      height: 100svh;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      &-null {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &-message {
          color: var(--font-secondary-color);
          opacity: 0.75;
        }
      }
    }
    &[data-view="small"] {
      width: 100vw;
      height: auto;
      .gd-page-commodities {
        z-index: 2;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100svh;
        border-right: none;
      }
    }
  }
</style>
