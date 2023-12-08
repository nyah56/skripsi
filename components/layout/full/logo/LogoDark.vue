<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const primary = ref('rgb(var(--v-theme-primary))');
const secondary = ref('rgb(var(--v-theme-secondary))');
</script>
<template>
  <div class="logo">
    <v-img
      :width="200"
      aspect-ratio="16/9"
      max-height="100"
      cover
      src="/pdn-logo.png"
    ></v-img>
  </div>
</template>
