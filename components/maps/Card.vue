<template>
  <div class="card">
    <div class="card-content">
      <h4>Info</h4>
      <h4>BTS - {{ title }}</h4>
      <p><strong>Daerah </strong>: {{ city }}</p>
      <!-- <p><blockquote></p> -->
      <p>Lokasi saat ini dengan BTS - {{ title }} {{ distance }} km</p>
      <p class="status">Status BTS berdasarkan jarak:</p>
      <v-chip :color="statusColor">{{ status }}</v-chip>
    </div>
  </div>
</template>
<script setup>
// const good = ref('#00dd2c');
// const ok = ref('#f7da02');
// const bad = ref('#ef1404');
defineProps({
  title: String,
  city: String,
  statusColor: String,
  status: String,
  distance: Number,
});
</script>
<style scoped>
/* Card Styles */
.card {
  margin-top: 10px;
  background-color: #fdfdfd;
  width: 300px;
  padding: 15px;
}
.status {
  margin-bottom: 5px;
}
h4,
p {
  margin-bottom: 10px;
}
</style>
