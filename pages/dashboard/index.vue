<template>
  <h1>Dashboard</h1>
  <div class="card-container">
    <Card title="Jumlah BTS Saat ini" :counter="BTSCount">
      <BroadcastIcon></BroadcastIcon>
    </Card>
  </div>
</template>
<script setup>
import {
  BroadcastIcon,
  LayoutDashboardIcon,
  LoginIcon,
} from 'vue-tabler-icons';
// import ProductsCard from '@/components/dashboard/ProductCards.vue'
import { collection, getDocs } from 'firebase/firestore';
import { onMounted } from 'vue';
import Card from '@/components/dashboard/Card.vue';
import fetchData from '@/server/fetchData';

const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts');
// const snapshot = await getDocs(btsCollection);
const BTSCount = ref();

const fetchDataBTS = async () => {
  const { size } = await fetchData(btsCollection);
  BTSCount.value = size;
};
onMounted(() => {
  fetchDataBTS();
});
</script>
<style scoped>
.card-container {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
}
</style>
