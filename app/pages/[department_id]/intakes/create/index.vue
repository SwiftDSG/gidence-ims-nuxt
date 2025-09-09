<template>
  <div class="gd">
    <div class="gd-panel" ref="gdPanel">
      <div class="gd-panel-logo">
        <img src="/logotype.svg" />
      </div>
      <form class="gd-panel-form" @keypress.enter.prevent="submit">
        <div class="gd-panel-form-header">
          <h1 class="gd-panel-form-header-title gd-headline-2">
            Pengajuan Barang
          </h1>
          <p class="gd-panel-form-header-subtitle gd-body-4">
            Silahkan isi data di bawah ini untuk mengajukan pemasukan barang.
          </p>
        </div>
        <div class="gd-panel-form-body">
          <div v-if="vendorNew" class="gd-panel-form-body-group">
            <div class="gd-panel-form-body-group-title gd-headline-5">
              Informasi Vendor Baru
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text
                v-model="vendorName"
                label="Nama Vendor"
                placeholder="Contoh: PT. Mari Sukses Bersama"
              />
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text
                v-model="vendorEmail"
                label="Email Vendor"
                placeholder="Contoh: email@vendor.com"
              />
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text
                v-model="vendorPhone"
                label="Telepon Vendor"
                placeholder="Contoh: +62 812 3456 7890"
              />
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text
                v-model="vendorAddress"
                label="Alamat Vendor"
                placeholder="Contoh: Jl. Raya No. 123"
              />
            </div>
            <p class="gd-panel-form-body-group-message gd-body-5">
              Vendor sudah terdaftar?
              <span
                class="gd-panel-form-body-group-message-link gd-headline-6"
                @click="vendorNew = false"
              >
                Pilih dari daftar
              </span>
            </p>
          </div>
          <div v-else class="gd-panel-form-body-group">
            <div class="gd-panel-form-body-group-title gd-headline-5">
              Informasi Vendor
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text-select
                :options="vendorOptions"
                v-model="vendorModel"
                :strict="true"
                placeholder="Pilih Vendor"
                type="primary"
              />
            </div>
            <p class="gd-panel-form-body-group-message gd-body-5">
              Vendor belum terdaftar?
              <span
                class="gd-panel-form-body-group-message-link gd-headline-6"
                @click="vendorNew = true"
              >
                Buat baru
              </span>
            </p>
          </div>
          <div v-if="commodityNew" class="gd-panel-form-body-group">
            <div class="gd-panel-form-body-group-title gd-headline-5">
              Informasi Barang Baru
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text
                v-model="commodityName"
                label="Nama Barang"
                placeholder="Contoh: Fluke 15B Digital Multimeter"
              />
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text-select
                :options="commodityCategoryOptions"
                v-model="commodityCategoryModel"
                label="Kategori barang"
                placeholder="Contoh: Digital Multimeter"
                type="primary"
              />
            </div>
            <div
              v-for="(specification, index) in commoditySpecification"
              class="gd-panel-form-body-group-input"
            >
              <gd-input-text
                v-model="specification[0]"
                label="Label Spesifikasi"
                placeholder="Contoh: Merk"
              />
              <gd-input-text
                v-model="specification[1]"
                label="Nilai Spesifikasi"
                placeholder="Contoh: Fluke"
              />
              <gd-button-icon
                icon="close"
                type="secondary"
                :tooltip="{
                  text: 'Hapus spesifikasi',
                  position: 'left',
                }"
                :disabled="commoditySpecification.length === 1"
                @click="commoditySpecification.splice(index, 1)"
              />
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-button
                text="Tambah spesifikasi"
                type="secondary"
                style="width: 100%"
                @click="commoditySpecification.push(['', ''])"
              />
            </div>
            <p class="gd-panel-form-body-group-message gd-body-5">
              Barang sudah terdaftar?
              <span
                class="gd-panel-form-body-group-message-link gd-headline-6"
                @click="commodityNew = false"
              >
                Pilih dari daftar
              </span>
            </p>
          </div>
          <div v-else class="gd-panel-form-body-group">
            <div class="gd-panel-form-body-group-title gd-headline-5">
              Informasi Barang
            </div>
            <div class="gd-panel-form-body-group-input">
              <gd-input-text-select
                :options="commodityOptions"
                v-model="commodityModel"
                :strict="true"
                placeholder="Pilih Barang"
                type="primary"
              />
            </div>
            <p class="gd-panel-form-body-group-message gd-body-5">
              Barang belum terdaftar?
              <span
                class="gd-panel-form-body-group-message-link gd-headline-6"
                @click="commodityNew = true"
              >
                Buat baru
              </span>
            </p>
          </div>
          <div class="gd-panel-form-body-button">
            <gd-button
              text="Buat pengajuan"
              type="primary"
              style="width: 100%"
              :disabled="loading"
              @click="submit"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import type { Intake } from "~/types/intake";

  const { view } = useMain();
  const { setAlert } = useAlert();
  const { categories, getCategories, createCategory } = useCategory();
  const { vendors, getVendors } = useVendor();
  const { commodities, getCommodities } = useCommodity();
  const { createIntake } = useIntake();
  const router = useRouter();
  const route = useRoute();

  const emits = defineEmits<{
    (e: "shake"): void;
  }>();

  definePageMeta({
    layout: "auth",
  });

  const gdPanel = ref<HTMLDivElement>();

  const timeline = ref<GSAPTimeline>(
    gsap.timeline({
      paused: true,
    })
  );
  const loading = ref<boolean>(false);

  const vendorOptions = ref<{ label: string; value: string }[]>([]);
  const vendorModel = ref<{ label: string; value: string }>({
    label: "",
    value: "",
  });
  const vendorName = ref<string>("");
  const vendorEmail = ref<string>("");
  const vendorPhone = ref<string>("");
  const vendorAddress = ref<string>("");
  const vendorNew = ref<boolean>(false);

  const commodityOptions = ref<{ label: string; value: string }[]>([]);
  const commodityModel = ref<{ label: string; value: string }>({
    label: "",
    value: "",
  });
  const commodityName = ref<string>("");
  const commodityCategoryOptions = ref<{ label: string; value: string }[]>([]);
  const commodityCategoryModel = ref<{ label: string; value: string }>({
    label: "",
    value: "",
  });
  const commoditySpecification = ref<[string, string][]>([["", ""]]);
  const commodityNew = ref<boolean>(false);

  const departmentId = computed(() => {
    return route.params.department_id as string;
  });

  const submit = async () => {
    let vendor: Intake["vendor"] | null = null;
    let commodity: Intake["commodity"] | null = null;

    if (vendorNew.value) {
      const name = vendorName.value.trim();
      const email = vendorEmail.value.trim();
      const phone = vendorPhone.value.trim();
      const address = vendorAddress.value.trim();

      console.log(name, email, phone, address);

      if (!name || !email || !phone || !address) {
        setAlert({
          type: "error",
          title: "Gagal membuat pengajuan barang",
          message: "Silahkan lengkapi semua field.",
        });
      }

      vendor = {
        new: {
          name: vendorName.value,
          email: vendorEmail.value,
          phone: vendorPhone.value,
          address: vendorAddress.value,
        },
      };
    } else {
      if (!vendorModel.value.value) {
        setAlert({
          type: "error",
          title: "Gagal membuat pengajuan barang",
          message: "Silahkan pilih vendor yang sudah ada.",
        });
        return;
      }

      vendor = {
        existing: vendorModel.value.value,
      };
    }

    if (commodityNew.value) {
      const name = commodityName.value.trim();
      const specification = commoditySpecification.value
        .map((a) => ({
          label: a[0].trim(),
          value: a[1].trim(),
        }))
        .filter((a) => a.label && a.value);

      console.log(name, specification);

      if (!name || specification.length === 0) {
        setAlert({
          type: "error",
          title: "Gagal membuat pengajuan barang",
          message: "Silahkan lengkapi semua field.",
        });
        return;
      }

      let category =
        categories.value.find(
          (cat) => cat.id === commodityCategoryModel.value.value
        ) || null;
      if (!category) {
        category = await createCategory({
          name: commodityCategoryModel.value.label,
        });
      }

      if (!category) {
        setAlert({
          type: "error",
          title: "Gagal membuat pengajuan barang",
          message: "Silahkan pilih kategori yang sudah ada.",
        });
        return;
      }

      commodity = {
        new: {
          name: commodityName.value,
          department_id: departmentId.value,
          category_id: category.id,
          specification,
        },
      };
    } else {
      if (!commodityModel.value.value) {
        setAlert({
          type: "error",
          title: "Gagal membuat pengajuan barang",
          message: "Silahkan pilih barang yang sudah ada.",
        });
        return;
      }

      commodity = {
        existing: commodityModel.value.value,
      };
    }

    loading.value = true;
    const intake = await createIntake({
      department_id: departmentId.value,
      vendor,
      commodity,
    });
    if (intake) {
      setAlert({
        type: "success",
        title: "Pengajuan barang berhasil!",
        message: "Silahkan tunggu konfirmasi dari user",
      });
      exit(`/${departmentId.value}/intakes/create/${intake.id}`);
      loading.value = false;
    } else {
      setAlert({
        type: "error",
        title: "Gagal membuat pengajuan barang",
        message: "Silahkan coba lagi.",
      });
      loading.value = false;
    }
  };

  const exit = (path: string = "/workspaces") => {
    timeline.value.vars.onReverseComplete = () => {
      router.push(path);
    };
    timeline.value.reverse();
  };

  onMounted(async () => {
    await getCategories();
    await getCommodities();
    await getVendors();

    commodityCategoryOptions.value = categories.value.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    commodityOptions.value = commodities.value.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    vendorOptions.value = vendors.value.map((a) => ({
      label: a.name,
      value: a.id,
    }));

    if (!gdPanel.value) return;

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        console.log("Timeline started");
      },
      onComplete: () => {
        console.log("Timeline completed");
      },
    });

    if (view.value !== "small") {
      tl.to(gdPanel.value, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.inOut",
      });
      console.log("gdPanel", gdPanel.value);
    } else {
      tl.to(gdPanel.value, {
        y: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    }

    timeline.value = tl;
    timeline.value.play();
  });
