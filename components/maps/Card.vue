<template>
  <div class="card">
    <div class="card-content">
      <h4>Keterangan</h4>
      <h4>BTS - {{ title }}</h4>
      <p>Daerah {{ city }}</p>
      <p>Lokasi saat ini dengan BTS - {{ title }} {{ distance }} km</p>
    </div>
  </div>
  <!-- <v-card class="card">
    <v-card-text>BTS - {{ title }}</v-card-text>
    <v-card-text>Daerah {{ city }}</v-card-text>
    <v-card-text>Jarak saat ini ke lokasi {{ distance }} km</v-card-text>
  </v-card> -->
</template>
<script>
export default {
  props: {
    title: String,
    city: String,
    distance: Number,
  },
};
</script>
<style scoped>
/* Card Styles */
.card {
  margin-top: 10px;
  background-color: #fdfdfd;
  width: 300px;
  padding: 15px;
  cursor: pointer;
}
h4,
p {
  margin-bottom: 10px;
}
</style>
