<script setup>
import Button from '@/components/maps/Button.vue';
import Loading from '@/components/maps/Loading.vue';
import Card from '@/components/maps/Card.vue';
import { CurrentLocationIcon } from 'vue-tabler-icons';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';
const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

const btsCollection = collection(firestore, 'bts'); // Reference to the "bts" collection

const btsCalc = ref([]);
const urlTag = ref('/red-icon.png');
const urlBTS = ref('/bts.png');
const zoom = ref(36);
const jarak = ref(100);
const kmRad = ref(1);
// converting km to Pixel for Radius on Lcircle
const valToRadius = computed(() => {
  const scalePerPixel = 0.001; // Example scale factor (adjust as needed)
  const pixels = kmRad.value / scalePerPixel;
  return pixels;
});
onMounted(() => {
  getBTSData();
  geocodeAndSetMarker();
});
// fetch from osm coor to object
const btsLocation = ref([]);

// fetching Data from FB document BTS
const isLoad = ref(true);
const btsData = ref([]); // ref For Fetching
const getBTSData = async () => {
  try {
    const data = [];
    const querySnapshot = await getDocs(btsCollection);

    querySnapshot.forEach((doc) => {
      // Here, you can access the document data
      data.push(doc.data());
    });

    const modifiedData = data.map((item) => {
      const { nama_bts, alamat, koordinat, id_bts } = item;
      const coordinates = [koordinat.latitude, koordinat.longitude];

      return {
        id_bts,
        nama: nama_bts,
        alamat,
        coordinates,
      };
    });

    btsData.value = modifiedData;
    isLoad.value = false;
    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
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
    // console.log(defaultLocation.value);
    return [lat, long];
  } catch (e) {
    gettingLocation.value = false;
    errorStr.value = e.message;
  }
};
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
      console.log(city);
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }
};
//replace map center after convertion to composition api
const cardClick = (args) => {
  // console.log(args);
  const towerData = btsData.value;

  const selectedItem = towerData.find((item) => item.id_bts === args);
  if (selectedItem) {
    const koordinat = selectedItem.coordinates;
    // console.log(koordinat);
    geocodeAndSetMarker(koordinat);
  }
};
</script>
<template>
  <!-- <h1>{{ isLoad }}</h1>
  <uL v-for="data in btsData">
    <li>{{ data.coordinates }}</li>
  </uL> -->

  <div style="height: 85vh; width: 75vw">
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
        <div class="list" v-if="hasLocation">
          <!-- <Card
            :title="data.nama"
            :distance="jarak"
            v-for="data in btsData"
            @click="cardClick(data.id_bts)"
          /> -->
          <ul>
            <h4>Nama BTS - Jarak</h4>
            <li v-for="data in btsData" @click="cardClick(data.id_bts)">
              <p>{{ data.nama }} - {{ jarak }}</p>
            </li>
          </ul>
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
.list {
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  padding: 10px;
}
ul > li {
  list-style: none;
}

li {
  padding: 5px;
  margin-bottom: 5px;
}
li:hover {
  background-color: #d4d4d4;
}
</style>
<!-- [-7.2928347, 112.721984] -->

<!--  -->
