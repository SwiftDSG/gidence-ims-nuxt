<template>
  <tr class="gd-row">
    <td class="gd-row-data gd-headline-5">
      {{
        props.verification.decision === "decommissioned"
          ? "Dekomisi"
          : "Operasional"
      }}
    </td>
    <td class="gd-row-data gd-headline-5">
      {{ props.verification.user_name }}
    </td>
    <td class="gd-row-data gd-headline-5">
      {{ getDateString(props.verification.create_date) }}
    </td>
    <td class="gd-row-data gd-headline-5">
      {{
        props.verification.decision !== "decommissioned"
          ? getDateString(
              props.verification.create_date +
                props.verification.decision.operational * 86400000
            )
          : "-"
      }}
    </td>
  </tr>
</template>

<script lang="ts" setup>
  import type { VerificationResponse } from "~/types/verification";

  const props = defineProps<{
    verification: VerificationResponse;
  }>();

  const getDateString = (x: string | number) => {
    const date = new Date(x);

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };
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
