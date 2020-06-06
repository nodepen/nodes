<template>
  <div class="w-vw h-vh bg-green flex flex-col justify-evenly items-center lg:flex-row">
    <div class="w-48 h-4 card-mono">X</div>
    <div class="w-76 h-76 lg:w-128 lg:h-128 rounded-full bg-pale overflow-hidden flex flex-col justify-center items-center">
      <div class="card-mono w-56 h-20"></div>
    </div>
    <div class="w-48 h-12 card-mono"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>

<style scoped>
.card-mono {
  @apply border-2 border-solid border-dark shadow-osm bg-light;
}
</style>