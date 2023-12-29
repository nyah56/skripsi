<template>
  <div class="heading mb-5 pl-3">
    <h3 class="">Data Kegiatan</h3>
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
          <p class="text-subtitle-1">
            {{ item.tanggal }}
          </p>
        </td>
        <td>
          <EyeIcon class="edit" @click="showModal(item.id_kegiatan)"> </EyeIcon>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-row justify="center">
    <v-dialog v-model="isShow" width="1024">
      <v-card>
        <v-card-title>
          <span class="text-h5">Data Kegiatan</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Kegiatan"
                  disabled
                  v-model="kegiatan"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Pelaksana"
                  disabled
                  v-model="pelaksana"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Jenis Kegiatan"
                  disabled
                  v-model="jenis_kegiatan"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Tanggal"
                  disabled
                  v-model="tanggal"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nama Pelanggan"
                  disabled
                  v-model="nama_pelanggan"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Kesimpulan"
                  disabled
                  v-model="kesimpulan"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="isShow = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { EyeIcon } from 'vue-tabler-icons';

import {
  collection,
  getDocs,
  query,
  getDoc,
  where,
  doc,
} from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';
import { CirclePlusIcon } from 'vue-tabler-icons';

// import fetchData from '@/server/fetchData';
const showDatePicker = ref(false);

const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin
const showData = ref(null);
const isShow = ref(false);
const kegiatan = ref('');
const pelaksana = ref('');
const jenis_kegiatan = ref('');
const nama_pelanggan = ref('');
const tanggal = ref('');

const kesimpulan = ref('');
const showModal = (item) => {
  showData.value = item;
  isShow.value = true;
  showKegiatan(item);
};
const showKegiatan = async (id) => {
  //   console.log(parseInt(id));
  const q = query(kegiatanCollection, where('id_kegiatan', '==', parseInt(id)));
  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs[0]);
  const documentId = querySnapshot.docs[0].id;
  // console.log(documentId);
  const kegiatanRef = doc(firestore, 'kegiatan', documentId);
  const snapshot = await getDoc(kegiatanRef);

  const data = snapshot.data();

  kegiatan.value = data.kegiatan || '';
  pelaksana.value = data.pelaksana || '';
  jenis_kegiatan.value = data.jenis_kegiatan || '';
  tanggal.value = data.tanggal || '';
  nama_pelanggan.value = data.nama_pelanggan || '';
  kesimpulan.value = data.kesimpulan || '';

  isLoad.value = false;
};
const kegiatanCollection = collection(firestore, 'kegiatan'); // Reference to the "bts" collection

const kegiatanData = ref([]); // A ref to store the data

const isLoad = ref(true);

onMounted(() => {
  // sortBTSData();
  loadKegiatan();
});
const loadKegiatan = async () => {
  const { data, loading } = await useFetchData(
    kegiatanCollection,
    'id_kegiatan'
  );
  kegiatanData.value = data;
  isLoad.value = loading;
};
</script>
<style scoped>
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
