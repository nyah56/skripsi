<!-- ModalComponent.vue -->
<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Hai</v-card-title>
      <v-card-text>aaa</v-card-text>
      <!-- Add other details as needed -->
      <v-card-actions>
        <v-btn @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const dialog = ref(false);

const closeModal = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* Add your modal styles here */
</style>
