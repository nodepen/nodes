<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-grow" />
    <div class="h-12 pl-8 pr-8 bg-green flex flex-row">
        <div class="w-full max-w-screen-xs h-full mr-6 bg-red-300" />
        <div class="h-full max-w-2xl overflow-x-auto items-center flex flex-row">
            <img v-for="(comp, i) in components" :key="`${i}-${comp.NickName}`" :src="`data:image/png;base64,${comp.Icon}`" class="w-6 h-6 mr-3" />
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GrasshopperComponent } from '../../lib/dist'

export default Vue.extend({
  layout: 'editor',
  data() {
      return {
          components: [] as GrasshopperComponent[]
      }
  },
  created() {
    this.getServerConfig()
  },
  methods: {
    async getServerConfig() {
      const res = await this.$axios.$get('http://localhost:8081/grasshopper')
      this.components = res
    },
  }
})
</script>