<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

const email = ref('');
const password = ref('');
const isLoad = ref(false);
const isEmpty = ref(false);
const isAuth = ref(false);
const isForgot = ref(false);
const message = ref('');

const auth = getAuth();

const login = async (auth, email, password) => {
  try {
    isLoad.value = true;
    // const stringifiedAuth = JSON.stringify(auth.currentUser.uid);
    // localStorage.setItem('uid', stringifiedAuth);

    // // Retrieve the stored auth object
    // const storedAuthString = localStorage.getItem('uid');

    // console.log(storedAuthString);
    await signInWithEmailAndPassword(auth, email, password);

    // Handle successful login, you can redirect or update UI state here
  } catch (error) {
    // Handle login error

    isAuth.value = true;
    message.value = 'Email atau Password Salah';

    isLoad.value = false;
    console.log(error);
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
const forgetPassword = async () => {
  const auth = getAuth();
  try {
    isLoad.value = true;
    isEmpty.value = true;
    message.value = 'Email Reset Terkirim';
    await new Promise((resolve) => setTimeout(resolve, 5000));
    sendPasswordResetEmail(auth, email.value);
    isForgot.value = false;
    isLoad.value = false;
  } catch (error) {
    isLoad.value = false;
    isEmpty.value = true;
    message.value = 'Email Tidak ditemukan';
    // Email Tidak ada terkirim
  }
};
const submitForget = () => {
  if (email.value !== '') {
    forgetPassword();
    return;
  }
  console.log('Kosong');
  isEmpty.value = true;
  message.value = 'Email Tidak Boleh Kosong';
};
</script>

<template>
  <form @submit.prevent="submitForget" v-if="isForgot">
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Email</v-label>
        <v-text-field
          variant="outlined"
          hide-details
          color="primary"
          v-model="email"
        ></v-text-field>
      </v-col>

      <v-col cols="12" class="pt-0 mt-4">
        <v-btn
          color="primary"
          size="large"
          block
          flat
          @click="submitForget"
          :disabled="isLoad"
          ><span v-if="!isLoad">Send Email</span>
          <v-progress-circular indeterminate v-else></v-progress-circular>
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="isEmpty"
      :timeout="2000"
      color="#5d87ff"
      elevation="24"
    >
      {{ message }}
    </v-snackbar>
  </form>

  <form @submit.prevent="submitForm" v-else>
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Email</v-label>
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
            <p
              class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
              @click="isForgot = true"
            >
              Forgot Password ?
            </p>
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
<style scoped>
p {
  cursor: pointer;
}
</style>
