<script setup>
const props = defineProps({
  content: {
    type: String,
  },
})
</script>

<template>
  <div class="box">
    <div v-if="content" class="word-font">
      {{ content }}
    </div>
    <slot />
  </div>
</template>

<style scoped>
.box {
  display: flex;
  margin: 0;
  width: 100%;
  background-color: #dcdcdc;
  justify-content: center;
  align-items: center;
}

.word-font {
  font-family: 'Exile', system-ui;
  font-weight: 400;
  font-style: normal;
  font-size: 64px;
}
</style>
