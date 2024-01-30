<script setup>
import Button from '@/components/maps/Button.vue';

import Card from '@/components/maps/Card.vue';
import {
  CurrentLocationIcon,
  XIcon,
  ListIcon,
  ChevronRightIcon,
} from 'vue-tabler-icons';
import { collection } from 'firebase/firestore';
import { onMounted, ref, computed, watch } from 'vue';
import { resolveDirective } from 'vue';
// import fetchData from '@/server/fetchData';

const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts'); // Reference to the "bts" collection

const btsCalc = ref([]);
const urlTag = ref('/red-icon.png');
const urlBTS = ref('/bts.png');
const zoom = ref(36);
// const jarak = ref(100);
const kmRad = ref(1);
const showList = ref(false);
const stateMap = ref(false);
// converting km to Pixel for Radius on Lcircle
const valToRadius = computed(() => {
  const scalePerPixel = 0.001; // Example scale factor (adjust as needed)
  const pixels = kmRad.value / scalePerPixel;
  return pixels;
});

onMounted(() => {
  // fetchData(btsCollection);
  // geocodeAndSetMarker();
  loadingBTS();
});
// fetch from osm coor to object
const btsLocation = ref([]);

// fetching Data from FB document BTS
const isLoad = ref(true);
const btsData = ref([]); // ref For Fetching
watch(btsData, (newVal) => {
  mappingBTSCalc(newVal);
});
const statusByPercent = (data) => {
  const temp = (data / 30) * 100;
  let final = 100 - temp;

  if (final < 0) {
    return 0;
  }
  return final.toFixed(2);
};
const statusAllBTS = (data) => {
  let colorStatus, msgStatus;
  if (data <= 10) {
    colorStatus = '#00dd2c';
    msgStatus = 'Good';
  } else if (data > 10 && data < 30) {
    colorStatus = '#f7da02';
    msgStatus = 'OK';
  } else {
    colorStatus = '#ef1404';
    msgStatus = 'Bad';
  }
  return { color: colorStatus, msg: msgStatus };
};
const mappingBTSCalc = (data) => {
  btsCalc.value = data.map((item) => ({
    id_bts: item.id_bts,
    nama: item.nama,
    koordinat: item.coordinates,
    kapasitas: item.kapasitas,
    layanan_terpakai: item.layanan_terpakai,
    sisa_layanan: item.sisa_layanan,
    jml_pelanggan: item.jml_pelanggan,
    jarak: getDistanceFromLatLonInKm(
      defaultLocation.value.lat,
      defaultLocation.value.lng,
      item.coordinates[0],
      item.coordinates[1]
    ),
    jangkauan: statusByPercent(
      getDistanceFromLatLonInKm(
        defaultLocation.value.lat,
        defaultLocation.value.lng,
        item.coordinates[0],
        item.coordinates[1]
      )
    ),
  }));

  btsCalc.value.sort((a, b) => a.jarak - b.jarak);
};

const loadingBTS = async () => {
  const { data, loading } = await useFetchData(btsCollection, 'id_bts');
  mappingBtsData(data);
  isLoad.value = loading;
};
const mappingBtsData = (data) => {
  const modifiedData = data.map((item) => {
    const {
      layanan_terpakai,
      kapasitas,
      jml_pelanggan,
      nama_bts,
      alamat,
      koordinat,
      id_bts,
    } = item;
    const coordinates = [koordinat.latitude, koordinat.longitude];

    // console.log(lat1);
    const sisa_layanan = kapasitas - layanan_terpakai;
    return {
      id_bts,
      nama: nama_bts,
      alamat,
      coordinates,
      kapasitas,
      layanan_terpakai,
      sisa_layanan,
      jml_pelanggan,
    };
  });

  btsData.value = modifiedData;
  // console.table(btsData.value);
};

// hasLocation: false,
//   location: null,
//   gettingLocation: false,
//   errorStr: null,
const defaultLocation = ref({ lat: -7.2928347, lng: 112.721984 });
const hasLocation = ref(false);

