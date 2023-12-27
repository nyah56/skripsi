<script setup>
import { UserIcon, MailIcon, ListCheckIcon } from 'vue-tabler-icons';
import { signOut, getAuth } from 'firebase/auth';
const auth = getAuth();

const logout = async () => {
  let isLogout = false;
  try {
    await signOut(auth);
    localStorage.removeItem('uid');
    // console.log('Logout');
    // return navigateTo('/');
    // Handle successful logout, you can redirect or update UI state here
  } catch (error) {
    // Handle logout error
    console.error(error.message);
  }
};
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="true">
    <template v-slot:activator="{ props }">
      <v-btn
        class="profileBtn custom-hover-primary"
        variant="text"
        v-bind="props"
        icon
      >
        <v-avatar size="35">
          <img src="/pdn-logo.png" height="35" alt="user" />
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
      <v-list class="py-0" lines="one" density="compact">
        <v-list-item value="item1" active-color="primary">
          <template v-slot:prepend>
            <UserIcon stroke-width="1.5" size="20" />
          </template>
          <v-list-item-title class="pl-4 text-body-1"
            ><NuxtLink to="/profile">My Profile</NuxtLink></v-list-item-title
          >
        </v-list-item>
      </v-list>
      <div class="pt-4 pb-4 px-5 text-center">
        <v-btn color="primary" variant="outlined" block @click="logout"
          >Logout</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
<style scoped>
a {
  text-decoration: none;
  color: #1f1f1f;
}
</style>
