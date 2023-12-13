<template>
  <h1>Dashboard</h1>
  <div class="card-container">
    <Card title="Jumlah BTS Saat ini" :counter="BTSCount">
      <BroadcastIcon></BroadcastIcon>
    </Card>
  </div>
</template>
<script setup>
import { BroadcastIcon } from 'vue-tabler-icons';
// import ProductsCard from '@/components/dashboard/ProductCards.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted } from 'vue';
import Card from '@/components/dashboard/Card.vue';
const auth = getAuth();
const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts');
// const snapshot = await getDocs(btsCollection);
const BTSCount = ref();

const fetchDataBTS = async () => {
  const { size } = await useFetchData(btsCollection);
  BTSCount.value = size;
};
let user = null;
onMounted(() => {
  useStateChange(user);
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
