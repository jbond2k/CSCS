<script setup>
defineProps({
  wackyMode: Boolean,
})
</script>

<template>
  <div :class="wackyMode ? 'wacky' : null">
        <div
        class="triangle-upward"
        @click="$emit('toggle-text')"
        >
        <span class="triangle-font">A</span>
        </div>

        <div
        class="triangle-downward"
        @click="$emit('toggle-wacky')"
        >
        <span class="triangle-font">B</span>
        </div>
  </div>
</template>

<style scoped>
.triangle-font {
  font-family: Arial, Helvetica, sans-serif;
  color: white;
  font-size: 20px;
}

.triangle-upward {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: 100px;
  height: 100px;
  background: #dc143c;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transition: transform .15s ease, box-shadow .15s ease;
}

.triangle-downward {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: 100px;
  height: 100px;
  background: #dc143c;
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  position: relative;
  transition: transform .15s ease, box-shadow .15s ease;
}

.triangle-upward:active {
  transform: scale(95%);
  box-shadow: inset 0 -4px 8px #0006;
}

.triangle-downward:active {
  transform: scale(95%);
  box-shadow: inset 0 4px 8px #0006;
}

.wacky {
  animation: pulse 3s ease-in-out infinite alternate;
}
@keyframes pulse {
    from {
        filter: hue-rotate(0deg) saturate(1.5);
    }
    to {
        filter: hue-rotate(360deg) saturate(3);
    }
}
</style>