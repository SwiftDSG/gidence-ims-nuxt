<template>
  <client-only>
    <div class="gd" :data-view="view">
      <nav
        class="gd-navigation"
        :class="navigation === 'collapsed' ? 'gd-navigation-collapsed' : ''"
      >
        <div class="gd-navigation-logo">
          <img
            :src="
              navigation === 'collapsed' ? '/logogram.svg' : '/logotype.svg'
            "
          />
        </div>
        <div class="gd-navigation-links">
          <a
            v-for="link in links"
            :key="link.href"
            :href="`${link.blank ? link.href : `${departmentId}${link.href}`}`"
            :target="link.blank ? '_blank' : '_self'"
            :rel="link.blank ? 'noopener noreferrer' : ''"
            :class="
              currentRoute === link.href
                ? 'gd-navigation-links-item-active'
                : ''
            "
            class="gd-navigation-links-item"
            @click.prevent="
              router.push(
                `${link.blank ? link.href : `${departmentId}${link.href}`}`
              )
            "
          >
            <div class="gd-navigation-links-item-icon">
              <gd-svg
                :name="link.icon"
                :color="currentRoute === link.href ? 'primary' : 'secondary'"
              />
            </div>
            <span
              class="gd-navigation-links-item-name"
              :class="view === 'small' ? 'gd-headline-6' : 'gd-headline-5'"
              :data-text="link.name"
            >
              {{ link.name }}
            </span>
            <div
              v-if="link.blank && view !== 'small'"
              class="gd-navigation-links-item-blank"
            >
              <gd-svg name="link" color="secondary" />
            </div>
          </a>
        </div>
        <div class="gd-navigation-footer">
          <gd-button-icon icon="exit" type="secondary" @click="exit" />
          <gd-button-icon
            :icon="navigation === 'collapsed' ? 'panel-open' : 'panel-close'"
            type="secondary"
            @click="
              navigation = navigation === 'collapsed' ? 'expanded' : 'collapsed'
            "
          />
        </div>
      </nav>
      <main class="gd-main">
        <nuxt-page />
      </main>
    </div>
    <gd-alert />
  </client-only>
</template>

