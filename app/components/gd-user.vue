<template>
  <div class="gd-user">
    <div class="gd-user-information">
      <span class="gd-user-information-name gd-headline-5">{{
        user.name
      }}</span>
      <span class="gd-user-information-detail gd-body-5">{{
        `${userRole}${departmentName}`
      }}</span>
    </div>
    <div class="gd-user-action">
      <gd-button-icon
        icon="pencil"
        type="secondary"
        @click="emits('select')"
        :borderless="true"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { DepartmentResponse } from "~/types/department";
  import type { UserResponse, UserRole } from "~/types/user";

  const { departments, getDepartment } = useDepartment();
  const props = defineProps<{
    user: UserResponse;
  }>();
  const emits = defineEmits<{
    (e: "delete"): void;
    (e: "select"): void;
  }>();

  const department = ref<DepartmentResponse | null>(null);

  const userRole = computed(() => {
    return props.user.role === "admin" ? "Administrator" : "Supervisor";
  });
  const departmentName = computed(() => {
    if (props.user.role === "admin") return "";

    return (
      " — " + (department.value ? department.value.name : props.user.role.user)
    );
  });

  onMounted(async () => {
    const role: UserRole = props.user.role;
    if (role === "admin") return;
    const index = departments.value.findIndex((dept) => dept.id === role.user);

    if (departments.value[index]) {
      department.value = departments.value[index];
    } else {
      department.value = await getDepartment(role.user);
    }
  });
</script>

<style lang="scss" scoped>
  .gd-user {
    position: relative;
    width: 100%;
    border-radius: 0.5rem;
    border: var(--border);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    &-information {
      position: relative;
      width: 100%;
      padding: 0.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      &-detail {
        color: var(--font-secondary-color);
      }
    }
    &-action {
      position: absolute;
      right: 0.5rem;
    }
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
