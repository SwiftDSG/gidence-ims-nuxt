<template>
  <tr class="gd-row">
    <td class="gd-row-data gd-headline-5">
      {{ props.item.code }}
    </td>
    <td v-if="full" class="gd-row-data gd-headline-5">
      {{ props.item.commodity_name }}
    </td>
    <td class="gd-row-data">
      <span
        class="gd-row-data-status gd-headline-6"
        :class="`gd-row-data-status-${status}`"
        :data-status="statusName"
        >{{ statusName }}</span
      >
    </td>
    <td class="gd-row-data gd-headline-5">
      {{ props.item.vendor_name || "Internal" }}
    </td>
    <td class="gd-row-data gd-headline-5">
      {{ lastVerification ? getDateString(lastVerification.create_date) : "-" }}
    </td>
    <td class="gd-row-data gd-headline-5">
      {{
        lastVerification && lastVerification.decision !== "decommissioned"
          ? getDateString(
              lastVerification.create_date +
                lastVerification.decision.operational * 86400000
            )
          : "-"
      }}
    </td>
    <td class="gd-row-data">
      <div class="gd-row-data-action">
        <gd-button-icon
          v-if="status !== 'decommissioned'"
          icon="plus"
          type="secondary"
          :borderless="true"
          :tooltip="{
            text: 'Tambah verifikasi',
            position: 'left',
          }"
          @click="formOpened = true"
        />
        <gd-button-icon
          icon="ellipsis"
          type="secondary"
          :borderless="true"
          :tooltip="{
            text: 'Lihat barang',
            position: 'left',
          }"
          @click="modalOpened = true"
        />
      </div>
    </td>
    <gd-modal
      :name="props.item.code"
      :visible="modalOpened"
      @close="modalOpened = false"
    >
      <div class="gd-row-modal" :data-view="view">
        <div class="gd-row-modal-specifications">
          <div class="gd-row-modal-specifications-item">
            <span class="gd-row-modal-specifications-item-label gd-body-5">
              Vendor
            </span>
            <span class="gd-row-modal-specifications-item-value gd-headline-5">
              {{ props.item.vendor_name || "Internal" }}
            </span>
          </div>
          <div class="gd-row-modal-specifications-item">
            <span class="gd-row-modal-specifications-item-label gd-body-5">
              Status
            </span>
            <span class="gd-row-modal-specifications-item-value gd-headline-5">
              {{ statusName }}
            </span>
          </div>
          <div class="gd-row-modal-specifications-item">
            <span class="gd-row-modal-specifications-item-label gd-body-5">
              Tanggal Verifikasi
            </span>
            <span class="gd-row-modal-specifications-item-value gd-headline-5">
              {{
                lastVerification
                  ? getDateString(lastVerification.create_date)
                  : "-"
              }}
            </span>
          </div>
          <div class="gd-row-modal-specifications-item">
            <span class="gd-row-modal-specifications-item-label gd-body-5">
              Tanggal Kadaluarsa
            </span>
            <span class="gd-row-modal-specifications-item-value gd-headline-5">
              {{
                lastVerification &&
                lastVerification.decision !== "decommissioned"
                  ? getDateString(
                      lastVerification.create_date +
                        lastVerification.decision.operational * 86400000
                    )
                  : "-"
              }}
            </span>
          </div>
        </div>
        <gd-table :header="['Pilihan', 'Penguji', 'Tanggal', 'Kadaluarsa']">
          <gd-verification
            v-for="verification in verifications"
            :key="verification.id"
            :verification="verification"
          />
        </gd-table>
        <!-- <table class="gd-row-modal-verifications">
          <thead class="gd-row-modal-verifications-header">
            <tr class="gd-row-modal-verifications-header-row">
              <th class="gd-row-modal-verifications-header-row-data gd-body-5">
                Pilihan
              </th>
              <th class="gd-row-modal-verifications-header-row-data gd-body-5">
                Penguji
              </th>
              <th
                class="gd-row-modal-verifications-header-row-data gd-body-5"
              
              >
                Tanggal
              </th>
              <th
                class="gd-row-modal-verifications-header-row-data gd-body-5"
              
              >
                Kadaluarsa
              </th>
            </tr>
          </thead>
          <tbody class="gd-row-modal-verifications-header">
            <gd-verification
              v-for="verification in verifications"
              :key="verification.id"
              :verification="verification"
            />
          </tbody>
        </table> -->
      </div>
    </gd-modal>
    <gd-modal
      name="Verifikasi Alat"
      :visible="formOpened"
      @close="formOpened = false"
    >
      <form class="gd-row-form">
        <div class="gd-row-form-input">
          <gd-input-text-select
            :model="formDecisionModel"
            :options="formDecisionOptions"
            :strict="true"
            type="secondary"
            label="Status"
            placeholder="Pilih status"
          />
        </div>
        <div
          v-if="formDecisionModel.value === 'operational'"
          class="gd-row-form-input"
        >
          <gd-input-text
            v-model="formDecisionExpiration"
            type="text"
            label="Masa berlaku (hari)"
            placeholder="90"
          />
        </div>
        <div class="gd-row-form-input">
          <gd-input-text
            v-model="formNote"
            label="Catatan"
            placeholder="Catatan"
          />
        </div>
        <div class="gd-row-form-button">
          <gd-button
            text="Kirim"
            type="primary"
            style="width: 100%"
            @click="formSubmit"
          />
        </div>
      </form>
    </gd-modal>
  </tr>
