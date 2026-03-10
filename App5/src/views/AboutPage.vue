<template>
  <div class="about-view view">
    <h1>About Our App ...</h1>
  </div>
</template>

<style scoped>
.about-view{
    box-sizing: border-box;
    padding: 20px;
    opacity: 97%;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #efeded;
}

.view {
  position: relative;
}

.view::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background-image: url("../assets/starfish.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: grayscale(100%);
  opacity: .05;
}
</style>