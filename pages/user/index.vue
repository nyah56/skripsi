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
  </form>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

async function signUpWithEmailAndPassword(email, password) {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Your logic for handling the signed-up user
    console.log('User signed up:', user.uid);

    // Return the user data or any other relevant information
    return { success: true, user };
  } catch (error) {
    // Handle errors
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error('Error signing up:', errorCode, errorMessage);

    // You can throw the error or return a specific error object if needed
    return { success: false, error };
  }
}

// Example usage without try-catch

const email = ref('');
const password = ref('');

// const btsData = ref([]); // A ref to store the data

const isLoad = ref(false);

const submitForm = () => {
  console.log(email.value, password.value);
  if (email.value !== '' && password.value !== '') {
    signUpWithEmailAndPassword(email.value, password.value);
    return;
  }

  isEmpty.value = true;
  message.value = 'Email atau Password Tidak Boleh Kosong';
};
</script>
<style scoped>
.addBtn {
  text-decoration: none;
  background-color: #5d87ff;
  color: beige;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: row;
}
.addBtn:hover {
  background-color: #567de9;
}
.heading {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.edit {
  color: #fdd700;
}
.edit:hover {
  color: #faea92;
}
.delete {
  color: #ee0909;
}
.delete:hover {
  color: #fa9292;
}
</style>