</template>

<script lang="ts" setup>
  import type { ItemResponse } from "~/types/item";
  import type { VerificationResponse } from "~/types/verification";

  const props = defineProps<{
    item: ItemResponse;
    full?: boolean;
  }>();
  const { getVerificationsByItem, createVerification } = useVerification();
  const { view } = useMain();

  const verifications = ref<VerificationResponse[]>([]);

  const modalOpened = ref(false);
  const formOpened = ref(false);
  const formDecisionOptions = ref<{ label: string; value: string }[]>([
    { label: "Dekomisi", value: "decommissioned" },
    { label: "Operasional", value: "operational" },
  ]);
  const formDecisionModel = ref<{ label: string; value: string }>({
    label: "",
    value: "",
  });
  const formNote = ref("");
  const formDecisionExpiration = ref("90");

  const status = computed<"non_compliant" | "operational" | "decommissioned">(
    () => {
      if (props.item.state === "decommissioned") return "decommissioned";

      const verification = verifications.value[0];
      if (!verification) return "non_compliant";
      if (verification.decision === "decommissioned") return "decommissioned";

      const todayDate = new Date().getTime();
      const verificationDate = new Date(
        verification.create_date + verification.decision.operational * 86400000
      ).getTime();

      if (verificationDate < todayDate) return "non_compliant";

      return "operational";
    }
  );
  const statusName = computed(() => {
    switch (status.value) {
      case "operational":
        return "Operasional";
      case "decommissioned":
        return "Non Aktif";
      case "non_compliant":
        return "Kadaluarsa";
      default:
        return "Tidak Diketahui";
    }
  });
  const lastVerification = computed<VerificationResponse | null>(() => {
    if (!verifications.value[0]) return null;
    return verifications.value[0];
  });

  const getDateString = (x: string | number) => {
    const date = new Date(x);

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formSubmit = async () => {
    const verification = await createVerification({
      item_id: props.item.id,
      decision:
        formDecisionModel.value.value === "operational"
          ? {
              operational: parseInt(formDecisionExpiration.value) || 90,
            }
          : "decommissioned",
      note: formNote.value,
    });
    if (verification) {
      verifications.value.unshift(verification);
      formOpened.value = false;
    }
  };

  onMounted(async () => {
    verifications.value = await getVerificationsByItem(props.item.id);
  });
</script>

<style lang="scss" scoped>
  .gd-row {
    position: relative;
    width: 100%;
    height: 2rem;
    &-data {
      position: sticky;
      left: 0;
      height: 100%;
      color: var(--font-primary-color);
      background-color: var(--background-depth-one-color);
      border-bottom: var(--border);
      padding: 0 0.5rem;
      box-sizing: border-box;
      text-align: left;
      white-space: nowrap;
      transition: 0.25s background-color;
      &-status {
        position: relative;
        width: 100%;
        height: 100%;
        padding-right: 1rem;
        display: flex;
        align-items: center;
        flex-grow: 0;
        color: transparent;
        &::before {
          content: attr(data-status);
          position: absolute;
          height: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
          border-radius: 0.5rem;
          padding: 0 0.5rem;
          background-color: var(--background-depth-two-color);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.1;
        }
        &::after {
          content: attr(data-status);
          position: absolute;
          height: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05rem;
          border-radius: 0.5rem;
          padding: 0 0.5rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &.gd-row-data-status-operational {
          &::before {
            color: var(--success-color);
            background-color: var(--success-color);
          }
          &::after {
            color: var(--success-color);
          }
        }
        &.gd-row-data-status-decommissioned {
          &::before {
            color: var(--error-color);
            background-color: var(--error-color);
          }
          &::after {
            color: var(--error-color);
          }
        }
        &.gd-row-data-status-non_compliant {
          &::before {
            color: var(--warning-color);
            background-color: var(--warning-color);
          }
          &::after {
            color: var(--warning-color);
          }
        }
      }
      &-action {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
    &:hover {
      .gd-row-data {
        background-color: var(--background-depth-three-color);
      }
    }
    &:last-child {
      .gd-row-data {
        border-bottom: none;
      }
    }
  }
</style>

<style lang="scss">
  .gd-row {
    &-modal {
      position: relative;
      width: 50vw;
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
          width: calc(100% / 2);
          padding: 0.25rem 0.5rem;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-label {
            color: var(--font-secondary-color);
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
      &-verifications {
        position: relative;
        width: 100%;
        border-collapse: collapse;
        border-radius: 0.5rem;
        overflow: hidden;
        &::after {
          pointer-events: none;
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: var(--border);
          border-radius: 0.5rem;
          box-sizing: border-box;
        }
        &-header {
          position: relative;
          width: 100%;
          background-color: var(--background-depth-two-color);
          border-bottom: var(--border);
          box-sizing: border-box;
          &-row {
            position: relative;
            width: 100%;
            &-data {
              position: relative;
              padding: 0.5rem;
              box-sizing: border-box;
              color: var(--font-secondary-color);
              text-align: left;
              white-space: nowrap;
            }
          }
        }
        &-body {
          position: relative;
          width: 100%;
        }
      }
      &[data-view="small"] {
        .gd-row-modal-specifications {
          &-item {
            width: 100%;
          }
        }
      }
    }
    &-form {
      position: relative;
      width: 15rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      &-input {
        position: relative;
        width: 100%;
      }
      &-button {
        position: relative;
        margin-top: 0.5rem;
      }
    }
  }
</style>