const defaultPosition = computed(() => {
  return hasLocation.value ? 'primary' : 'secondary';
});

const location = ref(null);
const gettingLocation = ref(false);
const errorStr = ref(null);
const getLocation = async (options) => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not available.'));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        hasLocation.value = true;
        resolve(pos);
      },
      (err) => {
        reject(err);
        errorStr.value = err.message;
      }
    );
  });
};
watch(stateMap, () => {
  mappingBTSCalc(btsData.value);
});

const locateMe = async () => {
  // gettingLocation.value = true;
  try {
    // gettingLocation.value = false;
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
    };
    location.value = await getLocation(options);

    if (options && typeof options.enableHighAccuracy === 'boolean') {
      if (options.enableHighAccuracy) {
        console.log('High accuracy is enabled.');
      } else {
        console.log('High accuracy is not enabled.');
      }
    } else {
      console.log(
        'enableHighAccuracy option is not properly set in the options object.'
      );
    }
    // let defaultLocArr = Object.values(defaultLocation.value);
    defaultLocation.value.lat = location.value.coords.latitude;
    defaultLocation.value.lng = location.value.coords.longitude;
    if (gettingLocation.value) {
      coordForLine.value[0][0] = defaultLocation.value.lat;
      coordForLine.value[0][1] = defaultLocation.value.lng; //updating whwen line rendered
    }
    let lat = defaultLocation.value.lat;
    let long = defaultLocation.value.lng;
    stateMap.value = !stateMap.value;
    // console.log({ lat, long });
    // console.log(btsCalc.value);
    // return [lat, long];

    // console.log('hai', btsCalc.value);
  } catch (e) {
    // gettingLocation.value = false;
  }
};
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const oneDeg = 0.0174532925; //radian

  //   konversi ke radian
  let Rlat1 = lat1 * oneDeg;
  let Rlon1 = lon1 * oneDeg;
  let Rlat2 = lat2 * oneDeg;
  let Rlon2 = lon2 * oneDeg;
  //pembulatan
  Rlat1 = parseFloat(Rlat1.toFixed(11));
  Rlon1 = parseFloat(Rlon1.toFixed(11));
  Rlat2 = parseFloat(Rlat2.toFixed(11));
  Rlon2 = parseFloat(Rlon2.toFixed(11));
  const x = (Rlon2 - Rlon1) * Math.cos((Rlat1 + Rlat2) / 2); //logitude
  const y = Rlat2 - Rlat1; //latitude
  let d = Math.sqrt(x * x + y * y) * R; //jarak
  d = parseFloat(d.toFixed(4));
  return d;
};
const cityName = ref();
const geocodeAndSetMarker = async ({ 0: lat, 1: lng }) => {
  // Construct the OSM API URL for reverse geocoding
  // console.log(lat);
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    if (data.address) {
      // Extract address information from OSM data
      const address = data.address;
      const city =
        address.city || address.town || address.village || address.county;
      const country = address.country;

      // Update the btsLocation with the reverse geocoded data
      btsLocation.value = [lat, lng];
      btsLocation.value.city = city;
      btsLocation.value.country = country;
      cityName.value = city;
      // console.log(cityName.value);
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }
};
//replace map center after convertion to composition api
const itemCard = ref();
const coordForLine = ref([[], []]);
const listState = ref(false);
// const good = ref('#00dd2c');
// watch(itemCard, (oldVal, newVal) => {
//   console.log('old', oldVal);
//   console.log('new', newVal);
// });
const itemSelected = ref();
const searchById = (data, args) => {
  return data.find((item) => item.id_bts === args);
};
const cardClick = (args) => {
  // console.log(args);
  itemSelected.value = args;
  // console.log(stateMap.value);
  gettingLocation.value = true;
  showList.value = false;

  listState.value = true;
  const selectedItem = searchById(btsCalc.value, args);
  statusBTS(selectedItem);
  // console.log(selectedItem);
  itemCard.value = selectedItem;
  if (selectedItem) {
    const koordinat = selectedItem.koordinat;
    coordForLine.value[0][0] = defaultLocation.value.lat;
    coordForLine.value[0][1] = defaultLocation.value.lng;
    coordForLine.value[1][0] = koordinat[0];
    coordForLine.value[1][1] = koordinat[1];
    // defaultLocation.value.lat = k  oordinat[0];
    // defaultLocation.value.lng = koordinat[1];
    // console.log(tes.value);

    geocodeAndSetMarker(koordinat);
    stateMap.value = !stateMap.value;
    // mappingBtsCalc();
  }
};

