<template>
  <div class="gd-popover" ref="gdPopover">
    <slot name="trigger"></slot>
    <teleport to="#teleports">
      <div
        class="gd-popover-overlay"
        ref="gdPopoverOverlay"
        @click="emits('close')"
      >
        <div class="gd-popover-overlay-content" ref="gdPopoverOverlayContent">
          <slot name="content"></slot>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
  import { gsap } from "gsap";

  const props = defineProps<{
    visible: boolean;
  }>();
  const emits = defineEmits<{
    (e: "close"): void;
  }>();

  const { rem } = useMain();

  const gdPopover = ref<HTMLElement>();
  const gdPopoverOverlay = ref<HTMLElement>();
  const gdPopoverOverlayContent = ref<HTMLElement>();

  watch(
    () => props.visible,
    (val) => {
      if (
        !gdPopover.value ||
        !gdPopoverOverlay.value ||
        !gdPopoverOverlayContent.value
      )
        return;
      if (val) {
        const {
          top: triggerTop,
          left: triggerLeft,
          width: triggerWidth,
          height: triggerHeight,
        } = gdPopover.value.getBoundingClientRect();
        const { width: contentWidth, height: contentHeight } =
          gdPopoverOverlayContent.value.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // The default position should be below the trigger and aligned to the left
        let top = triggerTop + triggerHeight;
        let left = triggerLeft;

        // Check if the content overflows the viewport on the right
        if (left + contentWidth > viewportWidth) {
          // If it does, align it to the right edge of the trigger
          left = triggerLeft + triggerWidth - contentWidth - 0.5 * rem.value;
        } else if (left < 0) {
          // If it goes off the left edge, align it to the left edge of the viewport
          left = 0;
        }
        // Check if the content overflows the viewport on the bottom
        if (top + contentHeight > viewportHeight) {
          // If it does, position it above the trigger
          top = triggerTop - contentHeight;
        } else if (top < 0) {
          // If it goes off the top edge, align it to the top edge of the viewport
          top = 0;
        }

        gsap.set(gdPopoverOverlayContent.value, {
          top: `${top}px`,
          left: `${left}px`,
        });
        gsap.set(gdPopoverOverlay.value, {
          pointerEvents: "auto",
        });

        gsap.to(gdPopoverOverlayContent.value, {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "power2.inOut",
        });
      } else {
        gsap.set(gdPopoverOverlay.value, {
          pointerEvents: "none",
        });
        gsap.to(gdPopoverOverlayContent.value, {
          scale: 0.95,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
        });
      }
    }
  );
</script>

<style lang="scss">
  .gd-popover {
    position: relative;
    width: 100%;
    display: flex;
  }
</style>

<style lang="scss">
  .gd-popover {
    &-overlay {
      z-index: 1000;
      pointer-events: none;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      &-content {
        position: absolute;
        width: 10rem;
        max-height: 10rem;
        padding: 0.25rem;
        border: var(--border);
        border-radius: 0.75rem;
        box-sizing: border-box;
        background-color: var(--background-depth-one-color);
        display: flex;
        flex-direction: column;
        transform: scale(0.95);
        overflow-y: auto;
        opacity: 0;
      }
    }
  }
</style>
