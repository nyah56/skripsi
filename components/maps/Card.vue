<template>
  <!-- <div class="card">
    <div class="card-content">
      <h2>{{ title }}</h2>
      <p>{{ jarak }}</p>
    </div>
  </div> -->
  <v-card class="card">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ city }}</v-card-subtitle>
    <v-card-text>{{ distance }}</v-card-text>
  </v-card>
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
  width: 300px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 15px;

  overflow: hidden;
}
.card:hover {
  transform: scale(1.05);
}
.card-content {
  padding: 15px;
}

.card h2 {
  font-size: 15px;
  margin: 0;
}

.card p {
  font-size: 16px;
  margin: 10px 0;
}
</style>
