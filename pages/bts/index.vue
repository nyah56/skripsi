<template>
  <Loading v-if="isLoad">Loading Data BTS...</Loading>
  <h3 class="mb-2 pl-3">Data BTS</h3>
  <v-table class="month-table">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-bold">ID BTS</th>
        <th class="text-subtitle-1 font-weight-bold">Nama BTS</th>
        <th class="text-subtitle-1 font-weight-bold">Alamat</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in btsData" :key="item.id_bts" class="month-item">
        <td>
          <p class="text-15 font-weight-medium">{{ item.id_bts }}</p>
        </td>
        <td>
          <div class="">
            <h6 class="text-subtitle-1 font-weight-bold">{{ item.nama }}</h6>
          </div>
        </td>
        <td>
          <h6 class="text-body-1 text-muted">{{ item.alamat }}</h6>
        </td>
        <td>
          <edit-icon class="edit mr-2"></edit-icon>
          <TrashIcon class="delete"></TrashIcon>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<style scoped>
.edit {
  color: #fdd700;
}
.edit:hover {
  color: #faea92;
}
.delete {
  color: #ee0909;
}
.delete:hover {
  color: #fa9292;
}
</style>
<script setup>
import Loading from '@/components/maps/Loading.vue';
import { EditIcon, TrashIcon } from 'vue-tabler-icons';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';

const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts'); // Reference to the "bts" collection

const btsData = ref([]); // A ref to store the data
const btsCalc = ref([]);
const isLoad = ref(true);
onMounted(() => {
  getBTSData();
});
const getBTSData = async () => {
  try {
    const data = [];
    const querySnapshot = await getDocs(btsCollection);

    querySnapshot.forEach((doc) => {
      // Here, you can access the document data
      data.push(doc.data());
    });

    const modifiedData = data.map((item) => {
      const { nama_bts, alamat, koordinat, id_bts } = item;
      const coordinates = [koordinat.latitude, koordinat.longitude];
      const numericPart = parseInt(id_bts.slice(3), 10);
      return {
        id_bts,
        nama: nama_bts,
        alamat,
        coordinates,
        numericPart,
      };
    });

    // btsData.value = modifiedData;
    btsData.value = modifiedData.sort((a, b) => a.numericPart - b.numericPart);
    isLoad.value = false;
    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};
</script>
