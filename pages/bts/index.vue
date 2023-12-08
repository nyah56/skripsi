<template>
  <Loading v-if="isLoad">Loading Data BTS...</Loading>
  <div class="heading mb-5 pl-3">
    <h3 class="">Data BTS</h3>
    <NuxtLink to="/bts/add" class="addBtn"
      >New <CirclePlusIcon class="ml-2"></CirclePlusIcon
    ></NuxtLink>
  </div>

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
          <NuxtLink :to="`/bts/${item.id_bts}`"
            ><edit-icon class="edit mr-2"></edit-icon
          ></NuxtLink>
          <TrashIcon class="delete" @click="showModal(item.id_bts)">
            ></TrashIcon
          >
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-dialog v-model="isShow" width="400" v-if="isShow">
    <v-card>
      <v-card-title class="text-h5"> Yakin ingin Menghapus Data? </v-card-title>
      <v-card-text>Data BTS {{ deleteData }} akan dihapus</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="isShow = false">
          Tidak
        </v-btn>
        <v-btn :color="red" variant="text" @click="deleteBTS(deleteData)">
          Iya
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import Loading from '@/components/maps/Loading.vue';
import { EditIcon, TrashIcon } from 'vue-tabler-icons';
import deleteConfirm from '@/components/bts/deleteConfirm.vue';
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

const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin
const deleteData = ref(null);
const isShow = ref(false);
const red = ref('#D50000');
const showModal = (item) => {
  deleteData.value = item;
  isShow.value = true;
};

const btsCollection = collection(firestore, 'bts'); // Reference to the "bts" collection

const btsData = ref([]); // A ref to store the data

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
    // console.log(querySnapshot);

    const modifiedData = data.map((item) => {
      const { nama_bts, alamat, id_bts } = item;
      // const coordinates = [koordinat.latitude, koordinat.longitude];
      const numericPart = parseInt(id_bts.slice(3), 10);
      return {
        id_bts,
        nama: nama_bts,
        alamat,
        // coordinates,
        numericPart,
      };
    });

    // btsData.value = modifiedData;
    btsData.value = modifiedData.sort((a, b) => a.numericPart - b.numericPart);
    // console.table(btsData.value);
    isLoad.value = false;
    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};

const deleteBTS = async (id) => {
  try {
    const q = query(btsCollection, where('id_bts', '==', id));
    const querySnapshot = await getDocs(q);
    const documentId = querySnapshot.docs[0].id;
    const btsRef = doc(firestore, 'bts', documentId);
    const snapshot = await getDoc(btsRef);

    if (snapshot.exists()) {
      console.log('Document data:', snapshot.data());
      await deleteDoc(btsRef);
      // console.log(`Document with ID ${id} deleted successfully`);
      isShow.value = false;
      btsData.value = btsData.value.filter((item) => item.id_bts !== id);
    } else {
      console.log(`Document with ID ${id} does not exist.`);
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  }
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
