<template>
  <div class="heading mb-5 pl-3">
    <h3 class="">Data Kegiatan</h3>
    <NuxtLink to="/kegiatan/add" class="addBtn"
      >New <CirclePlusIcon class="ml-2"></CirclePlusIcon
    ></NuxtLink>
  </div>
  <v-skeleton-loader
    type="table-thead,table-tbody"
    v-if="isLoad"
  ></v-skeleton-loader>
  <v-table class="month-table" v-else>
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-bold">Nama Pelanggan</th>
        <th class="text-subtitle-1 font-weight-bold">Jenis Kegiatan</th>
        <th class="text-subtitle-1 font-weight-bold">Kegiatan</th>
        <th class="text-subtitle-1 font-weight-bold">Tanggal</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="kegiatanData.length == 0">
        <td colspan="5" style="text-align: center">Belum ada Kegiatan</td>
      </tr>
      <tr
        v-else
        v-for="item in kegiatanData"
        :key="item.id_kegiatan"
        class="month-item"
      >
        <td>
          <p class="text-15 font-weight-medium">{{ item.nama_pelanggan }}</p>
        </td>
        <td>
          <p class="text-subtitle-1">
            {{ item.jenis_kegiatan }}
          </p>
        </td>

        <td>
          <p class="text-subtitle-1">
            {{ item.kegiatan }}
          </p>
        </td>
        <td>
          <p class="text-body-1 text-muted">{{ item.tanggal }}</p>
        </td>
        <td>
          <NuxtLink :to="`/kegiatan/${item.id_kegiatan}`"
            ><edit-icon class="edit mr-2"></edit-icon
          ></NuxtLink>
          <PrinterIcon
            class="edit mr-2"
            @click="showModalPrint(item.id_kegiatan)"
          >
          </PrinterIcon>

          <TrashIcon class="delete" @click="showModal(item.id_kegiatan)">
          </TrashIcon>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-dialog v-model="isShow" width="400">
    <v-card>
      <v-card-title class="text-h5"> Yakin ingin Menghapus Data? </v-card-title>
      <v-card-text>Data Kegiatan Ini akan dihapus</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="isShow = false">
          Tidak
        </v-btn>
        <v-btn :color="red" variant="text" @click="deleteKegiatan(deleteData)">
          Iya
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <button @click="exportToPDF('my-pdf-file.pdf', pdfSection)">
    print card
  </button> -->
</template>

<script setup>
import Loading from '@/components/maps/Loading.vue';
import { EditIcon, TrashIcon, PrinterIcon } from 'vue-tabler-icons';

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';
import { CirclePlusIcon } from 'vue-tabler-icons';

