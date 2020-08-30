<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-grow" />
    <div class="h-12 pl-8 pr-8 bg-green flex flex-row">
        <div class="w-full max-w-screen-xs h-full mr-6 flex flex-row items-center" >
            <div class="div-mono border-l-2 border-t-2 border-r-2 border-solid border-dark h-8 text-center w-1/2" @click="toggleCategory">
                {{ selectedCategory }}
            </div>
            <div class="div-mono border-t-2 border-r-2 border-solid border-dark h-8 text-center flex-grow w-1/2" @click="toggleSubcategory">
                {{ selectedSubcategory }}
            </div>
        </div>
        <div class="h-full max-w-2xl overflow-x-auto items-center flex flex-row">
            <img v-for="(comp, i) in activeComponents" :key="`${i}-${comp.NickName}`" :src="`data:image/png;base64,${comp.Icon}`" class="w-6 h-6 mr-3" />
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GrasshopperComponent, GrasshopperCategory } from '../../lib/dist'

export default Vue.extend({
  layout: 'editor',
  data() {
      return {
          components: [] as GrasshopperComponent[],
          categories: [] as GrasshopperCategory[],
          selectedCategory: '...',
          selectedSubcategory: '...'          
      }
  },
  created() {
    this.getServerConfig()
  },
  methods: {
    async getServerConfig() {
      const res: GrasshopperComponent[] = await this.$axios.$get('http://localhost:8081/grasshopper')
      res.forEach((c) => {
          const { Category, Subcategory } = c
          const cached = this.categories.find((cat) => cat.name === Category)
          if (!cached) {
              this.categories.push({ name: Category, subcategories: [Subcategory] })
              return
          }
          if (!cached.subcategories.find((sub) => sub === Subcategory)) {
              cached.subcategories.push(Subcategory)
          }
      })
      this.selectedCategory = this.categories[0]?.name ?? '!'
      this.selectedSubcategory = this.categories[0]?.subcategories[0] ?? '!'
      this.components = res
    },
    toggleCategory() {
        const i = this.categories.findIndex((c) => c.name === this.selectedCategory)
        const next = i === this.categories.length - 1 ? 0 : i + 1
        this.selectedCategory = this.categories[next].name
        this.selectedSubcategory = this.categories[next].subcategories[0]
    },
    toggleSubcategory() {
        const cat = this.categories.find((c) => c.name === this.selectedCategory)
        const i = cat?.subcategories.findIndex((sub) => sub === this.selectedSubcategory)
        const next = i === cat.subcategories.length - 1 ? 0 : i + 1
        this.selectedSubcategory = cat.subcategories[next]
    }
  },
  computed: {
      activeComponents(): GrasshopperComponent[] {
          return this.components.filter((c) => c.Category === this.selectedCategory && c.Subcategory === this.selectedSubcategory)
      }
  }
})
</script>