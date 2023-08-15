<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>&nbsp;
      <router-link to="/fullscreen">Fullscreen</router-link>&nbsp;
      <router-link to="/autoplay">Autoplay</router-link>
    </nav>
  </header>
  <router-view class="view"></router-view>
</template>

<style scoped>
header {
  position: fixed;
  right: 0;
  top: 0;
  padding: 5px;
  box-sizing: border-box;
  background: white;
  z-index: 100;
}

.view {
  z-index: 10;
}
</style>
