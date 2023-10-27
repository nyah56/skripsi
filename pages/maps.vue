<template>
  <div style="height: 100vh; width: 100vw">
    <LMap ref="map" :zoom="zoom" :center="currentLocation">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />

      <LMarker :lat-lng="btsLocation" ref="marker" @click="btsClick">
        <LTooltip :content="btsName"></LTooltip>
        <LIcon :icon-url="urlBTS" :icon-size="[25, 25]" />
      </LMarker>

      <LMarker :lat-lng="currentLocation" ref="marker" v-if="hasLocation">
        <LIcon :icon-url="urlTag" :icon-size="iconSize" />
      </LMarker>
      <LCircle
        class="custom-circle"
        :lat-lng="currentLocation"
        :km-radius="kmRad"
        :radius="valToRadius"
        v-if="hasLocation"
      />
    </LMap>
  </div>
</template>
<!-- [-7.2928347, 112.721984] -->

<!--  -->
<script>
export default {
  computed: {
    valToRadius() {
      return this.kilometersToPixels(this.kmRad);
    },
  },
  data() {
    return {
      currentLocation: [-7.2928347, 112.721984], //default callback
      zoom: 36, // Adjust the zoom level as needed
      btsLocation: [-7.292883, 112.721768], //'-7.292883, 112.721768
      iconSize: [20, 35],
      kmRad: 1,
      btsName: 'BTS-Trinity',
      urlTag: '/red-icon.png',
      urlBTS: '/bts.png',
      hasLocation: false,
    };
  },
  // components: { Tag },
  mounted() {
    console.log(this.kilometersToPixels(1));
    this.geocodeAndSetMarker();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.successCallback,
        this.errorCallback
      );
      // console.log(this.valToRadius());
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  },
  methods: {
    successCallback(position) {
      this.currentLocation[0] = position.coords.latitude;
      this.currentLocation[1] = position.coords.longitude;
      this.hasLocation = true;
      console.log('Allowed', this.currentLocation);
    },
    errorCallback(error) {
      console.error('Error getting location:', error);
      this.hasLocation = false;
    },
    btsClick(e) {
      console.log(this.btsName);
    },
    // async geocodeAndSetMarker() {
    //   const lat = this.btsLocation[0];
    //   const lng = this.btsLocation[1];
    //   const apiKey = 'c0a17392e352474489dbf932e8464419';
    //   const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    //   try {
    //     const response = await fetch(apiUrl);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     if (data.results.length > 0) {
    //       const { lat, lng } = data.results[0].geometry;
    //       this.btsLocation = [lat, lng];
    //     }
    //   } catch (error) {
    //     console.error('Geocoding failed:', error);
    //   }
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
