<script setup>
const props = defineProps({
  showResults: Boolean,
  isValid: Boolean
})

const book = defineModel()
</script>

<template>
  <div>
    <div class="preview">
      <div class="header">
        <h1>Preview</h1>
        <span v-if="isValid && showResults" class="check">✓</span>
      </div>
      <p><strong>Title:</strong> {{ book.title }}</p>
      <p><strong>Author:</strong> {{ book.author }}</p>
      <p><strong>Genre:</strong> {{ book.genre }}</p>
      <p><strong>Published:</strong> {{ book.published }}</p>
      <p><strong>Description:</strong> {{ book.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.preview {
  width: 380px;
  height: 405px;
  overflow-y: scroll;
  overflow-wrap:break-word;
  padding: 20px;
  background: #22223b;
  color: #FFFFFF;
}

.header {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  font-family: 'Avenir', system-ui;
}

.check {
  position: absolute;
  right: -20px;
  font-size: 5.8em;
  color: #0fa717;
  transform: translateY(-15%);
}

p {
  margin-bottom: 25px;
}
</style>