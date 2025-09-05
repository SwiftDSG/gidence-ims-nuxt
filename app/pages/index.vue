<template>
  <div class="gd">
    <div class="gd-panel" ref="gdPanel">
      <div class="gd-panel-header">
        <button
          class="gd-panel-header-item"
          :class="{ 'gd-panel-header-item-active': tab === 'department' }"
          @click="tab = 'department'"
        >
          <div class="gd-panel-header-item-icon">
            <gd-svg
              name="building"
              :color="tab === 'department' ? 'primary' : 'secondary'"
            />
          </div>
          <span class="gd-panel-header-item-name gd-headline-5"
            >Departemen</span
          >
        </button>
        <button
          class="gd-panel-header-item"
          :class="{ 'gd-panel-header-item-active': tab === 'user' }"
          @click="tab = 'user'"
        >
          <div class="gd-panel-header-item-icon">
            <gd-svg
              name="account"
              :color="tab === 'user' ? 'primary' : 'secondary'"
            />
          </div>
          <span class="gd-panel-header-item-name gd-headline-5">Pengguna</span>
        </button>
      </div>
      <div class="gd-panel-body">
        <div class="gd-panel-body-logo">
          <img src="/logotype.svg" />
        </div>
        <form
          v-if="tab === 'department'"
          class="gd-panel-body-form"
          @keypress.enter.prevent="departmentSubmit"
        >
          <div class="gd-panel-body-form-header">
            <h1 class="gd-panel-body-form-header-title gd-headline-2">
              Daftar Departemen
            </h1>
            <p class="gd-panel-body-form-header-subtitle gd-body-4">
              Lihat atau ubah departemen yang sudah terdaftar
            </p>
          </div>
          <div class="gd-panel-body-form-body">
            <gd-department
              v-for="department in departments"
              :key="department.id"
              :department="department"
            />
            <div class="gd-panel-body-form-body-input">
              <gd-input-text
                v-model="departmentName"
                label="Buat departemen baru"
                placeholder="Engineering"
              />
              <gd-button-icon
                icon="plus"
                type="primary"
                :disabled="loading"
                @click="departmentSubmit"
              />
            </div>
          </div>
        </form>
        <div v-else class="gd-panel-body-form">
          <div class="gd-panel-body-form-header">
            <h1 class="gd-panel-body-form-header-title gd-headline-2">
              Daftar Pengguna
            </h1>
            <p class="gd-panel-body-form-header-subtitle gd-body-4">
              Lihat atau ubah pengguna yang sudah terdaftar
            </p>
          </div>
          <div class="gd-panel-body-form-body">
            <gd-user
              v-for="user in users"
              :key="user.id"
              :user="user"
              @select="
                userSelected = user;
                userVisible = true;
              "
            />
            <gd-button
              icon="plus"
              text="Tambah pengguna"
              type="primary"
              :disabled="loading"
              @click="userVisible = true"
            />
          </div>
        </div>
      </div>
    </div>
    <gd-modal
      :visible="userVisible"
      @close="
        userVisible = false;
        userSelected = null;
      "
      :name="userSelected ? 'Ubah user' : 'Buat user'"
    >
      <form class="gd-user-modal" @keypress.enter.prevent="userSubmit">
        <gd-input-text
          v-model="userName"
          label="Nama lengkap"
          placeholder="John Doe"
        />
        <gd-input-text
          v-model="userUsername"
          label="Nama pengguna"
          placeholder="johndoe"
        />
        <gd-input-text
          v-model="userPassword"
          label="Password"
          type="password"
          placeholder="Masukkan password"
        />
        <gd-input-text-select
          v-model="departmentModel"
          :options="departmentOptions"
          label="Departemen"
          placeholder="Pilih departemen"
        />
        <div class="gd-user-modal-submit">
          <gd-button
            text="Simpan"
            type="primary"
            :disabled="loading"
            @click="userSubmit"
          />
        </div>
      </form>
    </gd-modal>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";
  import type { UserRequest, UserResponse } from "~/types/user";

  const { view } = useMain();
  const { setAlert } = useAlert();
  const { departments, getDepartments, createDepartment } = useDepartment();
  const { users, getUsers, createUser, updateUser } = useUser();

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
  const tab = ref<"department" | "user">("department");

  const departmentName = ref<string>("");
  const departmentOptions = ref<{ label: string; value: string }[]>([]);
  const departmentModel = ref<{ label: string; value: string }>({
    label: "",
    value: "",
  });

  const userName = ref<string>("");
  const userUsername = ref<string>("");
  const userPassword = ref<string>("");
  const userVisible = ref<boolean>(false);
  const userSelected = ref<UserResponse | null>(null);

  const departmentSubmit = async () => {
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
  const userSubmit = async () => {
    loading.value = true;
    const payload: UserRequest = {
      name: userName.value,
      username: userUsername.value,
      password: userPassword.value,
      role: {
        user: departmentModel.value.value,
      },
    };

    if (userSelected.value) {
      const user = await updateUser(userSelected.value.id, payload);
      if (user) {
        userVisible.value = false;
        userSelected.value = null;

        userName.value = "";
        userUsername.value = "";
        userPassword.value = "";
        departmentModel.value = { label: "", value: "" };

        const index = users.value.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          users.value[index] = user;
        }
      }
    } else {
      const user = await createUser(payload);
      if (user) {
        userVisible.value = false;

        userName.value = "";
        userUsername.value = "";
        userPassword.value = "";
        departmentModel.value = { label: "", value: "" };

        users.value.push(user);
      }
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

  watch(
    () => userVisible.value,
    (val) => {
      if (val && userSelected.value) {
        userName.value = userSelected.value.name;
        userUsername.value = userSelected.value.username;

        const role = userSelected.value.role;
        if (role !== "admin") {
          const department = departments.value.find(
            (dept) => dept.id === role.user
          );
          departmentModel.value = {
            label: department?.name || role.user,
            value: role.user,
          };
        }
      } else {
        userName.value = "";
        userUsername.value = "";
        userPassword.value = "";
        departmentModel.value = { label: "", value: "" };
      }
    }
  );

  onMounted(async () => {
    await getDepartments();
    await getUsers();

    departmentOptions.value = departments.value.map((dept) => ({
      label: dept.name,
      value: dept.id,
    }));

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
      border: var(--border);
      border-radius: 1rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      transform: scale(0.95);
      opacity: 0;
      overflow-y: auto;
      &-header {
        position: relative;
        width: 100%;
        height: 2rem;
        border-bottom: var(--border);
        box-sizing: border-box;
        display: flex;
        &-item {
          cursor: pointer;
          position: relative;
          width: 50%;
          height: 100%;
          border: none;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          background-color: var(--background-depth-one-color);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.375rem;
          transition: 0.25s background-color ease-in-out;
          &-icon {
            position: relative;
            width: 1rem;
            height: 1rem;
          }
          &:first-child {
            border-right: 0.5px solid var(--border-color);
          }
          &:last-child {
            border-left: 0.5px solid var(--border-color);
          }
          &:hover {
            background: var(--background-depth-two-color);
          }
          &:active {
            background: var(--background-depth-three-color);
          }
          &.gd-panel-header-item-active {
            .gd-panel-header-item-name {
              color: var(--primary-color);
            }
          }
        }
      }
      &-body {
        position: relative;
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 1rem;
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

<style lang="scss">
  .gd-user-modal {
    position: relative;
    width: 20vw;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    &-submit {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
