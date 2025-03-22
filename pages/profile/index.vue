<template>
  <div class="container elevation-4 pa-4">
    <h2 class="mb-5">My Profile</h2>
    <form @submit.prevent="submitForm">
      <v-row class="d-flex mb-3">
        <v-col cols="12">
          <v-label class="font-weight-bold mb-1">Email</v-label>
          <v-text-field
            variant="outlined"
            hide-details
            color="primary"
            v-model="email"
            disabled
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="user.emailVerified">
          <v-label class="font-weight-bold mb-1">Old Password</v-label>
          <v-text-field
            variant="outlined"
            type="password"
            hide-details
            color="primary"
            v-model="oldPassword"
          ></v-text-field>
        </v-col>
        <v-col cols="12" v-if="user.emailVerified">
          <v-label class="font-weight-bold mb-1">New Password</v-label>
          <v-text-field
            variant="outlined"
            type="password"
            hide-details
            color="primary"
            v-model="newPassword"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="mt-4 pt-0" v-if="!user.emailVerified">
          <v-btn
            color="#22d933"
            size="large"
            block
            flat
            @click="verifyEmail"
            :disabled="isVerify"
            ><span v-if="!isVerify"
              ><span style="color: white">Valdasi Akun</span></span
            >

            <v-progress-circular indeterminate v-else></v-progress-circular>
          </v-btn>
          <h4>
            Akun belum tervalidasi.Fitur ganti password tidak bisa digunakan
          </h4>
        </v-col>
        <v-col cols="6" class="mt-4 pt-0" v-if="user.emailVerified">
          <v-btn
            color="#ff0000"
            size="large"
            block
            flat
            @click="isShow = true"
            :disabled="isLoad"
          >
            <span style="color: white">Hapus Akun</span>
          </v-btn>
        </v-col>
        <!-- oldPassword.length > 0 -->
        <v-col cols="12" class="mt-4 pt-0" v-if="user.emailVerified">
          <v-btn
            color="primary"
            size="large"
            block
            flat
            @click="submitForm"
            :disabled="
              isLoad || !(oldPassword.length > 0 && newPassword.length > 0)
            "
          >
            <span v-if="!isLoad">Update</span>
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </v-btn>
        </v-col>
      </v-row>
    </form>
  </div>
  <v-snackbar v-model="isEmpty" :timeout="2000" color="#5d87ff" elevation="24">
    {{ message }}
  </v-snackbar>
  <v-dialog v-model="isShow" width="400" v-if="isShow">
    <v-card class="pa-5">
      <v-card-title class="text-h5"> Yakin ingin Menghapus Akun? </v-card-title>
      <v-card-text>Akunmu akan DIhapus dari Sistem</v-card-text>
      <v-card-text>Masukkan Password Akun</v-card-text>
      <v-text-field
        variant="outlined"
        type="password"
        hide-details
        color="primary"
        v-model="oldPasswordModal"
      ></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="isShow = false">
          Tidak
        </v-btn>
        <v-btn color="#D50000" variant="text" @click="deleteProfile">
          <span v-if="!isDelete">Iya</span>
          <v-progress-circular indeterminate v-else></v-progress-circular>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

import {
  getAuth,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  deleteUser,
} from 'firebase/auth';
const isShow = ref(false);
const config = useRuntimeConfig();
const auth = getAuth();
const router = useRouter();
const user = auth.currentUser;
const email = ref('');

const oldPassAuth = ref(false);
email.value = user.email;
const oldPassword = ref('');
const oldPasswordModal = ref('');
const newPassword = ref('');
const isLoad = ref(false);
const isVerify = ref(false);
const isDelete = ref(false);
const isEmpty = ref(false);

const message = ref('');
const validateOldPassword = async () => {
  const credential = EmailAuthProvider.credential(
    email.value,
    oldPassword.value
  );
  let status;
  try {
    isLoad.value = true;
    await reauthenticateWithCredential(user, credential);

    oldPassAuth.value = true;
  } catch (error) {
    // An error occurred during profile update
    isLoad.value = false;
    isEmpty.value = true;
    message.value = 'Password Lama Salah';
    // ...
  }
  status = oldPassAuth.value;
  return status;
};
const verifyEmail = async () => {
  isVerify.value = true;
  await sendEmailVerification(user);
  router.push('/dashboard');
};
const deleteProfile = async () => {
  const credential = EmailAuthProvider.credential(
    email.value,
    oldPasswordModal.value
  );
  try {
    isDelete.value = true;
    await reauthenticateWithCredential(user, credential);

    await deleteUser(user);
  } catch (error) {
    // auth/missing password auth invalidlogin for case
    isDelete.value = false;
    isEmpty.value = true;
    message.value = 'Password Lama Salah';
    console.error(error);
  }
};
const updateUserProfile = async () => {
  if (await validateOldPassword()) {
    if (newPassword.value.length >= 8) {
      await updatePassword(user, newPassword.value);
      oldPassword.value = '';
      newPassword.value = '';
      isEmpty.value = true;
      message.value = 'Password berhasil Diganti,Silahkan Login Kembali';
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await signOut(auth);
      return;
    }
    oldPassword.value = '';
    newPassword.value = '';
    isLoad.value = false;
    isEmpty.value = true;
    message.value = 'Password minimal 8 Karakter';
    // console.log('Passwod update');
  }
};
// const btsData = ref([]); // A ref to store the data
// console.log(auth.currentUser);

const submitForm = () => {
  //   console.log(email.value, password.value);
  //   if (email.value !== '' && password.value !== '') {
  //     return;
  //   }
  updateUserProfile();

  //   isEmpty.value = true;
  //   message.value = 'Email atau Password Tidak Boleh Kosong';
};
</script>
