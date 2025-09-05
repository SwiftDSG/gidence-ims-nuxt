<template>
  <div class="gd-intake" :data-view="view">
    <div class="gd-intake-header">
      <div class="gd-intake-header-information">
        <gd-button-icon
          icon="arrow-left"
          type="secondary"
          @click="emits('close')"
        />
        <span class="gd-intake-header-information-title gd-headline-3">{{
          intake.id
        }}</span>
      </div>
      <div v-if="!intake.decision" class="gd-intake-header-actions">
        <gd-button-icon
          icon="close"
          type="error"
          :tooltip="{
            text: 'Tolak',
            position: 'bottom',
          }"
          @click="
            () => {
              modalAction = 'reject';
              modalVisible = true;
            }
          "
        />
        <gd-button-icon
          icon="check"
          type="success"
          :tooltip="{
            text: 'Terima',
            position: 'bottom',
          }"
          @click="
            () => {
              modalAction = 'accept';
              modalVisible = true;
            }
          "
        />
      </div>
    </div>
    <div class="gd-intake-body">
      <div v-if="vendor" class="gd-intake-body-group">
        <span class="gd-intake-body-group-title gd-headline-4"
          >Detil Vendor</span
        >
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Nama Vendor
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ vendor.name }}
          </span>
        </div>
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Nomor Telepon
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ vendor.phone }}
          </span>
        </div>
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5"> Email </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ vendor.email }}
          </span>
        </div>
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Alamat
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ vendor.address }}
          </span>
        </div>
      </div>
      <div v-if="commodity" class="gd-intake-body-group">
        <span class="gd-intake-body-group-title gd-headline-4"
          >Detil Komoditas</span
        >
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Nama Barang
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ commodity.name }}
          </span>
        </div>
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Kategori
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ category }}
          </span>
        </div>
        <div
          v-for="(specification, i) in commodity.specification"
          :key="i"
          class="gd-intake-body-group-data"
        >
          <span class="gd-intake-body-group-data-label gd-body-5">
            {{ specification.label }}
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ specification.value }}
          </span>
        </div>
      </div>
      <div v-if="intake.decision" class="gd-intake-body-group">
        <span class="gd-intake-body-group-title gd-headline-4"
          >Detil Keputusan</span
        >
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Keputusan
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ intake.decision.accepted ? "Diterima" : "Ditolak" }}
          </span>
        </div>
        <div class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Tanggal
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ intake.decision_date }}
          </span>
        </div>
        <div v-if="user" class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Pengambil Keputusan
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ user.name }}
          </span>
        </div>

        <div v-if="intake.decision.rejected" class="gd-intake-body-group-data">
          <span class="gd-intake-body-group-data-label gd-body-5">
            Alasan Penolakan
          </span>
          <span class="gd-intake-body-group-data-value gd-headline-5">
            {{ intake.decision.rejected[1] }}
          </span>
        </div>
      </div>
    </div>
    <gd-modal
      :visible="modalVisible"
      @close="modalVisible = false"
      :name="modalAction === 'accept' ? 'Terima Pengajuan' : 'Tolak Pengajuan'"
    >
      <div v-if="modalAction === 'accept'" class="gd-intake-modal">
        <span class="gd-intake-modal-message gd-body-5"
          >Apakah Anda yakin ingin menerima permintaan ini?</span
        >
        <gd-button
          text="Terima pengajuan"
          type="success"
          @click="accept"
          :disabled="modalLoading"
        />
      </div>
      <div v-else-if="modalAction === 'reject'" class="gd-intake-modal">
        <span class="gd-intake-modal-message gd-body-5"
          >Apakah Anda yakin ingin menolak permintaan ini? Sertakan alasan
          penolakan.</span
        >
        <gd-input-text v-model="modalReason" />
        <gd-button
          text="Tolak pengajuan"
          type="error"
          :disabled="!modalReason || modalLoading"
          @click="reject"
        />
      </div>
    </gd-modal>
  </div>
</template>

<script lang="ts" setup>
  import type { CommodityRequest } from "~/types/commodity";
  import type { IntakeResponse } from "~/types/intake";
  import type { UserResponse } from "~/types/user";
  import type { VendorRequest } from "~/types/vendor";

  const props = defineProps<{
    intake: IntakeResponse;
  }>();
  const emits = defineEmits<{
    (event: "close"): void;
  }>();

  const { getCommodity } = useCommodity();
  const { getCategoryName } = useCategory();
  const { getVendor } = useVendor();
  const { getUser } = useUser();
  const { acceptIntake, rejectIntake } = useIntake();
  const { view } = useMain();

  const vendor = ref<VendorRequest | null>(null);
  const commodity = ref<CommodityRequest | null>(null);
  const user = ref<UserResponse | null>(null);
  const category = ref<string | null>(null);

  const modalVisible = ref(false);
  const modalLoading = ref(false);
  const modalAction = ref<"accept" | "reject" | undefined>();
  const modalReason = ref("");

  const accept = async () => {
    modalLoading.value = true;
    await acceptIntake(props.intake.id);
    modalLoading.value = false;
    emits("close");
  };
  const reject = async () => {
    modalLoading.value = true;
    await rejectIntake(props.intake.id, modalReason.value);
    modalReason.value = "";
    modalLoading.value = false;
    modalVisible.value = false;
    emits("close");
  };

  onMounted(async () => {
    if (props.intake.commodity.new) {
      commodity.value = props.intake.commodity.new;
    } else if (props.intake.commodity.existing) {
      commodity.value = await getCommodity(props.intake.commodity.existing);
    }
    if (props.intake.vendor) {
      if (props.intake.vendor.new) {
        vendor.value = props.intake.vendor.new;
      } else if (props.intake.vendor.existing) {
        vendor.value = await getVendor(props.intake.vendor.existing);
      }
    }

    if (commodity.value) {
      category.value = await getCategoryName(commodity.value.category_id);
    }

    if (props.intake.decision) {
      if (props.intake.decision.accepted) {
        user.value = await getUser(props.intake.decision.accepted);
      } else if (props.intake.decision.rejected) {
        user.value = await getUser(props.intake.decision.rejected[0]);
      }
    }
  });
</script>

<style lang="scss" scoped>
  .gd-intake {
    position: relative;
    left: 20vw;
    width: calc(100% - 20vw);
    height: 100svh;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    &-header {
      z-index: 1;
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
      &-actions {
        position: relative;
        display: flex;
        gap: 0.5rem;
      }
    }
    &-body {
      z-index: 0;
      position: relative;
      width: 100%;
      padding: 0.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      &-group {
        position: relative;
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: var(--border);
        background-color: var(--background-depth-two-color);
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0;
        &-title {
          position: relative;
          width: 100%;
        }
        &-data {
          position: relative;
          width: 25%;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          &-label {
            position: relative;
            color: var(--font-secondary-color);
          }
        }
      }
    }
    &[data-view="small"] {
      left: 0;
      width: 100vw;
      height: auto;
      background-color: var(--background-depth-two-color);
      .gd-intake-header {
        height: auto;
        align-items: flex-start;
        &-information {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        > *:last-child:not(:first-child) {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }
      }
      .gd-intake-body {
        padding: 0 0.5rem 0.5rem 0.5rem;
        &-group {
          &-data {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .gd-intake-modal {
    position: relative;
    width: 15rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-message {
      position: relative;
      color: var(--font-secondary-color);
    }
  }
</style>
