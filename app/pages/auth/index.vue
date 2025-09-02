<template>
  <div class="gd">
    <div class="gd-panel" ref="gdPanel">
      <div class="gd-panel-logo">
        <img src="/logotype.svg" />
      </div>
      <form class="gd-panel-form" @keypress.enter.prevent="submit">
        <div class="gd-panel-form-header">
          <h1 class="gd-panel-form-header-title gd-headline-2">
            Masuk ke U-One
          </h1>
          <p class="gd-panel-form-header-subtitle gd-body-4">
            Silahkan isi data di bawah ini untuk masuk ke sistem.
          </p>
        </div>
        <div class="gd-panel-form-body">
          <div class="gd-panel-form-body-input">
            <gd-input-text
              :value="username"
              placeholder="Username"
              @change="(val) => (username = val)"
            />
          </div>
          <div class="gd-panel-form-body-input">
            <gd-input-text
              :value="password"
              type="password"
              placeholder="Password"
              @change="(val) => (password = val)"
            />
          </div>
          <div class="gd-panel-form-body-button">
            <gd-button
              text="Masuk"
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
  const { login } = useUser();

  const router = useRouter();

  const emits = defineEmits<{
    (e: "shake"): void;
  }>();

  definePageMeta({
    layout: "auth",
    middleware: "no-auth",
  });

  const gdPanel = ref<HTMLDivElement>();

  const timeline = ref<GSAPTimeline>(
    gsap.timeline({
      paused: true,
    })
  );
  const loading = ref<boolean>(false);

  const username = ref<string>("");
  const password = ref<string>("");

  const submit = async () => {
    loading.value = true;
    const user = await login(username.value, password.value);
    loading.value = false;

    if (user) {
      exit("/");
    } else {
      emits("shake");
      setAlert({
        type: "error",
        title: "Gagal masuk ke sistem",
        message: "Silahkan coba kombinasi lain",
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
