<template>
  <div class="card">
    <div class="card-content">
      <h4>Info</h4>
      <h4>BTS - {{ title }}</h4>
      <p><strong>Daerah </strong>: {{ city }}</p>

      <p>Lokasi saat ini dengan BTS {{ title }} {{ distance }} km</p>
      <div class="list-item">
        <p class="status">Jarak BTS dengan lokasi:</p>
        <v-chip class="chip" :color="statusColor">{{ status }}</v-chip>
      </div>
      <p>Total Layanan :{{ capacity }} Mb</p>
      <p>Layanan Terpakai :{{ usedCapacity }} Mb</p>
      <p>Sisa Layanan : {{ diff }} Mb</p>
      <p>Jumlah Pelanggan : {{ customer }}</p>
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
  capacity: Number,
  usedCapacity: Number,
  customer: Number,
  diff: Number,
});
</script>
<style scoped>
/* Card Styles */
.card {
  margin-top: 10px;
  background-color: #fdfdfd;
  width: 240px;
  padding: 15px;
}
.status {
  margin-right: 5px;
  padding-top: 6px;
}
.list-item {
  display: flex;
  flex-direction: row;
}

h4,
p {
  margin-bottom: 15px;
}
</style>
