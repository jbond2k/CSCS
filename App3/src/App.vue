<script setup>
import { ref, computed } from 'vue'
import BookForm from './components/BookForm.vue'
import BookPreview from './components/BookPreview.vue'
import Book from './models/Book'

const book = ref(new Book())

const showResults = ref(false)

const isValid = computed(() => 
  Object.values(book.value).every(v => v != null && v.toString() !== ''))

function validate() {
  showResults.value = true
}
</script>

<template>
  <div>
    <div class="app-container">
      <BookForm
        v-model="book"
        :showResults="showResults"
        @validate="validate"
      />

      <BookPreview
        v-model="book"
        :isValid="isValid"
        :showResults="showResults"
      />
    </div>
  </div>
</template>

<style>
.app-container {
  display: flex;
  gap: 50px;
  padding: 50px;
  align-items: center;
  justify-content: center;
}

body {
  font-family: 'Helvetica', system-ui;
  background: #edf2f4;
  font-size: 1.10em;
}
</style>