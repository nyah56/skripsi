<template>
  <h1>Dashboard</h1>
  <h3>Data BTS saat ini</h3>
  <h4>{{ BTSCount }}</h4>
</template>
<script setup>
// import ProductsCard from '@/components/dashboard/ProductCards.vue'
import { collection, getDocs } from 'firebase/firestore';
import { onMounted } from 'vue';
const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts');
// const snapshot = await getDocs(btsCollection);
const BTSCount = ref();

const fetchDataBTS = async () => {
  try {
    const querySnapshot = await getDocs(btsCollection);
    BTSCount.value = querySnapshot.size;

    // console.log(data.length);

    // mappingBtsData(data);
    // mappingBtsCalc(data);
    // isLoad.value = false;
    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};
onMounted(() => {
  fetchDataBTS();
});
</script>