const statusColor = ref();
const statusText = ref();
const statusBTS = (data) => {
  if (data.jarak <= 10) {
    statusColor.value = '#00dd2c';
    statusText.value = 'Good';
  } else if (data.jarak > 10 && data.jarak < 30) {
    statusColor.value = '#f7da02';
    statusText.value = 'OK';
  } else {
    statusColor.value = '#ef1404';
    statusText.value = 'Bad';
  }
  // return
};
const updateMe = (e) => {
  defaultLocation.value.lat = e.target.getLatLng().lat;
  defaultLocation.value.lng = e.target.getLatLng().lng;
  if (gettingLocation.value) {
    coordForLine.value[0][0] = defaultLocation.value.lat;
    coordForLine.value[0][1] = defaultLocation.value.lng;
    // const selectedItem = searchById(btsCalc.value, itemSelected.value);
    // itemCard.value = selectedItem;
  }
  stateMap.value = !stateMap.value;
};
watch(btsCalc, () => {
  if (gettingLocation.value) {
    // coordForLine.value[0][0] = defaultLocation.value.lat;
    // coordForLine.value[0][1] = defaultLocation.value.lng;
    const selectedItem = searchById(btsCalc.value, itemSelected.value);
    statusBTS(selectedItem);
    itemCard.value = selectedItem;
  }
});
const router = useRouter();
const toKegiatan = (args) => {
  clearNuxtState('detailSurvey');
  const { nama, sisa_layanan } = searchById(btsCalc.value, args);
  const dataSurvey = useState(
    'detailSurvey',
    () => `BTS yang akan dipakai ${nama} dengan sisa layanan ${sisa_layanan} Mb`
  );
  router.push('/kegiatan/add');
};
</script>
<template>
  <!-- <h1>{{ isLoad }}</h1>
  <uL v-for="data in btsData">
    <li>{{ data.coordinates }}</li>
  </uL> -->
  <!-- <h4>{{ defaultLocation }}</h4> -->
  <!-- <div class="alert alert-danger m-0">
  This is a danger alert — <a href="#" class="alert-link">check it out</a>!
