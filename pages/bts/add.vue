<template>
  <NuxtLink to="/bts/">Back</NuxtLink>

  <v-col cols="2">
    <v-label class="font-weight-bold mb-1">Pilih dari Peta</v-label>
  </v-col>
  <div class="container elevation-4">
    <h2 class="mb-5">Tambah Data BTS</h2>
    <form @submit.prevent="handleSubmit">
      <v-row class="d-flex mb-3">
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Nama BTS</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="nama"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Alamat</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="alamat"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Kapasitas BTS</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="kapasitas"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Layanan Terpakai</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="layanan_terpakai"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Jumlah Pelanggan</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="jml_pelanggan"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-label class="font-weight-bold mb-1">Latitude</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-label class="font-weight-bold mb-1">Longitude</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-label class="font-weight-bold mb-1">Pilih dari Peta</v-label>
          <v-btn color="secondary" @click="toggle"><MapIcon></MapIcon></v-btn>
        </v-col>
        <mapModal v-if="isShow"></mapModal>
        <v-col cols="4" class="pt-0" offset="8">
          <v-btn
            class="mt-4"
            color="primary"
            size="large"
            block
            @click="handleSubmit"
            ><span v-if="!isLoad">Submit</span>
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </v-btn>
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script setup>
import Button from '@/components/bts/Button.vue';
import mapModal from '@/components/bts/mapModal.vue';
import { MapIcon } from 'vue-tabler-icons';
import { ref, inject, onMounted } from 'vue';
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Make sure to import the necessary Firestore functions
const router = useRouter();
const firestore = inject('firestore'); // Assuming you have a Nuxt plugin that provides Firestore
const btsCollection = collection(firestore, 'bts');

const isLoad = ref(false);
const isShow = ref(false);
const nama = ref('');
const alamat = ref('');
const kapasitas = ref('');
const jml_pelanggan = ref('');
const layanan_terpakai = ref('');
const toggle = () => {
  isShow.value = !isShow.value;
};
const getLastData = async () => {
  try {
    const data = [];
    const querySnapshot = await getDocs(btsCollection);

    querySnapshot.forEach((doc) => {
      // Here, you can access the document data
      data.push(doc.data());
    });

    const idCount = data.map((item) => {
      const { id_bts } = item;
      const numericPart = parseInt(id_bts.slice(3), 10);
      return {
        numericPart,
      };
    });

    // btsData.value = modifiedData;
    const lastID = idCount.sort((b, a) => a.numericPart - b.numericPart);
    // const newId = 'bts' + lastID[0].numericPart.toString();
    const newId = lastID[0].numericPart + 1;
    const idString = 'bts' + newId;
    // console.log(typeof idString);
    // console.table(btsData.value);
    // isLoad.value = false;
    // console.log('array', btsData.value);
    return idString;
  } catch (error) {
    console.error('Error getting data:', error);
  }
};
const handleSubmit = async () => {
  // Get a Firestore reference to the 'bts' collection
  const btsCollection = collection(firestore, 'bts');
  // id.value = await getLastData();
  // console.log(id.value);
  // Create a separate object with id and nama properties
  isLoad.value = true;
  const dataObject = {
    id_bts: await getLastData(),
    nama_bts: nama.value,
    alamat: alamat.value,
    kapasitas: parseInt(kapasitas.value),
    layanan_terpakai: parseInt(layanan_terpakai.value),
    jml_pelanggan: parseInt(jml_pelanggan.value),
  };

  try {
    // Add a new document to the 'bts' collection with the input data
    await addDoc(btsCollection, dataObject);

    // Optionally, you can reset the form fields after successful submission

    nama.value = '';
    alamat.value = '';
    kapasitas.value = '';
    layanan_terpakai.value = '';
    jml_pelanggan.value = '';
    router.push('/bts/');
    console.log('Data successfully sent to Firestore:', dataObject);
  } catch (error) {
    console.error('Error sending data to Firestore:', error.message);
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  border-radius: 10px;
}
</style>