<script lang="ts" setup>
  import "~/assets/styles/global.scss";

  type Link = {
    name: string;
    icon: string;
    href: string;
    blank?: boolean;
  };

  const router = useRouter();
  const route = useRoute();

  const { view, rem, theme, navigation } = useMain();
  const { loadPrinterConfig } = usePrinter();
  const { logout } = useUser();

  const links = ref<Link[]>([
    {
      name: "Dashboard",
      icon: "dashboard",
      href: "/",
    },
    {
      name: "Komoditas",
      icon: "shapes",
      href: "/commodities",
    },
    {
      name: "Pengajuan",
      icon: "message",
      href: "/intakes",
    },
    // {
    //   name: "Vendor",
    //   icon: "shapes",
    //   href: "/vendors",
    // },
  ]);

  const currentRoute = computed(() => {
    const paths = route.path.split("/");
    return `/${paths[2] || ""}`;
  });
  const departmentId = computed(() => {
    return route.params.department_id ? `/${route.params.department_id}` : "";
  });

  const resizeHandler = (): void => {
    if (window.innerWidth > 1280) view.value = "large";
    else if (window.innerWidth > 768) view.value = "medium";
    else view.value = "small";

    rem.value = parseInt(getComputedStyle?.(document.body)?.fontSize) || 24;
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  };
  const exit = () => {
    logout();
    router.push("/auth");
  };

  watch(
    () => theme.value,
    (newTheme) => {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  );

  onBeforeMount(() => {
    localStorage.setItem("theme", theme.value);
  });
  onMounted(() => {
    loadPrinterConfig();
    resizeHandler();

    window.addEventListener("resize", resizeHandler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });
</script>

<style lang="scss" scoped>
  .gd {
    position: relative;
    width: 100vw;
    display: flex;
    &-navigation {
      z-index: 1;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 20vw;
      background-color: var(--background-depth-two-color);
      border-right: var(--border);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      &-logo {
        position: relative;
        height: 3rem;
        padding: 0.5rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          position: relative;
          height: 100%;
          object-fit: contain;
        }
      }
      &-links {
        position: relative;
        width: 100%;
        height: calc(100% - 2rem);
        padding: 0 0.5rem 0.5rem 0.5rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        &-item {
          cursor: pointer;
          position: relative;
          width: 100%;
          height: 2rem;
          padding: 0 0.5rem;
          border-radius: 0.5rem;
          border: var(--border);
          box-sizing: border-box;
          border-color: transparent;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--font-primary-color);
          transition: 0.25s border-color, 0.25s background-color;
          * {
            pointer-events: none;
          }
          &-icon {
            position: absolute;
            top: 0;
            left: 0;
            width: calc(2rem - 2px);
            height: calc(2rem - 2px);
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.5;
            transition: 0.25s opacity;
          }
          &-name {
            position: absolute;
            left: 2rem;
            opacity: 0.5;
            transition: 0.25s opacity;
            white-space: nowrap;
          }
          &-blank {
            position: absolute;
            right: 0.5rem;
            width: 0.75rem;
            height: 0.75rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-7.5%);
            opacity: 0.5;
            transition: 0.25s opacity;
          }
          &.gd-navigation-links-item-active {
            border-color: var(--border-color);
            background-color: var(--background-depth-one-color);
            .gd-navigation-links-item-icon {
              opacity: 1;
            }
            .gd-navigation-links-item-name {
              opacity: 1;
            }
            .gd-navigation-links-item-blank {
              opacity: 1;
            }
          }
          &:hover {
            background-color: var(--background-depth-one-color);
            .gd-navigation-links-item-icon {
              opacity: 1;
            }
            .gd-navigation-links-item-name {
              opacity: 1;
            }
            .gd-navigation-links-item-blank {
              opacity: 1;
            }
          }
        }
      }
      &-footer {
        position: relative;
        width: 100%;
        height: 3rem;
        padding: 0.5rem;
        border-top: var(--border);
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        &-item {
          cursor: pointer;
          position: relative;
          width: 100%;
          height: 2rem;
          padding: 0 0.5rem;
          border-radius: 0.5rem;
          background-color: var(--background-depth-one-color);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: 0.25s background-color;
          &-icon {
            position: relative;
            width: 0.85rem;
            height: 0.85rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &:hover {
            background-color: var(--background-depth-three-color);
          }
        }
      }
      &.gd-navigation-collapsed {
        width: 3rem;
        .gd-navigation-links {
          height: calc(100% - 5.5rem);
          &-item {
            &-name {
              left: 2.25rem;
              transition: none;
              display: flex;
              align-items: center;
              opacity: 0;
              &::before {
                content: attr(data-text);
                position: absolute;
                left: 0;
                width: 100%;
                height: 2rem;
                padding: 0 0.5rem;
                border-radius: 0.5rem;
                background-color: var(--font-primary-color);
                color: var(--background-depth-one-color);
                display: flex;
                align-items: center;
              }
              &::after {
                content: " ";
                position: absolute;
                top: 50%;
                right: 100%; /* To the left of the tooltip */
                margin-top: -0.25rem;
                border-width: 0.25rem;
                border-style: solid;
                border-color: transparent var(--font-primary-color) transparent
                  transparent;
              }
            }
            &-blank {
              transition: none;
              opacity: 0;
            }
            &:hover {
              .gd-navigation-links-item-name {
                transition: 0.25s opacity;
                opacity: 1;
              }
            }
          }
        }
        .gd-navigation-footer {
          height: 5.5rem;
          flex-direction: column;
          gap: 0.5rem;
        }
        + .gd-main {
          left: 3rem;
          width: calc(100vw - 3rem);
        }
      }
    }
    &-main {
      position: relative;
      width: calc(100vw - 20vw);
      left: 20vw;
      height: 100vh;
    }
    &[data-view="small"] {
      .gd-navigation {
        z-index: 3;
        top: auto;
        width: 100vw;
        height: 3rem;
        border-top: var(--border);
        flex-direction: row;
        &-logo {
          display: none;
        }
        &-links {
          width: 100%;
          height: 100%;
          padding: 0.5rem;
          flex-direction: row;
          justify-content: space-between;
          &-item {
            width: auto;
            padding: 0;
            &-icon {
              position: relative;
            }
            &-name {
              position: relative;
              left: auto;
              padding-right: 0.5rem;
              display: none;
            }
            &.gd-navigation-links-item-active {
              border-color: var(--border-color);
              background-color: var(--background-depth-one-color);
              .gd-navigation-links-item-icon {
                opacity: 1;
              }
              .gd-navigation-links-item-name {
                opacity: 1;
                display: flex;
              }
            }
          }
        }
        &-footer {
          display: none;
        }
        &.gd-navigation-collapsed {
          width: 100%;
          .gd-navigation-links {
            height: 100%;
            &-item {
              &-name {
                left: 0;
              }
            }
          }
        }
      }
      .gd-main {
        left: 0;
        width: 100vw;
        height: auto;
      }
    }
  }
</style>