</div> -->
  <v-dialog v-model="errorStr" width="auto">
    <v-card>
      <v-card-text>
        Fitur BTS terdekat harus memiliki akses pada location pada Web Browser
        allow access location pada setting browser anda
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="errorStr = null">Tutup</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="map-content">
    <v-skeleton-loader
      type="image,image,image,image,image"
      v-if="isLoad"
    ></v-skeleton-loader>
    <LMap
      ref="map"
      :zoom="zoom"
      :center="defaultLocation"
      :key="stateMap"
      v-else
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />

      <LControl position="topright">
        <Button
          :type="defaultPosition"
          @click="showList = true"
          v-if="hasLocation && !showList"
          ><ListIcon></ListIcon
        ></Button>
        <div v-if="showList">
          <div class="action-section">
            <x-icon class="close-icon" @click="showList = !showList"></x-icon>
          </div>

          <div class="container">
            <div class="tableFixHead">
              <table>
                <thead>
                  <tr>
                    <th>Nama BTS</th>
                    <th>Jarak</th>
                    <th>Jangkauan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :class="
                      'scrollable ' +
                      (data.id_bts == itemSelected ? 'selected' : '')
                    "
                    v-for="data in btsCalc"
                    @click="cardClick(data.id_bts)"
                  >
                    <td>
                      <div class="buttonPass">
                        {{ data.nama }}
                        <button
                          class="button-pass elevation-2"
                          :class="buttonClass"
                          @click="toKegiatan(data.id_bts)"
                          type="button"
                        >
                          <ChevronRightIcon></ChevronRightIcon>
                        </button>
                      </div>
                    </td>

                    <td>{{ data.jarak }} km</td>
                    <td>{{ statusByPercent(data.jarak) }} %</td>
                    <td>
                      <v-chip :color="statusAllBTS(data.jarak).color">{{
                        statusAllBTS(data.jarak).msg
                      }}</v-chip>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Card
              :title="itemCard.nama"
              :city="cityName"
              :distance="itemCard.jarak"
              :range="itemCard.jangkauan"
              :status="statusText"
              :status-color="statusColor"
              :capacity="itemCard.kapasitas"
              :used-capacity="itemCard.layanan_terpakai"
              :diff="itemCard.sisa_layanan"
              :customer="itemCard.jml_pelanggan"
              v-if="listState"
            />
          </div>
        </div>
      </LControl>
      <LControl position="bottomleft"
        ><Button :type="defaultPosition" @click="locateMe"
          ><current-location-icon></current-location-icon
        ></Button>
      </LControl>
      <LMarker v-for="data in btsData" ref="marker" :lat-lng="data.coordinates">
        <LTooltip>{{ data.nama }}</LTooltip>

        <LIcon :icon-url="urlBTS" :icon-size="[25, 25]" />
      </LMarker>
      <!-- <LMarker v-for="data in btsLoc" :lat-lng="data.koordinat" ref="marker">
        <LTooltip>You</LTooltip>
        <LIcon :icon-url="urlTag" :icon-size="iconSize" />
      </LMarker> -->
      <LPolyline
        :lat-lngs="coordForLine"
        color="red"
        v-if="hasLocation"
      ></LPolyline>
      <LMarker
        :lat-lng="defaultLocation"
        ref="marker"
        v-if="hasLocation"
        :draggable="true"
        @dragend="updateMe"
      >
        <LTooltip>You</LTooltip>
        <LIcon :icon-url="urlTag" :icon-size="[20, 35]" />
      </LMarker>
      <LCircle
        :lat-lng="defaultLocation"
        :km-radius="kmRad"
        :radius="valToRadius"
        v-if="hasLocation"
      />
    </LMap>
  </div>
</template>
<style scoped>
.map-content {
  height: 85vh;
  width: 75vw;
}
/* /* @media (max-width: 801px) {
  .map-content {
    height: 75vh;
    width: 80vw;
  }
}
@media (max-width: 768px) {
  .map-content {
    height: 75vh;
    width: 75vw;
  }
} */
@media (max-width: 600px) {
  .map-content {
    height: 75vh;
    width: 85vw;
  }
}

@media (max-width: 480px) {
  .map-content {
    height: 75vh;
    width: 90vw;
  }
}
@media (max-width: 320px) {
  .map-content {
    height: 75vh;
    width: 85vw;
  }
}
.action-section {
  height: 10px;
  background-color: #3d3d3d;
  padding: 11px;
}
.close-icon {
  padding: 3px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  color: #f7f6f6;
  height: 22px;
  width: 22px;
}
.close-icon:hover {
  background-color: red;
}
.container {
  background-color: #fdfdfd;
  margin-bottom: 5px;
}

.tableFixHead {
  overflow: auto;
  height: 200px;
}
.tableFixHead thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px;
  background-color: #045b99;
  color: #fdfdfd;
}

table {
  padding: 10px;
  border-collapse: collapse;
}

td {
  text-align: center;
  padding: 10px;
}
h4 {
  padding: 10px;
}

tr:hover:not(thead tr) {
  background-color: #f7f6f6;
  /* cursor: pointer; */
}

.selected {
  background-color: #f7f6f6;
}
.buttonPass {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.button-pass {
  /* Basic button styles */

  border-radius: 100%;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  background-color: #fff;

  color: #5d87ff;
}
</style>
<!-- [-7.2928347, 112.721984] -->

<!--  -->
