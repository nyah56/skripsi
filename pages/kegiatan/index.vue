<template>
  <Loading v-if="isLoad">Loading Data Kegiatan...</Loading>
  <div class="heading mb-5 pl-3">
    <h3 class="">Data Kegiatan</h3>
    <NuxtLink to="/kegiatan/add" class="addBtn"
      >New <CirclePlusIcon class="ml-2"></CirclePlusIcon
    ></NuxtLink>
  </div>

  <v-table class="month-table">
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
          <TrashIcon class="delete" @click="showModal(item.id_kegiatan)">
          </TrashIcon>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-dialog v-model="isShow" width="400" v-if="isShow">
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
</template>

<script setup>
import Loading from '@/components/maps/Loading.vue';
import { EditIcon, TrashIcon } from 'vue-tabler-icons';

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

// import fetchData from '@/server/fetchData';
// const auth = getAuth();
const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin
const deleteData = ref(null);
const isShow = ref(false);
const red = ref('#D50000');
const showModal = (item) => {
  deleteData.value = item;
  isShow.value = true;
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
