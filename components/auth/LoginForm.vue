<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const email = ref('');
const password = ref('');
const isLoad = ref(false);
const isEmpty = ref(false);
const isAuth = ref(false);
const message = ref('');

const auth = inject('auth');
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     return navigateTo('/');
//   }
//   return navigateTo('/auth/login');
// });

const login = async (auth, email, password) => {
  try {
    isLoad.value = true;

    await signInWithEmailAndPassword(auth, email, password);

    // Handle successful login, you can redirect or update UI state here
  } catch (error) {
    // Handle login error

    isAuth.value = true;
    message.value = 'Email atau Password Salah';

    isLoad.value = false;
    console.error(error.message);
  }
};
const submitForm = () => {
  if (email.value !== '' && password.value !== '') {
    login(auth, email.value, password.value);
    return;
  }

  isEmpty.value = true;
  message.value = 'Email atau Password Tidak Boleh Kosong';
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Username</v-label>
        <v-text-field
          variant="outlined"
          hide-details
          color="primary"
          v-model="email"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Password</v-label>
        <v-text-field
          variant="outlined"
          type="password"
          hide-details
          color="primary"
          v-model="password"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pt-0">
        <div class="d-flex flex-wrap align-center ml-n2">
          <div class="ml-sm-auto">
            <NuxtLink
              class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
              >Forgot Password ?</NuxtLink
            >
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-btn
          color="primary"
          size="large"
          block
          flat
          @click="submitForm"
          :disabled="isLoad"
          ><span v-if="!isLoad">Sign In</span>
          <v-progress-circular indeterminate v-else></v-progress-circular>
        </v-btn>
      </v-col>
    </v-row>

    <v-snackbar v-model="isAuth" :timeout="2000" color="#5d87ff" elevation="24">
      {{ message }}
    </v-snackbar>
    <v-snackbar
      v-model="isEmpty"
      :timeout="2000"
      color="#5d87ff"
      elevation="24"
    >
      {{ message }}
    </v-snackbar>
  </form>
</template>
