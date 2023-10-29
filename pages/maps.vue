<script>
import Button from '@/components/maps/Button.vue';
import Loading from '@/components/maps/Loading.vue';
import { CurrentLocationIcon } from 'vue-tabler-icons';
export default {
  components: {
    Button,
    CurrentLocationIcon,
    Loading,
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
      tes: true,
      urlTag: '/red-icon.png',
      urlBTS: '/bts.png',
      defaultLocation: [-7.2928347, 112.721984], //default callback
      currentLocation: [],
      zoom: 36, // Adjust the zoom level as needed
      btsLocation: [],

      iconSize: [20, 35],
      kmRad: 1,
      hasLocation: false,
      btsLoc: [
        { name: 'BTS-Trinity', coordinate: [-7.292883, 112.721768] },
        { name: 'BTS-Neo', coordinate: [-7.291484, 112.715535] },
        { name: 'BTS-Architect', coordinate: [-7.263867, 112.746665] },
      ],
      location: null,
      gettingLocation: false,
      errorStr: null,
    };
  },
  // components: { Tag },
  mounted() {
    this.geocodeAndSetMarker();
    console.log(this.gettingLocation);
    // this.tes();
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
    // async tes() {
    //   let locate = await this.locateMe();
    //   this.hasLocation = true;
    //   //should be async
    //   // if (!this.stateLocation) {
    //   //   this.stateLocation = true;
    //   // } else {
    //   //   this.stateLocation = false;
    //   //   return this.defaultLocation;
    //   // }
    //   this.defaultLocation[0] = locate[0];
    //   this.defaultLocation[1] = locate[1];
    //   console.log(this.defaultLocation);
    // },
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
      const lat = this.btsLocation[0];
      const lng = this.btsLocation[1];

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
        }
      } catch (error) {
        console.error('Geocoding failed:', error);
      }
    },
  },
};
</script>
<template>
  <!-- <h1>{{ defaultLocation }}</h1> -->

  <div style="height: 80vh; width: 75vw">
    <LMap ref="map" :zoom="zoom" :center="defaultLocation" :key="location">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
      <LControl position="bottomleft"
        ><Button :type="defaultPosition" @click="locateMe"
          ><current-location-icon></current-location-icon></Button
      ></LControl>
      <LMarker
        v-for="data in btsLoc"
        ref="marker"
        @dblclick="btsClick"
        :lat-lng="data.coordinate"
      >
        <LTooltip>{{ data.name }}</LTooltip>

        <LIcon :icon-url="urlBTS" :icon-size="[25, 25]" />
      </LMarker>

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

    <Loading :isLoading="gettingLocation"></Loading>
  </div>
</template>
<!-- [-7.2928347, 112.721984] -->

<!--  -->
