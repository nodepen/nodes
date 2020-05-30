<template>
  <div class="teaser"></div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Teaser'
})
</script>

<style scoped>
.teaser {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: var(--green);
}
</style>
