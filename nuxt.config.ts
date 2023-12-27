// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false,
  },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  hooks: {},
  modules: ['nuxt3-leaflet', '@sidebase/nuxt-pdf'],
  runtimeConfig: {
    public: {
      API_KEY: process.env.FB_API_KEY,
      AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      PROJECT_ID: process.env.FB_PROJECT_ID,
      STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      APP_ID: process.env.FB_APP_ID,
      MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID_ID,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    },
  },
});
