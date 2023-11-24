<template>
  <div class="card elevation-1">
    <h4>{{ title }}</h4>
    <div class="counter">
      <slot></slot>
      <h3>{{ counter }}</h3>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: String,
  counter: Number,
});
</script>
<style scoped>
.card {
  padding: 15px;
  width: 200px;
  min-height: 80px;
  border-radius: 10px;
  margin-right: 20px;
}
h3 {
  text-align: center;
}
h4 {
  margin-bottom: 5px;
}
.counter {
  /* margin-top: 10px; */
  display: flex;
  flex-direction: row;
}
.counter h3 {
  margin-left: 15px;
}
</style>
