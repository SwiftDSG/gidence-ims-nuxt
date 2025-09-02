<template>
  <div class="gd-department">
    <input
      type="text"
      class="gd-department-name gd-headline-5"
      ref="gdDepartmentName"
      v-model="departmentName"
      @blur="departmentUpdate"
    />
    <div class="gd-department-action">
      <gd-button-icon
        icon="link"
        type="secondary"
        @click="() => router.push(`/${department.id}`)"
        :borderless="true"
      />
    </div>
    <div class="gd-department-action">
      <gd-popover :visible="popoverVisible" @close="popoverVisible = false">
        <template #trigger>
          <gd-button-icon
            icon="ellipsis"
            type="secondary"
            @click="popoverVisible = true"
            :borderless="true"
          />
        </template>
        <template #content>
          <gd-button-menu
            icon="pencil"
            text="Ubah"
            type="primary"
            @click="gdDepartmentName?.focus()"
          />
          <gd-button-menu
            icon="close"
            text="Hapus"
            type="error"
            @click="departmentDelete"
          />
        </template>
      </gd-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { DepartmentResponse } from "~/types/department";

  const { updateDepartment, deleteDepartment } = useDepartment();
  const { setAlert } = useAlert();
  const router = useRouter();
  const props = defineProps<{
    department: DepartmentResponse;
  }>();

  const gdDepartmentName = ref<HTMLInputElement>();

  const popoverVisible = ref(false);

  const departmentName = ref(props.department.name);

  const departmentUpdate = async () => {
    if (departmentName.value.trim() === "") {
      departmentName.value = props.department.name;
      return;
    }
    await updateDepartment(props.department.id, { name: departmentName.value });
  };
  const departmentDelete = async () => {
    if (await deleteDepartment(props.department.id)) {
      setAlert({
        type: "success",
        title: "Departemen berhasil dihapus",
        message: `${props.department.name} telah berhasil dihapus.`,
      });
    } else {
      setAlert({
        type: "error",
        title: "Gagal menghapus departemen",
        message: `Terjadi kesalahan saat menghapus departemen ${props.department.name}.`,
      });
    }
  };
</script>

<style lang="scss" scoped>
  .gd-department {
    position: relative;
    width: 100%;
    height: 2rem;
    border-radius: 0.5rem;
    border: var(--border);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &-name {
      pointer-events: none;
      position: absolute;
      left: 0.5rem;
      border: none;
      background-color: transparent;
      &:focus {
        outline: none;
      }
    }
  }
</style>
