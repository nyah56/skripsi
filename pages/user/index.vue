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
          <v-btn color="primary" size="large" block flat @click="SendEmail"
            ><span v-if="!isLoad">Subasdasdmit</span>
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
const SendEmail = async () => {
  let msg = {
    personalizations: [
      {
        to: [
          {
            email: 'x6perb@gmail.com',
            name: 'Name',
          },
        ],
      },
    ],
    from: {
      email: 'pearson.ibnu@paditech.id',
      name: 'My app',
    },
    subject: 'Test message!',
    content: [
      {
        type: 'text/plain',
        value: 'Test message',
      },
      {
        type: 'text/html',
        value: '<h1>Test message!</h1>',
      },
    ],
  };
  const { data } = await useFetch('/api/sendgrid', {
    method: 'POST',
    body: msg,
  });
};
// import sgMail from '@sendgrid/mail';

// const config = useRuntimeConfig();
const auth = getAuth();
// sgMail.setApiKey(config.SENDGRID_API_KEY);

// function sendEmail(msg) {
//   return sgMail
//     .send(msg)
//     .then(() => {
//       console.log('Email sent');
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }
// const tes = async () => {
//   const msg = {
//     to: 'ibnu.hmm@gmail.com', // Change to your recipient
//     from: 'test@example.com', // Change to your verified sender
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//   };
//   await sendEmail(msg);
// };
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
    await sendEmailVerification(userCredential.user);
    await signOut(auth);

    // Build the SendGrid email request
    //     const emailRequest = {
    //       personalizations: [
    //         {
    //           to: [
    //             {
    //               email: userCredential.user.email,
    //             },
    //           ],
    //         },
    //       ],
    //       from: {
    //         email: 'noreply@yourdomain.com',
    //       },
    //       subject: 'Welcome to your app!',
    //       content: [
    //         {
    //           type: 'text/plain',
    //           value: `Dear ${
    //             userCredential.user.displayName || userCredential.user.email
    //           },

    // Welcome to our app! We're excited to have you join our community.

    // Please verify your email address by clicking on the following link:

    // ${userCredential.user.emailVerificationLink}

    // Thank you for choosing us!

    // Sincerely,

    // The App Team`,
    //         },
    //       ],
    //     };

    //     // Send the email using SendGrid API
    //     fetch('https://api.sendgrid.com/v3/mail/send', {
    //       method: 'POST',
    //       headers: {
    //         Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(emailRequest),
    //       mode: 'no-cors',
    //     })
    //       .then(() => {
    //         console.log('Welcome email sent successfully!');
    //       })
    //       .catch((error) => {
    //         console.error('Error sending welcome email:', error);
    //       });
  } catch (error) {
    console.error('Error creating user or sending email:', error.message);
  }
}

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
      SendEmail();
      // signUpWithEmailAndPassword(
      //   email.value,
      //   password.value,
      //   displayName.value
      // );
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
