import firebase, { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID,
    appId: config.APP_ID,
    measurementId: config.MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);

  nuxtApp.vueApp.provide('firestore', firestore);
  nuxtApp.provide('firestore', firestore);
});
