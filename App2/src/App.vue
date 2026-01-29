<script setup>
import { reactive, onMounted } from 'vue'
import GridLayout from './components/GridLayout.vue'
import imga from './assets/imga.jpg'
import imgb from './assets/imgb.jpg'
import imgc from './assets/imgc.jpg'
import imgd from './assets/imgd.jpg'
import imge from './assets/imge.jpg'
import imgf from './assets/imgf.jpg'
import imgg from './assets/imgg.jpg'

const slots = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

const correctImages = {
  a: imga,
  b: imgb,
  c: imgc,
  d: imgd,
  e: imge,
  f: imgf,
  g: imgg
}

const images = reactive({ correctImages })

function scramble() {
  const scrambledImages = Object.values(correctImages).sort(() => Math.random() - 0.5)

  slots.forEach((slot, i) => {
    images[slot] = scrambledImages[i]
  })
}

onMounted(() => {
  scramble()
})

function identify() {
  for (const image in correctImages) {
    images[image] = correctImages[image]
  }
}
</script>

<template>
  <div>
    <GridLayout>
      <template v-for="slot in slots" :key="slot" v-slot:[slot]>
        <img :src="images[slot]" />
      </template>
    </GridLayout>

    <div class="buttons">
      <button @click="scramble">Scramble</button>
      <button @click="identify">Identify</button>
    </div>
  </div>
</template>

<style scoped>
.buttons {
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  margin-inline: 20px;
  padding: 3px 6px;
  font-size: 20px;
}

img {
  width: 100%;
  height: 100%;
}
</style>