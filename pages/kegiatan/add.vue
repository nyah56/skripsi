<template>
  <v-col cols="2">
    <NuxtLink to="/kegiatan/">Back</NuxtLink>
  </v-col>
  <div class="container elevation-4">
    <h2 class="mb-5">Tambah Data Kegiatan</h2>
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

        <v-col cols="4" class="pt-0">
          <v-select :items="day" v-model="dayInput" label="Tanggal"></v-select>
        </v-col>
        <v-col cols="4" class="pt-0">
          <v-select
            :items="month"
            v-model="monthInput"
            label="Bulan"
          ></v-select>
        </v-col>
        <v-col cols="4" class="pt-0">
          <v-select :items="year" v-model="yearInput" label="Tahun"></v-select>
        </v-col>
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
import { CalendarIcon } from 'vue-tabler-icons';
import { ref, inject, onMounted, computed } from 'vue';
import { collection, addDoc, getDocs, GeoPoint } from 'firebase/firestore'; // Make sure to import the necessary Firestore functions
// import VueDatePicker from '@vuepic/vue-datepicker';
// import { Calendar, DatePicker } from 'v-calendar';
// import 'v-calendar/style.css';
// import '@vuepic/vue-datepicker/dist/main.css';
const router = useRouter();
const rawAuth = localStorage.getItem('uid');
const auth = rawAuth.slice(1, -1);
// console.log(auth);
// import fetchData from '@/server/fetchData';
const reactOffset = ref();
reactOffset.value = useScreenWH();
const isShow = ref(false);
// console.log(auth.currentUser.uid);

const firestore = inject('firestore'); // Assuming you have a Nuxt plugin that provides Firestore
const kegiatanCollection = collection(firestore, 'kegiatan');

const isLoad = ref(false);
const dayInput = ref();
const monthInput = ref();
const yearInput = ref();

const dynamicYear = () => {
  const year = new Date().getFullYear();
  const yearRange = [];
  for (let i = year - 3; i <= year + 3; i++) {
    yearRange.push(i.toString());
  }
  return yearRange;
};

const year = ref([]);
year.value = dynamicYear();
const day = ref([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
]);
const month = ref([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
]);

const kegiatan = ref('');
const pelaksana = ref('');
const jenis_kegiatan = ref('');
const nama_pelanggan = ref('');
const tanggal = ref('');
const kesimpulan = ref('');
const datePicker = ref('');

const formatDate = (day, month, year) => {
  // console.log(typeof datePicker.value);
  // console.log(`${day}/${month}/${year}`);
  return `${day}/${month}/${year}`;
};

onMounted(() => {
  getLastData();
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
  if (!dayInput.value) {
    return true;
  }
  if (!monthInput.value) {
    return true;
  }
  if (!yearInput.value) {
    return true;
  }
  if (!kesimpulan.value) {
    return true;
  }

  // Validate additional fields with your existing functions
};
const getLastData = async () => {
  const { data } = await useFetchData(kegiatanCollection);
  if (data.length == 0) {
    return 1;
  } else {
    const idCount = data.map((item) => {
      const { id_kegiatan } = item;
      const numericPart = id_kegiatan;
      return {
        numericPart,
      };
    });

    // btsData.value = modifiedData;
    const lastID = idCount.sort((b, a) => a.numericPart - b.numericPart);
    // console.log(lastID);
    const newID = lastID[0].numericPart + 1;
    // console.log(newID);
    return newID;
  }
};

const handleSubmit = async () => {
  isLoad.value = true;
  const dataObject = {
    id_kegiatan: await getLastData(),
    kegiatan: kegiatan.value,
    pelaksana: pelaksana.value,
    jenis_kegiatan: jenis_kegiatan.value,
    tanggal: formatDate(dayInput.value, monthInput.value, yearInput.value),
    nama_pelanggan: nama_pelanggan.value,
    kesimpulan: kesimpulan.value,
    createdByUid: auth,
  };

  try {
    // Add a new document to the 'bts' collection with the input data
    await addDoc(kegiatanCollection, dataObject);

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
.custom-button {
  /* Basic button styles */
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;

  justify-items: end;
}
.btn-primary {
  background-color: #fff;
  color: #ff5d5d;
}

.close-icon {
  padding: 3px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  color: #0a0000;
  height: 22px;
  width: 22px;
}
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.close-icon:hover {
  background-color: red;
}
</style>
