<script setup>
const props = defineProps({
  showResults: Boolean
})

const book = defineModel()
</script>

<template>
  <div>
    <div class="form">
      <div class="header"><h1>Book Record</h1></div>

        <label>Title</label>
        <input v-model.trim="book.title" />
        <span v-if="showResults && !book.title" class="required">Required</span>

        <label>Author</label>
        <input v-model.trim="book.author" />
        <span v-if="showResults && !book.author" class="required">Required</span>

        <label>Genre</label>
        <select v-model="book.genre">
          <option disabled value="">Select Genre</option>
          <option>Fiction</option>
          <option>Non-fiction</option>
          <option>Fantasy</option>
          <option>Thriller</option>
          <option>Horror</option>
          <option>Philosophy</option>
          <option>Biography</option>
          <option>Romance</option>
          <option>Fantasy</option>
          <option>Adventure</option>
        </select>
        <span v-if="showResults && !book.genre" class="required">Required</span>

        <label>Date Published</label>
        <input type="date" v-model="book.published" />
        <span v-if="showResults && !book.published" class="required">Required</span>

        <label>Description</label>
        <textarea v-model.trim="book.description"></textarea>
        <span v-if="showResults && !book.description" class="required">Required</span>
        <br><br>

        <button @click="$emit('validate')">Validate</button>
    </div>
  </div>
</template>

<style scoped>
.form {
  display: block;
  width: 425px;
  height: 700px;
  overflow-y: scroll;
  overflow-wrap: break-word;
  padding: 20px;
  background: #ffffff;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Avenir', system-ui;
}

.required {
  color: #dc2626;
  font-size: 0.90em;
}

label {
  display: block;
  margin-top: 20px;
  font-weight: bold;
}

input {
  cursor:text;
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}

select {
  cursor: pointer;
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}

textarea {
  min-height: 75px;
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  box-sizing: border-box;
}

button {
  display: block;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
  width: 52%;
  padding-top: 15px;
  padding-bottom: 15px;
  background: #0849b9;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.20em;
}
</style>