<template>
  <div v-if="departmentSummary" class="gd-page">
    <div class="gd-page-header">
      <span class="gd-page-header-title gd-headline-2">
        {{ departmentSummary.name }}
      </span>
      <div class="gd-page-header-action">
        <gd-button
          text="Cari"
          icon="search"
          type="secondary"
          @click="itemSearchVisible = true"
        />
      </div>
    </div>
    <div class="gd-page-insight">
      <div class="gd-page-insight-icon">
        <gd-svg name="shapes" color="secondary" />
      </div>
      <div class="gd-page-insight-information">
        <span class="gd-page-insight-information-name gd-body-4"
          >Jumlah Komoditas</span
        >
        <span
          class="gd-page-insight-information-value gd-headline-1"
          data-suffix="komoditas"
        >
          {{ departmentSummary.commodity_count }}
        </span>
      </div>
    </div>
    <!-- <div class="gd-page-insight gd-insight-warning">
      <div class="gd-page-insight-icon">
        <gd-svg name="circle-dashed" color="warning" />
      </div>
      <div class="gd-page-insight-information">
        <span class="gd-page-insight-information-name gd-body-4"
          >Komoditas Kosong</span
        >
        <span
          class="gd-page-insight-information-value gd-headline-1"
          data-suffix="komoditas"
        >
          {{ departmentSummary.commodity_count_empty }}
        </span>
      </div>
    </div> -->
    <div class="gd-page-insight gd-insight-success">
      <div class="gd-page-insight-icon">
        <gd-svg name="layout-aligned" color="success" />
      </div>
      <div class="gd-page-insight-information">
        <span class="gd-page-insight-information-name gd-body-4"
          >Jumlah Alat</span
        >
        <span
          class="gd-page-insight-information-value gd-headline-1"
          data-suffix="barang"
        >
          {{ departmentSummary.item_count }}
        </span>
      </div>
    </div>
    <div class="gd-page-insight gd-insight-warning">
      <div class="gd-page-insight-icon">
        <gd-svg name="grid-add" color="warning" />
      </div>
      <div class="gd-page-insight-information">
        <span class="gd-page-insight-information-name gd-body-4"
          >Alat Kadaluarsa</span
        >
        <span
          class="gd-page-insight-information-value gd-headline-1"
          data-suffix="barang"
        >
          {{ departmentSummary.item_count_non_compliant }}
        </span>
      </div>
    </div>
    <div class="gd-page-insight gd-insight-error">
      <div class="gd-page-insight-icon">
        <gd-svg name="grid-off" color="error" />
      </div>
      <div class="gd-page-insight-information">
        <span class="gd-page-insight-information-name gd-body-4"
          >Alat Rusak</span
        >
        <span
          class="gd-page-insight-information-value gd-headline-1"
          data-suffix="komoditas"
        >
          {{ departmentSummary.item_count_decommissioned }}
        </span>
      </div>
    </div>
    <div class="gd-page-items">
      <gd-table
        :header="[
          'Nomor',
          'Komoditas',
          'Status',
          'Vendor',
          'Verifikasi',
          'Kadaluarsa',
          '',
        ]"
      >
        <gd-item
          v-for="item in items"
          :key="item.id"
          :item="item"
          :full="true"
        />
      </gd-table>
    </div>
    <gd-modal
      name="Cari alat"
      :visible="itemSearchVisible"
      @close="itemSearchVisible = false"
    >
      <div class="gd-item-search-modal">
        <div class="gd-item-search-modal-input">
          <gd-input-text
            v-model="itemSearch"
            placeholder="Masukkan kode barang"
            type="text"
          />
          <gd-button-icon icon="search" type="primary" @click="itemGetByCode" />
        </div>
        <gd-table
          v-if="itemSearched"
          :header="[
            'Nomor',
            'Komoditas',
            'Status',
            'Vendor',
            'Verifikasi',
            'Kadaluarsa',
            '',
          ]"
        >
          <gd-item :item="itemSearched" :full="true" />
        </gd-table>
      </div>
    </gd-modal>
  </div>
</template>

<script setup lang="ts">
  import type { DepartmentSummary } from "~/types/department";
  import type { ItemResponse } from "~/types/item";

  const { setAlert } = useAlert();
  const { getDepartmentSummary } = useDepartment();
  const { items, getItemsExpired, getItemByCode } = useItem();
  const route = useRoute();

  const itemSearchVisible = ref(false);
  const itemSearch = ref("");
  const itemSearched = ref<ItemResponse | null>(null);

  const itemGetByCode = async () => {
    itemSearched.value = null;
    itemSearched.value = await getItemByCode(itemSearch.value);
    itemSearch.value = "";
    if (!itemSearched.value) {
      setAlert({
        type: "warning",
        title: "Barang tidak ditemukan",
        message: "Silakan gunakan kode barang yang berbeda.",
      });
    }
  };

  const departmentSummary = ref<DepartmentSummary | null>(null);

  const departmentId = computed(() => route.params.department_id as string);

  onMounted(async () => {
    await getItemsExpired(departmentId.value);
    departmentSummary.value = await getDepartmentSummary(departmentId.value);
  });
</script>

<style lang="scss" scoped>
  .gd-page {
    width: 100%;
    overflow: auto;
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-self: flex-start;
    justify-content: center;
    gap: 1rem;

    &-header {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      &-title {
        position: relative;
        display: flex;
        align-items: center;
      }
    }
    &-insight {
      position: relative;
      width: calc((100% - 3rem) / 4);
      padding: 0.75rem 0.75rem 0.625rem 0.75rem;
      border-radius: 1rem;
      border: var(--border);
      background-color: var(--background-depth-one-color);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &-icon {
        position: relative;
        width: 3rem;
        height: 3rem;
        padding: 0 0.75rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          background-color: var(--font-secondary-color);
          opacity: 0.1;
        }
      }

      &-information {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        &-name {
          position: relative;
          color: var(--font-secondary-color);
        }

        &-value {
          position: relative;
          color: var(--font-primary-color);
          display: flex;
          align-items: first baseline;
        }
      }

      &.gd-insight-success {
        .gd-insight-icon {
          &::before {
            background-color: var(--success-color);
          }
        }
      }
      &.gd-insight-warning {
        .gd-insight-icon {
          &::before {
            background-color: var(--warning-color);
          }
        }
      }
      &.gd-insight-error {
        .gd-insight-icon {
          &::before {
            background-color: var(--error-color);
          }
        }
      }
    }
    &-items {
      position: relative;
      width: 100%;
    }
  }
</style>

<style lang="scss" scoped>
  .gd-item-search-modal {
    position: relative;
    width: 40vw;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    &-input {
      position: relative;
      width: 100%;
      display: flex;
      gap: 0.5rem;
    }
  }
</style>
