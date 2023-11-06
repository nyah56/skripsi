<script>
import Button from '@/components/maps/Button.vue';
import Loading from '@/components/maps/Loading.vue';
import Card from '@/components/maps/Card.vue';
import { CurrentLocationIcon } from 'vue-tabler-icons';
import { collection, getDocs } from 'firebase/firestore';
import { onMounted, ref, computed } from 'vue';

export default {
  setup() {
    const firestore = inject('firestore'); // Inject the Firestore instance from your Nuxt plugin

    const btsCollection = collection(firestore, 'bts'); // Reference to the "bts" collection

    const btsData = ref([]); // A ref to store the data
    const btsCalc = ref([]);
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
    //replace map center after convertion to composition api
    const cardClick = (args) => {
      // console.log(args);
      const towerData = btsData.value;

      const selectedItem = towerData.find((item) => item.id_bts === args);
      if (selectedItem) {
        const koordinat = selectedItem.coordinates;
        console.log(koordinat);
      }
    };
    return {
      btsData,
      isLoad,
      cardClick,
    };
  },
  components: {
    Button,
    CurrentLocationIcon,
    Loading,
    Card,
  },
  computed: {
    valToRadius() {
      return this.kilometersToPixels(this.kmRad);
    },
    defaultPosition() {
      return this.hasLocation ? 'primary' : 'secondary';
    },
  },
  data() {
    return {
      urlTag: '/red-icon.png',
      urlBTS: '/bts.png',
      defaultLocation: [-7.2928347, 112.721984], //default callback
      currentLocation: [],
      zoom: 36, // Adjust the zoom level as needed
      btsLocation: [],
      jarak: 400,
      iconSize: [20, 35],
      kmRad: 1,
      hasLocation: false,
      btsLoc: [
        {
          nama_bts: 'BTS-Trinity',
          koordinat: { latitude: -7.292883, longitude: 112.721768 },
        },

        // { "latitude": -7.330942, "longitude": 112.752649 }

        {
          nama_bts: 'BTS-Neo',
          koordinat: { latitude: -7.291484, longitude: 112.715535 },
        },
        {
          nama_bts: 'BTS-Architect',
          koordinat: { latitude: -7.263867, longitude: 112.746665 },
        },
      ],
      location: null,
      gettingLocation: false,
      errorStr: null,
    };
  },
  // components: { Tag },
  mounted() {
    this.geocodeAndSetMarker();
    // this.tes();
    // this.ini();
    // this.getData();
  },
  methods: {
    async getLocation() {
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
    },
    async locateMe() {
      this.gettingLocation = true;
      try {
        this.hasLocation = true;
        this.gettingLocation = false;
        this.location = await this.getLocation();
        // console.log(this.location);

        this.currentLocation[0] = this.location.coords.latitude;
        this.currentLocation[1] = this.location.coords.longitude;
        let lat = this.currentLocation[0];
        let long = this.currentLocation[1];
        this.defaultLocation[0] = lat;
        this.defaultLocation[1] = long;

        return [lat, long];
      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },

    pixelsToKilometers(pixels) {
      // Replace this with the actual scale factor for your map
      const scalePerPixel = 0.0001; // Example scale factor (adjust as needed)
      const kilometers = pixels * scalePerPixel;
      return kilometers;
    },
    kilometersToPixels(kilometers) {
      // Replace this with the actual scale factor for your map
      const scalePerPixel = 0.001; // Example scale factor (adjust as needed)
      const pixels = kilometers / scalePerPixel;
      return pixels;
    },
    async geocodeAndSetMarker() {
      const lat = -7.291484;
      const lng = 112.715535;

      // Construct the OSM API URL for reverse geocoding
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
          this.btsLocation = [lat, lng];
          this.btsLocation.city = city;
          this.btsLocation.country = country;
          // console.log(city);
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    },
  },
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
        <div class="list" v-if="location">
          <Card
            :title="data.nama"
            :distance="jarak"
            v-for="data in btsData"
            @click="cardClick(data.id_bts)"
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
      <LMarker :lat-lng="defaultLocation" ref="marker" v-if="location">
        <LTooltip>You</LTooltip>
        <LIcon :icon-url="urlTag" :icon-size="iconSize" />
      </LMarker>
      <LCircle
        :lat-lng="defaultLocation"
        :km-radius="kmRad"
        :radius="valToRadius"
        v-if="location"
      />
    </LMap>
  </div>
</template>
<style scoped>
.list {
  display: flex;
  flex-direction: column;
}
</style>
<!-- [-7.2928347, 112.721984] -->

<!--  -->
