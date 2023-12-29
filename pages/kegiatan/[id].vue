<template>
  <v-col cols="2">
    <NuxtLink to="/kegiatan/">Back</NuxtLink>
  </v-col>

  <div class="container elevation-4">
    <h2 class="mb-5">Ubah Data Kegiatan</h2>

    <form @submit.prevent="handleSubmit">
      <v-row class="d-flex mb-3">
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Kegiatan</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="kegiatan"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Pelaksana</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="pelaksana"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Jenis Kegiatan</v-label>
          <v-select
            :items="[
              'Survey',
              'Dismantle',
              'Troubleshoot',
              'Maintenance',
              'Installasi',
            ]"
            v-model="jenis_kegiatan"
          ></v-select>
        </v-col>
        <v-col cols="12"
          ><v-menu v-model="menu" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                label="Tanggal"
                v-model="tanggal"
                prepend-inner-icon="mdi-calendar-blank-outline"
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="inputDate"
              @update:model-value="formatDateInput"
              color="primary"
            ></v-date-picker> </v-menu
        ></v-col>

        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Nama Pelanggan</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="nama_pelanggan"
            color="primary"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Kesimpulan</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            v-model="kesimpulan"
            color="primary"
          ></v-text-field>
        </v-col>

        <!-- <v-overlay activator="showModal"></v-overlay> -->

        <v-col cols="4" class="pt-0" offset="8">
          <v-btn
            class="mt-4"
            color="primary"
            size="large"
            block
            :disabled="isLoad || validateForm()"
            @click="handleSubmit(params)"
            ><span v-if="!isLoad">Submit</span>
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </v-btn>
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script setup>
import { CalendarIcon } from 'vue-tabler-icons';
import { ref, inject, onMounted } from 'vue';
import {
  collection,
  getDocs,
  query,
  getDoc,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore'; // Make sure to import the necessary Firestore functions
// import { getAuth } from 'firebase/auth';
// import { DatePicker } from 'v-calendar';
import { useDate } from 'vuetify';
// import 'v-calendar/style.css';
// import fetchData from '@/server/fetchData';
const rawAuth = localStorage.getItem('uid');
const auth = rawAuth.slice(1, -1);
const menu = ref(false);
// console.log(auth.currentUser.uid);
const router = useRouter();
const firestore = inject('firestore'); // Assuming you have a Nuxt plugin that provides Firestore
const kegiatanCollection = collection(firestore, 'kegiatan');

const isLoad = ref(false);
const loadForm = ref(false);

const kegiatan = ref('');
const pelaksana = ref('');
const jenis_kegiatan = ref('');
const nama_pelanggan = ref('');
const tanggal = ref();
const kesimpulan = ref('');
const date = ref();
const inputDate = ref();
const dateFormat = useDate();
const formatDateInput = () => {
  let rawDate = dateFormat.toISO(inputDate.value);
  const dateParts = rawDate.slice(0, 10).split('-'); // Extract YYYY-MM-DD
  const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Rearrange to DD/MM/YYYY
  tanggal.value = formattedDate;
  menu.value = false;
};

// const newDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
// const dateObject = new Date(newDate);
const dayInput = ref();
const monthInput = ref();
const yearInput = ref();

const params = router.currentRoute.value.params.id;
// console.log(param);
onMounted(() => {
  editKegiatan(params);
});
const validateForm = () => {
  // Validate required fields
  if (!kegiatan.value) {
    return true;
  }
  if (!pelaksana.value) {
    return true;
  }
  if (!jenis_kegiatan.value) {
    return true;
  }
  if (!nama_pelanggan.value) {
    return true;
  }
  if (!tanggal.value) {
    return true;
  }
  if (!kesimpulan.value) {
    return true;
  }

  // Validate additional fields with your existing functions
};
const editKegiatan = async (id) => {
  // console.log(parseInt(id));
  const q = query(kegiatanCollection, where('id_kegiatan', '==', parseInt(id)));
  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs[0]);
  const documentId = querySnapshot.docs[0].id;
  // console.log(documentId);
  const kegiatanRef = doc(firestore, 'kegiatan', documentId);
  const snapshot = await getDoc(kegiatanRef);
  // console.log(snapshot);
  const data = snapshot.data();

  kegiatan.value = data.kegiatan || '';
  pelaksana.value = data.pelaksana || '';
  jenis_kegiatan.value = data.jenis_kegiatan || '';
  // tanggal.value = data.tanggal || '';
  const parts = data.tanggal.split('/');
  // console.log(parts);
  dayInput.value = parts[0] || '';
  monthInput.value = parts[1] || '';
  yearInput.value = parts[2] || '';
  nama_pelanggan.value = data.nama_pelanggan || '';
  kesimpulan.value = data.kesimpulan || '';
  tanggal.value = data.tanggal;
  const dateParts = tanggal.value.slice(0, 10).split('/'); // Extract YYYY-MM-DD
  const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  inputDate.value = dateFormat.parseISO(formattedDate);
  loadForm.value = false;
};
const handleSubmit = async (id) => {
  const q = query(kegiatanCollection, where('id_kegiatan', '==', parseInt(id)));
  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs[0]);
  const documentId = querySnapshot.docs[0].id;
  // console.log(documentId);
  const kegiatanRef = doc(firestore, 'kegiatan', documentId);
  isLoad.value = true;
  const dataObject = {
    id_kegiatan: parseInt(params),
    kegiatan: kegiatan.value,
    pelaksana: pelaksana.value,
    jenis_kegiatan: jenis_kegiatan.value,
    tanggal: tanggal.value,
    nama_pelanggan: nama_pelanggan.value,
    kesimpulan: kesimpulan.value,
    createdByUid: auth,
  };

  try {
    // Add a new document to the 'bts' collection with the input data
    await updateDoc(kegiatanRef, dataObject);

    // Optionally, you can reset the form fields after successful submission
    kegiatan.value = '';
    pelaksana.value = '';
    jenis_kegiatan.value = '';
    tanggal.value = '';
    nama_pelanggan.value = '';
    kesimpulan.value = '';
    router.push('/kegiatan/');
    // console.log('Data successfully sent to Firestore:', dataObject);
  } catch (error) {
    console.error(dataObject);
    console.error('Error sending data to Firestore:', error.message);
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  border-radius: 10px;
}
a {
  text-decoration: none;
  color: #0a0000;
}
</style>
