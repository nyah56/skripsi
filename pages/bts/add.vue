<template>
  <div class="container elevation-4">
    <h2 class="mb-5">Tambah Data BTS</h2>
    <form @submit.prevent="handleSubmit">
      <v-row class="d-flex mb-3">
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">ID BTS</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
            v-model="id"
          ></v-text-field>
        </v-col>
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
        <v-col cols="4" class="pt-0">
          <v-btn
            class="mt-4"
            color="primary"
            size="large"
            block
            @click="handleSubmit"
            >Submit</v-btn
          >
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script>
import { ref, inject } from 'vue';
import { collection, addDoc } from 'firebase/firestore'; // Make sure to import the necessary Firestore functions

export default {
  setup() {
    const firestore = inject('firestore'); // Assuming you have a Nuxt plugin that provides Firestore

    const id = ref('');
    const nama = ref('');
    const alamat = ref('');
    const kapasitas = ref('');
    const jml_pelanggan = ref('');
    const layanan_terpakai = ref('');

    const handleSubmit = async () => {
      // Get a Firestore reference to the 'bts' collection
      const btsCollection = collection(firestore, 'bts');

      // Create a separate object with id and nama properties
      const dataObject = {
        id_bts: id.value,
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
        id.value = '';
        nama.value = '';
        alamat.value = '';
        kapasitas.value = '';
        layanan_terpakai.value = '';
        jml_pelanggan.value = '';

        console.log('Data successfully sent to Firestore:', dataObject);
      } catch (error) {
        console.error('Error sending data to Firestore:', error.message);
      }
    };

    return {
      id,
      nama,
      alamat,
      kapasitas,
      layanan_terpakai,
      jml_pelanggan,
      handleSubmit,
    };
  },
};
</script>

<style>
.container {
  padding: 20px;
  border-radius: 10px;
}
</style>
