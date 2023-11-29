<template>
  <Loading v-if="isLoad">Loading Data BTS...</Loading>
  <v-col cols="2">
    <NuxtLink to="/bts/">Back</NuxtLink>
  </v-col>
  <div class="container elevation-4">
    <h2 class="mb-5">Ubah Data BTS</h2>
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
        <v-col cols="4">
          <v-label class="font-weight-bold mb-1">Latitude</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
            v-model="lat"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-label class="font-weight-bold mb-1">Longitude</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
            v-model="lon"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex flex-column">
          <v-label class="font-weight-bold mb-1">Pilih Titik</v-label>
          <v-btn color="primary" class="flex-grow-2" @click="openModal"
            ><MapIcon></MapIcon
          ></v-btn>
        </v-col>

        <!-- <v-overlay activator="showModal"></v-overlay> -->
        <Teleport to="body">
          <v-dialog v-model="showModal" max-width="800">
            <v-card>
              <v-card-title>Pilih Koordinat pada Peta</v-card-title>
              <v-card-text style="height: 500px" max-width="400">
                <!-- Your map content goes here -->
                <LMap ref="map" :zoom="zoom" :center="defaultLocation">
                  <LTileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    layer-type="base"
                    name="OpenStreetMap"
                  />
                  <LMarker
                    :lat-lng="defaultLocation"
                    ref="marker"
                    draggable="true"
                    @dragend="updateMe"
                  >
                    <LTooltip>You</LTooltip>
                    <LIcon :icon-url="urlTag" :icon-size="[20, 35]" />
                  </LMarker>
                </LMap>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="closeModal">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </Teleport>

        <v-col cols="4" class="pt-0" offset="8">
          <v-btn
            class="mt-4"
            color="primary"
            size="large"
            block
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
import { MapIcon } from 'vue-tabler-icons';
import Loading from '@/components/maps/Loading.vue';
import { ref, inject, onMounted } from 'vue';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  getDoc,
  GeoPoint,
  query,
  where,
  doc,
} from 'firebase/firestore'; // Make sure to import the necessary Firestore functions
const router = useRouter();
const params = router.currentRoute.value.params.id; //get /bts/xxxx => xxxx
const firestore = inject('firestore'); // Assuming you have a Nuxt plugin that provides Firestore
const btsCollection = collection(firestore, 'bts');
const zoom = ref(36);
const urlTag = ref('/red-icon.png');
const defaultLocation = ref([-7.2928347, 112.721984]);
const isLoad = ref(true);
const showModal = ref(false);
const nama = ref('');
const alamat = ref('');
const kapasitas = ref('');
const jml_pelanggan = ref('');
const layanan_terpakai = ref('');
const lat = ref(0);
const lon = ref(0);

onMounted(() => {
  editBTS(params);
});
const openModal = () => {
  showModal.value = true;
  console.log('Click');
};
const closeModal = () => {
  showModal.value = false;
};
const editBTS = async (id) => {
  const q = query(btsCollection, where('id_bts', '==', id));
  const querySnapshot = await getDocs(q);
  const documentId = querySnapshot.docs[0].id;
  const btsRef = doc(firestore, 'bts', documentId);
  const snapshot = await getDoc(btsRef);
  const data = snapshot.data();
  nama.value = data.nama_bts || '';
  alamat.value = data.alamat || '';
  kapasitas.value = data.kapasitas || '';
  layanan_terpakai.value = data.layanan_terpakai || '';
  jml_pelanggan.value = data.jml_pelanggan || '';
  lat.value = data.koordinat ? data.koordinat.latitude : 0;
  lon.value = data.koordinat ? data.koordinat.longitude : 0;
  defaultLocation.value[0] = data.koordinat ? data.koordinat.latitude : 0;
  defaultLocation.value[1] = data.koordinat ? data.koordinat.longitude : 0;
  isLoad.value = false;
};

const handleSubmit = async (id) => {
  // Get a Firestore reference to the 'bts' collection

  const inputKoordinat = new GeoPoint(lat.value, lon.value);
  const q = query(btsCollection, where('id_bts', '==', id));
  const querySnapshot = await getDocs(q);
  const documentId = querySnapshot.docs[0].id;
  const btsRef = doc(firestore, 'bts', documentId);

  // id.value = await getLastData();
  // console.log(id.value);
  // Create a separate object with id and nama properties
  isLoad.value = true;
  const dataObject = {
    id_bts: params,
    nama_bts: nama.value,
    alamat: alamat.value,
    kapasitas: parseInt(kapasitas.value),
    layanan_terpakai: parseInt(layanan_terpakai.value),
    jml_pelanggan: parseInt(jml_pelanggan.value),
    koordinat: inputKoordinat,
  };

  try {
    // Add a new document to the 'bts' collection with the input data
    // await addDoc(btsCollection, dataObject);
    await updateDoc(btsRef, dataObject);

    // Optionally, you can reset the form fields after successful submission

    nama.value = '';
    alamat.value = '';
    kapasitas.value = '';
    layanan_terpakai.value = '';
    jml_pelanggan.value = '';
    router.push('/bts/');
    console.log('Data successfully sent to Firestore:', dataObject);
  } catch (error) {
    console.error(dataObject);
    console.error('Error sending data to Firestore:', error.message);
  }
};
const updateMe = (e) => {
  lat.value = e.target.getLatLng().lat;
  lon.value = e.target.getLatLng().lng;
  console.log(typeof lat.value);
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
