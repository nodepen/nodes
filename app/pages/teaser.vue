<template>
  <div class="w-vw h-vh bg-green flex flex-col justify-evenly items-center lg:flex-row">
    <div class="w-48 h-4"></div>
    <div ref="circle" class="w-76 h-76 lg:w-128 lg:h-128 rounded-full bg-pale overflow-hidden flex flex-col justify-center items-center">
      <div ref="svg" :style="backgroundTransform"></div>
      <div class="card-mono w-76 z-10 p-2 flex flex-col justify-center items-center">
        <h1 class="font-display text-3xl mb-2">glasshopper.io</h1>
        <p class="font-sans font-semibold text-sm mb-2">COMING SOON</p>
      </div>
    </div>
    <div @click="navigateToGithub" class="w-48 h-10 card-mono transition-all duration-150 ease-in-out hover:cursor-pointer transform translate-y-0 hover:translate-y-hov-sm flex flex-row">
      <div class="w-10 border-r border-dark"></div>
      <div class="flex-grow flex flex-row justify-center items-center">
        <a href="https://github.com/cdriesler/glasshopper.io" target="_blank" class="font-sans font-semibold text-sm">UPDATES</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      w: 0,
      h: 0,
      pct: 0,
      backgroundTransform: {}
    }
  },
  mounted() {
    const el = this.$refs.circle as Element
    this.w = this.h = el.clientWidth
    this.setBackgroundTransform()
    this.updateGrid()
  },
  methods: {
    setBackgroundTransform(): void {
      this.backgroundTransform = { transform: `translate(-${this.w * 0.5}px, -${this.h * 0.5}px)` }
    },
    updateGrid(): void {
      const el = this.$refs.svg as Element
      el.innerHTML = this.createGrid(this.pct)

      setTimeout(() => {
        this.pct = (this.pct + 0.025) % 1
        this.updateGrid()
      }, 40);
    },
    createGrid(pct: number): string {
      const spacing = 0.25
      const stepCount = Math.round(10 / spacing)
      const offset = pct * spacing

      const svg = [
        `<svg width="${this.w * 1.5}px" height="${this.h * 1.5}px" viewBox="${-offset + 1} ${offset + 1} 8 8" style="position: absolute">`
      ]

      for(let i = 0; i < stepCount; i++) {
        const pos = i * spacing
        svg.push(`<line x1="${pos}" y1="0" x2="${pos}" y2="10" stroke="#98E2C6" stroke-width="1px" vector-effect="non-scaling-stroke" />`)
        svg.push(`<line x1="0" y1="${pos}" x2="10" y2="${pos}" stroke="#98E2C6" stroke-width="1px" vector-effect="non-scaling-stroke" />`)
      }

      svg.push('</svg>')

      return svg.join('\n')
    },
    navigateToGithub(): void {
      window.location.assign('https://github.com/cdriesler/glasshopper.io')
    }
  }
})
</script>

<style scoped>
.card-mono {
  @apply border-2 border-solid border-dark shadow-osm bg-light;
}
</style>