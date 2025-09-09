<template>
  <div class="gd-page" :data-view="view">
    <div
      class="gd-page-intakes"
      :style="view === 'small' ? `${intakeSelected ? 'z-index: 1' : ''}` : ''"
    >
      <div class="gd-page-intakes-header">
        <span class="gd-page-intakes-header-title gd-headline-3">
          Pengajuan Masuk
        </span>
        <div class="gd-page-intakes-header-action">
          <gd-button-icon
            text="Link"
            icon="copy"
            type="secondary"
            @click="copyToClipboard"
          />
        </div>
      </div>
      <gd-intake
        v-for="intake in intakes"
        :key="intake.id"
        :intake="intake"
        :selected="intakeSelected?.id === intake.id"
        @click="intakeSelected = intake"
      />
    </div>
    <gd-intake-detail
      v-if="intakeSelected"
      :intake="intakeSelected"
      style="z-index: 2"
      @close="intakeSelected = null"
    />
    <div v-else class="gd-page-intake">
      <div class="gd-page-intake-null">
        <span class="gd-page-intake-null-message gd-body-4">
          Silahkan pilih pengajuan
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IntakeResponse } from "~/types/intake";

  const { view } = useMain();
  const { intakes, getIntakes } = useIntake();
  const { setAlert } = useAlert();
  const route = useRoute();

  const intakeSelected = ref<IntakeResponse | null>(null);

  function copyToClipboard() {
    const text = `${window.location.origin}/${route.params.department_id}/intakes/create`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setAlert({
          type: "success",
          title: "ID Pengajuan Disalin",
          message: "Berhasil menyalin ID ke clipboard.",
        });
      })
      .catch(() => {
        setAlert({
          type: "error",
          title: "Gagal Menyalin",
          message: "Terjadi kesalahan saat menyalin ID pengajuan.",
        });
      });
  }

  onMounted(async () => {
    await getIntakes();
  });
</script>

<style lang="scss" scoped>
  .gd-page {
    position: relative;
    width: 100%;
    height: 100svh;
    display: flex;
    overflow: hidden;
    &-intakes {
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
    &-intake {
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
      }
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
      .gd-page-intakes {
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
