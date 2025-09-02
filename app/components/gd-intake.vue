<template>
  <div
    class="gd-commodity"
    :class="props.selected ? 'gd-commodity-selected' : ''"
  >
    <div class="gd-commodity-header">
      <div class="gd-commodity-header-data">
        <span class="gd-commodity-header-data-name gd-headline-4">
          {{ commodityName }}
        </span>
        <span class="gd-commodity-header-data-code gd-body-4">
          {{ props.intake.id }}
        </span>
      </div>
    </div>
    <div class="gd-commodity-body">
      <div class="gd-commodity-body-data">
        <span class="gd-commodity-body-data-label gd-body-5">Dibuat</span>
        <span class="gd-commodity-body-data-value gd-headline-5">
          {{ getDateString(props.intake.create_date) }}
        </span>
      </div>
      <div class="gd-commodity-body-data">
        <span class="gd-commodity-body-data-label gd-body-5">Vendor</span>
        <span class="gd-commodity-body-data-value gd-headline-5">{{
          vendorName || "Internal"
        }}</span>
      </div>
      <div class="gd-commodity-body-data">
        <span class="gd-commodity-body-data-label gd-body-5">Status</span>
        <span class="gd-commodity-body-data-value gd-headline-5">{{
          statusString
        }}</span>
      </div>
      <div class="gd-commodity-body-data">
        <span class="gd-commodity-body-data-label gd-body-5"
          >Tanggal Keputusan</span
        >
        <span class="gd-commodity-body-data-value gd-headline-5">{{
          props.intake.decision_date
            ? getDateString(props.intake.decision_date)
            : "-"
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IntakeResponse } from "~/types/intake";

  const props = defineProps<{
    intake: IntakeResponse;
    selected: boolean;
  }>();
  const { getCommodityName } = useCommodity();
  const { getVendorName } = useVendor();

  const vendorName = ref("");
  const commodityName = ref("");

  const status = computed(() => {
    if (!props.intake.decision) {
      return "waiting";
    }

    if (props.intake.decision.accepted) {
      return "accepted";
    } else if (props.intake.decision.rejected) {
      return "rejected";
    }
  });
  const statusString = computed(() => {
    if (status.value === "waiting") {
      return "Menunggu";
    } else if (status.value === "accepted") {
      return "Disetujui";
    } else if (status.value === "rejected") {
      return "Ditolak";
    }
  });

  const getDateString = (x: string | number): string => {
    // Parse date in DD/MM/YYYY format
    const date = new Date(x);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  onMounted(async () => {
    if (props.intake.commodity.new) {
      commodityName.value = props.intake.commodity.new.name;
    } else if (props.intake.commodity.existing) {
      commodityName.value = await getCommodityName(
        props.intake.commodity.existing
      );
    }
    if (props.intake.vendor) {
      if (props.intake.vendor.new) {
        vendorName.value = props.intake.vendor.new.name;
      } else if (props.intake.vendor.existing) {
        vendorName.value = await getVendorName(props.intake.vendor.existing);
      }
    }
  });
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
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem 0;
      &-data {
        position: relative;
        width: 50%;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        &-label {
          color: var(--font-secondary-color);
        }
        * {
          position: relative;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
