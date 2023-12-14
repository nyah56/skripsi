<template>
  <div class="container elevation-4 pa-4">
    <h2 class="mb-5">Tambah Data User</h2>
    <form @submit.prevent="submitForm">
      <v-row class="d-flex mb-3">
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Name</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
            v-model="displayName"
          ></v-text-field>
        </v-col>
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

        <v-col cols="12" class="mt-4 pt-0">
          <v-btn
            color="primary"
            size="large"
            block
            flat
            @click="submitForm"
            :disabled="isLoad"
            ><span v-if="!isLoad">Submit</span>
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </v-btn>
        </v-col>
      </v-row>
    </form>
  </div>
  <v-snackbar v-model="isEmpty" :timeout="2000" color="#5d87ff" elevation="24">
    {{ message }}
  </v-snackbar>
  <v-snackbar v-model="isPass" :timeout="2000" color="#5d87ff" elevation="24">
    {{ message }}
  </v-snackbar>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from 'firebase/auth';

// import sgMail from '@sendgrid/mail';

// const config = useRuntimeConfig();
const auth = getAuth();

async function signUpWithEmailAndPassword(email, password, name) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Send email verification
    isEmpty.value = true;
    message.value = 'Akun Berhasil ditambahkan,Silahkan Login Kembali';

    await new Promise((resolve) => setTimeout(resolve, 5000));
    await updateProfile(auth.currentUser, { displayName: name });
    await signOut(auth);
  } catch (error) {
    console.error('Error creating user or sending email:', error.message);
  }
}
const SendEmail = async (email, name, password) => {
  let msg = {
    personalizations: [
      {
        to: [
          {
            email: email,
            name: name,
          },
        ],
      },
    ],
    from: {
      email: 'pearson.ibnu@paditech.id',
      name: 'PadiSight',
    },
    subject: 'Halo Pengguna Baru!',
    content: [
      {
        type: 'text/plain',
        value: 'Halo',
      },
      {
        type: 'text/html',
        value: `<h1>Hi, ${name}</h1><p>Untuk akses kedalam PadiSight kamu harus menggunakan Email dan Password ini: </p><p>Email: ${email}</p><p>Password: ${password}</p><p><strong>Kamu Harus menggantinya setelah bisa login pada menu My Profile dan verifikasi akunmu :D</strong></p>`,
      },
    ],
  };
  const { data } = await useFetch('/api/sendgrid', {
    method: 'POST',
    body: msg,
  });
};
// Example usage without try-catch

const displayName = ref('');
const email = ref('');
const password = ref('');

// const btsData = ref([]); // A ref to store the data

const isLoad = ref(false);
const isEmpty = ref(false);
const isPass = ref(false);
const message = ref('');

const submitForm = () => {
  // console.log(email.value, password.value);
  if (displayName.value !== '' && email.value !== '' && password.value !== '') {
    isLoad.value = true;
    if (password.value.length >= 8) {
      signUpWithEmailAndPassword(
        email.value,
        password.value,
        displayName.value
      );
      SendEmail(email.value, displayName.value, password.value);
      return;
    }
    isPass.value = true;
    message.value = 'Password Minimal 8 Karakter';
    isLoad.value = false;
    password.value = '';
    return;
  }
  isEmpty.value = true;
  isLoad.value = false;
  message.value = 'Nama atau Email atau Password Tidak Boleh Kosong';
};
</script>
