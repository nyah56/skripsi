<script setup>
import Button from '@/components/maps/Button.vue';
import Loading from '@/components/maps/Loading.vue';
import Card from '@/components/maps/Card.vue';
import { CurrentLocationIcon, XIcon, ListIcon } from 'vue-tabler-icons';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted, ref, computed, watch } from 'vue';

const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts'); // Reference to the "bts" collection

const btsCalc = ref([]);
const urlTag = ref('/red-icon.png');
const urlBTS = ref('/bts.png');
const zoom = ref(36);
// const jarak = ref(100);
const kmRad = ref(1);
const showList = ref(false);
// converting km to Pixel for Radius on Lcircle
const valToRadius = computed(() => {
  const scalePerPixel = 0.001; // Example scale factor (adjust as needed)
  const pixels = kmRad.value / scalePerPixel;
  return pixels;
});
// const mappingBtsCalc = (data) => {
//   const modifiedData = data.map((item) => {
//     const { nama, id_bts } = item;
//     // const coordinates = [koordinat.latitude, koordinat.longitude];
//     // const lat1 = defaultLocation.value.lat;
//     // console.log(lat1);
//     return {
//       id_bts,
//       nama,
//     };
//   });

//   btsCalc.value = modifiedData;
// };
onMounted(() => {
  fetchData();
  geocodeAndSetMarker();
});
// fetch from osm coor to object
const btsLocation = ref([]);

// fetching Data from FB document BTS
const isLoad = ref(true);
const btsData = ref([]); // ref For Fetching
watch(btsData, (newVal) => {
  updateData(newVal);
});
// const good = ref('#00dd2c');
// const ok = ref('#f7da02');
// const bad = ref('#ef1404');

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
const updateData = (data) => {
  btsCalc.value = data.map((item) => ({
    id_bts: item.id_bts,
    nama: item.nama,
    koordinat: item.coordinates,
    // lat2: item.coordinates[0],
    // lon2: item.coordinates[1],
    jarak: getDistanceFromLatLonInKm(
      defaultLocation.value.lat,
      defaultLocation.value.lng,
      item.coordinates[0],
      item.coordinates[1]
    ),
  }));

  btsCalc.value.sort((a, b) => a.jarak - b.jarak);
};
const fetchData = async () => {
  try {
    const data = [];
    const querySnapshot = await getDocs(btsCollection);

    querySnapshot.forEach((doc) => {
      // Here, you can access the document data
      data.push(doc.data());
    });

    mappingBtsData(data);
    // mappingBtsCalc(data);
    isLoad.value = false;
    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
};
const mappingBtsData = (data) => {
  const modifiedData = data.map((item) => {
    const { nama_bts, alamat, koordinat, id_bts } = item;
    const coordinates = [koordinat.latitude, koordinat.longitude];

    // console.log(lat1);
    return {
      id_bts,
      nama: nama_bts,
      alamat,
      coordinates,
    };
  });

  btsData.value = modifiedData;
  // console.log('asd', modifiedData);
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
        resolve(pos);
      },
      (err) => {
        reject(err);
      }
    );
  });
};
watch(location, () => {
  updateData(btsData.value);
});
const locateMe = async () => {
  gettingLocation.value = true;
  try {
    hasLocation.value = true;
    gettingLocation.value = false;
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
    };
    location.value = await getLocation(options);
    // console.log('raw', location.value);
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

    let lat = defaultLocation.value.lat;
    let long = defaultLocation.value.lng;
    console.log({ lat, long });
    // console.log(btsCalc.value);
    // return [lat, long];

    // console.log('hai', btsCalc.value);
  } catch (e) {
    gettingLocation.value = false;
    errorStr.value = e.message;
  }
};
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const oneDeg = 0.0174532925;

  let Rlat1 = lat1 * oneDeg;
  let Rlon1 = lon1 * oneDeg;
  let Rlat2 = lat2 * oneDeg;
  let Rlon2 = lon2 * oneDeg;
  Rlat1 = parseFloat(Rlat1.toFixed(11));
  Rlon1 = parseFloat(Rlon1.toFixed(11));
  Rlat2 = parseFloat(Rlat2.toFixed(11));
  Rlon2 = parseFloat(Rlon2.toFixed(11));
  //   konversi ke radian
  const x = (Rlon2 - Rlon1) * Math.cos((Rlat1 + Rlat2) / 2);
  const y = Rlat2 - Rlat1;
  let d = Math.sqrt(x * x + y * y) * R;
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
const cardClick = (args) => {
  // console.log(args);
  showList.value = false;
  const towerData = btsCalc.value;
  listState.value = true;
  const selectedItem = towerData.find((item) => item.id_bts === args);
  statusBTS(selectedItem);
  console.log(selectedItem);
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
    locateMe();
    geocodeAndSetMarker(koordinat);
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
</script>
<template>
  <!-- <h1>{{ isLoad }}</h1>
  <uL v-for="data in btsData">
    <li>{{ data.coordinates }}</li>
  </uL> -->

  <div class="map-container">
    <Loading v-if="isLoad">Loading Data BTS...</Loading>
    <LMap
      ref="map"
      :zoom="zoom"
      :center="defaultLocation"
      :key="location"
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
          :type="primary"
          @click="showList = true"
          v-if="hasLocation && !showList"
          ><ListIcon></ListIcon
        ></Button>
        <div class="container" v-if="showList">
          <x-icon class="close-icon" @click="showList = !showList"></x-icon>
          <h4>Nama BTS - Jarak</h4>

          <div class="list">
            <ul>
              <li v-for="data in btsCalc" @click="cardClick(data.id_bts)">
                <p>{{ data.nama }} - {{ data.jarak }} km</p>
                <v-chip :color="statusAllBTS(data.jarak).color">{{
                  statusAllBTS(data.jarak).msg
                }}</v-chip>
              </li>
            </ul>
          </div>

          <Card
            :title="itemCard.nama"
            :city="cityName"
            :distance="itemCard.jarak"
            :status="statusText"
            :status-color="statusColor"
            v-if="listState"
          />
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
      <LMarker :lat-lng="defaultLocation" ref="marker" v-if="location">
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
.map-container {
  height: 85vh;
  width: 75vw;
}
@media (max-width: 768px) {
  .map-container {
    height: 75vh;
    width: 85vw;
  }
}

/* Responsive styles for smartphones */
@media (max-width: 480px) {
  .map-container {
    height: 75vh;
    width: 90vw;
  }
}
.close-icon {
  padding: 5px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}
.container {
  background-color: #fdfdfd;
  margin-bottom: 5px;
}
.list {
  display: flex;
  flex-direction: column;

  padding: 10px;
  min-height: 200px;
  overflow-y: auto; /* This property makes the content scrollable vertically */
  max-height: 300px;
}
h4 {
  padding: 15px;
}

ul > li {
  list-style: none;
}

li {
  padding: 5px;
  margin-bottom: 5px;
}
li:hover {
  background-color: #f7f6f6;
}
</style>
<!-- [-7.2928347, 112.721984] -->

<!--  -->