</script>

<style lang="scss" scoped>
  .gd {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background-depth-two-color);
    display: flex;
    justify-content: center;
    align-items: center;
    &-panel {
      position: absolute;
      width: 18rem;
      max-height: 80svh;
      background: var(--background-depth-one-color);
      border-radius: 1rem;
      padding: 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transform: scale(0.95);
      opacity: 0;
      overflow-y: auto;
      &-logo {
        position: relative;
        height: 1.5rem;
        display: flex;
        svg {
          width: 100%;
          height: 100%;
        }
      }
      &-form {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        &-header {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.25rem;
          &-title {
            position: relative;
            text-align: center;
          }
          &-subtitle {
            position: relative;
            text-align: center;
            color: var(--font-secondary-color);
          }
        }
        &-body {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          &-group {
            position: relative;
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.75rem;
            border: var(--border);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            &-input {
              position: relative;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-end;
              gap: 0.5rem;
            }
            &-message {
              position: relative;
              color: var(--font-secondary-color);
              &-link {
                cursor: pointer;
                color: var(--primary-color);
                opacity: 0.8;
                &:hover {
                  opacity: 1;
                }
              }
            }
          }
          &-button {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        &-footer {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          &-text {
            position: relative;
            text-align: center;
            color: var(--font-secondary-color);
            &-link {
              cursor: pointer;
              color: var(--primary-color);
              opacity: 0.8;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
    @media only screen and (max-width: 1024px) {
      &-panel {
        top: auto;
        bottom: 0;
        left: 0;
        width: 100vw;
        transform: translateY(150%);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        background: var(--background-depth-one-color);
      }
    }
  }
</style>
