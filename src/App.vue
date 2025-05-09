<template>
  <router-view />
  <Toaster position="bottom-left" theme="dark" />
</template>

<script setup lang="ts">
  import { Toaster } from 'vue-sonner'
</script>