import { exportToPDF, htmlToPdf } from '#imports';
const createTemporaryElement = (htmlString) => {
  const tempDiv = document.createElement('div');
  tempDiv.className = 'full pa-4';
  tempDiv.innerHTML = htmlString;
  return tempDiv;
};
const openInWindow = async () => {
  showPrint.value = false;
  const htmlEl =
    createTemporaryElement(`<h3>Data Kegiatan [${nama_pelanggan.value}] ${tanggal.value}</h3>
        <table class="print-table">
          <thead>
            <tr>
              <td class="text-subtitle-1">Kegiatan</td>
              <td class="text-subtitle-1">${kegiatan.value}</td>
            </tr>
            <tr>
              <td class="text-subtitle-1">Jenis Kegiatan</td>
              <td class="text-subtitle-1">${jenis_kegiatan.value}</td>
            </tr>
            <tr>
              <td class="text-subtitle-1">Pelaksana</td>
              <td class="text-subtitle-1">${pelaksana.value}</td>
            </tr>
            <tr>
              <td class="text-subtitle-1">Kesimpulan</td>
              <td class="text-subtitle-1">${kesimpulan.value}</td>
            </tr>
          </thead>
        </table> 
        
        <style >
        .full{
          width:400px;
        }
        h3, table, .print-table {
          width: 100%;
          margin: 0; /* Remove any default margins */
        }
              .print-table {
        /* Basic formatting */
        margin-top: 10px;
        width: 100%;
        border-collapse: collapse; /* Combine borders for cleaner look */
        font-family: sans-serif; /* Consistent font for readability */

        /* Visual enhancements */
        border: 1px solid #ccc; /* Add a subtle border */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
      }

      .print-table th,
      .print-table td {
        padding: 10px 15px; /* Generous padding for content */
        text-align: left; /* Align text to the left */
        border: 1px solid #ccc; /* Separate cells with borders */
      }

      .print-table th {
        /* Emphasis on headers */
        background-color: #f5f5f5; /* Lighter background for headers */
        font-weight: bold; /* Bold text for headers */
      }

      .print-table td:nth-child(odd) {
        /* Alternate row coloring for readability */
        background-color: #f2f2f2;
      }
      @media print, screen and (min-width: 210mm) and (min-height: 297mm) {
        /* Styles for A4 size */
        
      }
        </style>`);
  const pdf = await htmlToPdf(htmlEl, undefined, {
    width: 100,
    html2canvas: {
      scale: 1,
      useCORS: true,
    },
  });

  const blob = pdf.output('blob');
  window.open(URL.createObjectURL(blob), '_blank');
};
// console.log(pdfSection.value);
const pdfSection = (ref < HTMLElement) | (null > null);
// import fetchData from '@/server/fetchData';
// const auth = getAuth();
const kegiatan = ref('');
const pelaksana = ref('');
const jenis_kegiatan = ref('');
const nama_pelanggan = ref('');
const tanggal = ref();
const kesimpulan = ref('');
const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin
const deleteData = ref(null);
const isShow = ref(false);
const showPrint = ref(false);
const red = ref('#D50000');
const showModal = (item) => {
  deleteData.value = item;
  isShow.value = true;
};
const showModalPrint = async (item) => {
  console.log(item);
  await showKegiatan(item);
  openInWindow();
  // deleteData.value = item;
  showPrint.value = true;
};
const showKegiatan = async (id) => {
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
  tanggal.value = data.tanggal || '';

  // console.log(parts);

  nama_pelanggan.value = data.nama_pelanggan || '';
  kesimpulan.value = data.kesimpulan || '';

  isLoad.value = false;
};
const rawAuth = localStorage.getItem('uid');
const auth = rawAuth.slice(1, -1);
const kegiatanCollection = collection(firestore, 'kegiatan'); // Reference to the "bts" collection

const kegiatanData = ref([]); // A ref to store the data

const isLoad = ref(true);
let user = null;
onMounted(() => {
  // sortBTSData();
  useStateChange(user);
  loadKegiatan(auth);
});
const loadKegiatan = async (id) => {
  // console.log(typeof id);
  const q = query(kegiatanCollection, where('createdByUid', '==', id));
  const querySnapshot = await getDocs(q);
  const kegiatanList = querySnapshot.docs.map((doc) => doc.data());
  kegiatanData.value = kegiatanList;
  // console.log(kegiatanData.value);
  isLoad.value = false;
};

const deleteKegiatan = async (id) => {
  try {
    const q = query(
      kegiatanCollection,
      where('id_kegiatan', '==', parseInt(id))
    );
    const querySnapshot = await getDocs(q);

    const documentId = querySnapshot.docs[0].id;
    // console.log(documentId);
    const kegiatanRef = doc(firestore, 'kegiatan', documentId);
    const snapshot = await getDoc(kegiatanRef);

    if (snapshot.exists()) {
      await deleteDoc(kegiatanRef);
      // console.log(`Document with ID ${id} deleted successfully`);
      isShow.value = false;
      kegiatanData.value = kegiatanData.value.filter(
        (item) => item.id_kegiatan !== parseInt(id)
      );
    } else {
      console.log(`Document with ID ${parseInt(id)} does not exist.`);
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  } //
};
</script>
<style scoped>
.addBtn {
  text-decoration: none;
  background-color: #5d87ff;
  color: beige;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: row;
}
.addBtn:hover {
  background-color: #567de9;
}
.heading {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
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
