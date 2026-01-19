<script setup>
import Box from './components/Box.vue'
import ClickAction from './components/ClickAction.vue'
import { ref } from 'vue'

const text = ref('Sigma')
const wackyMode = ref(false)

const toggleText = () => {
  text.value = text.value == 'Sigma' ? 'Alpha' : 'Sigma'
}

const toggleWacky = () => {
  wackyMode.value = !wackyMode.value
}
</script>

<template>
  <div>
    <div class="box-container">
      <!--Top Left Box-->
      <Box :content="text" />

      <!--Top Right Box-->
      <Box id="curved-box" />

      <!--Bottom Left Box-->
      <Box>
        <img src="./mcgregor_crest_coat_of_arms.png" class="spinning" />
      </Box>

      <!--Bottom Right Box-->
      <Box>
        <ClickAction :wackyMode="wackyMode" @toggle-text="toggleText" @toggle-wacky="toggleWacky" />
      </Box>
    </div>
  </div>
</template>

<style scoped>
.box-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: calc(100vh - 20px);
  gap: 10px;
}

#curved-box {
  border-radius: 0 100% 0 0;
}

.spinning {
  animation: spin 15s ease-in-out infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
