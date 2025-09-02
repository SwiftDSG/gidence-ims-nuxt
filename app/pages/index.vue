<template>
  <div class="gd">
    <div class="gd-panel" ref="gdPanel">
      <div class="gd-panel-logo">
        <img src="/logotype.svg" />
      </div>
      <form class="gd-panel-form" @keypress.enter.prevent="submit">
        <div class="gd-panel-form-header">
          <h1 class="gd-panel-form-header-title gd-headline-2">
            Daftar Departemen
          </h1>
          <p class="gd-panel-form-header-subtitle gd-body-4">
            Lihat atau ubah departemen yang sudah terdaftar
          </p>
        </div>
        <div class="gd-panel-form-body">
          <gd-department
            v-for="department in departments"
            :key="department.id"
            :department="department"
          />
          <div class="gd-panel-form-body-input">
            <gd-input-text
              :value="departmentName"
              label="Buat departemen baru"
              placeholder="Engineering"
              @change="(val) => (departmentName = val)"
            />
            <gd-button-icon
              icon="plus"
              type="primary"
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

  const { view } = useMain();
  const { setAlert } = useAlert();
  const { departments, getDepartments, createDepartment } = useDepartment();

  const router = useRouter();
  const route = useRoute();

  const emits = defineEmits<{
    (e: "shake"): void;
  }>();

  definePageMeta({
    layout: "auth",
    middleware: "admin",
  });

  const gdPanel = ref<HTMLDivElement>();

  const timeline = ref<GSAPTimeline>(
    gsap.timeline({
      paused: true,
    })
  );
  const loading = ref<boolean>(false);

  const departmentName = ref<string>("");

  const submit = async () => {
    loading.value = true;
    const department = await createDepartment({ name: departmentName.value });
    loading.value = false;
    if (department) {
      departmentName.value = "";
      setAlert({
        type: "success",
        title: "Departemen berhasil dibuat",
        message: `${department.name} telah berhasil dibuat.`,
      });
    } else {
      setAlert({
        type: "error",
        title: "Gagal membuat departemen",
        message: "Terjadi kesalahan, silahkan coba lagi.",
      });
    }
  };

  const exit = (path: string = "/workspaces") => {
    timeline.value.vars.onReverseComplete = () => {
      console.log("Exiting animation completed");
      router.push(path);
    };
    timeline.value.reverse();
    console.log("Exiting to", path);
  };

  onMounted(async () => {
    await getDepartments();
    if (!gdPanel.value) return;

    const tl = gsap.timeline({
      paused: true,
    });

    if (view.value !== "small") {
      tl.to(gdPanel.value, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.inOut",
      });
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
          gap: 0.5rem;
          &-input {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 0.5rem;
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
