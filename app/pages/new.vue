<template>
  <div class="w-full h-full flex flex-col">
    <div id="graph" class="flex-grow">
        <div id="scene" ref="scene" class="overflow-hidden" @click="doTest" />
    </div>
    <div class="h-12 pl-8 pr-8 bg-green flex flex-row">
        <div class="w-full max-w-screen-xs h-full mr-6 flex flex-row items-center" >
            <div class="div-mono text-sm leading-6 border-l-2 border-t-2 border-r-2 border-solid border-dark h-8 text-center w-1/2" @click="toggleCategory">
                {{ selectedCategory }}
            </div>
            <div class="div-mono text-sm leading-6 border-t-2 border-r-2 border-solid border-dark h-8 text-center flex-grow w-1/2" @click="toggleSubcategory">
                {{ selectedSubcategory }}
            </div>
        </div>
        <div class="h-full pt-3 max-w-3xl overflow-hidden select-none whitespace-no-wrap">
            <div 
                class="w-6 h-6 mr-3 box-border inline-block" 
                v-for="(comp, i) in activeComponents" :key="`${i}-${comp.NickName}`" 
                @mouseenter="(e) => handleComponentIconEnter(e, comp)"
                @mouseleave="handleComponentIconLeave"
                @pointerdown="(e) => handleStartComponentCreate(e, comp)"
                >
                <img 
                :src="`data:image/png;base64,${comp.Icon}`" 
                class="w-6 h-6 pointer-events-none" 
                />
            </div>
            
        </div>
    </div>
    <div 
        v-if="tooltip" 
        :style="{ position: 'fixed', left: `${tooltip.position[0]}px`, top: `${tooltip.position[1]}px`}" 
        class="p-1 pl-4 pr-4 border-l-2 border-solid border-darkgreen bg-green"
    >
        {{ tooltip.component.NickName }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rhino3dm from 'rhino3dm'
import * as THREE from 'three'
import OrbitControls from 'orbit-controls-es6'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader.js'
import { GrasshopperComponent, GrasshopperCategory } from '../../lib/dist'

interface ComponentTooltip {
    component: GrasshopperComponent
    position: [number, number]
}

export default Vue.extend({
  layout: 'editor',
  data() {
      return {
          components: [] as GrasshopperComponent[],
          categories: [] as GrasshopperCategory[],
          selectedCategory: '...',
          selectedSubcategory: '...',
          tooltip: undefined as ComponentTooltip | undefined,
          scene: {} as any, 
          controls: {} as any,
          camera: {} as any,
          renderer: {} as any,   
          graph: {
              component: undefined as GrasshopperComponent | undefined,
              position: [0, 0]
          },
          prev: 0,
          creating: false,
          pipComponent: undefined as GrasshopperComponent | undefined,
          pipPosition: [0, 0],
      }
  },
  created() {
    this.getServerConfig()
  },
  mounted() {
      this.initScene()
      window.addEventListener('pointermove', this.handleMoveComponentCreate)
      window.addEventListener('pointerup', this.handleEndComponentCreate)
  },
  methods: {
    async doTest(): Promise<void> {
        const res = await this.$axios.$get('http://localhost:8081/test')
        const { X, Y, Z } = res
        const dx = X.T1 - X.T0
        const dy = Y.T1 - X.T0
        const dz = Y.T1 - X.T0

        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0])
        }

        const box = new THREE.BoxGeometry(dx, dy, dz)
        const material = new THREE.MeshBasicMaterial( { color: '#98E2C6'} )
        const cube = new THREE.Mesh(box, material)
        this.scene.add(cube)
        this.animate()

        // console.log(res)
    },
    initScene(): void {
        const container: HTMLElement = this.$refs.scene as HTMLElement

        const camera = new THREE.PerspectiveCamera(60, 1, 1, 1000)
        camera.position.set( 5, - 10, 5 );
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('#eff2f2')

        scene.add( new THREE.AmbientLight(undefined, 0.0001) );
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( 0, 0, 2 );
        directionalLight.castShadow = true;
        directionalLight.intensity = 2;
        scene.add( directionalLight );

        this.scene = scene;

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(400, 400)
        container.appendChild(renderer.domElement)

        this.renderer = renderer
        this.camera = camera

        const controls = new OrbitControls(camera, container)
        controls.addEventListener('change', () => { this.renderer.render( this.scene, this.camera )})
        this.controls = controls
        this.animate()
    },
    animate(): void {
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    },
    async getServerConfig() {
      const res: GrasshopperComponent[] = await this.$axios.$get('http://localhost:8081/grasshopper')
      res.forEach((c) => {
          const { Category, Subcategory } = c
          const cached = this.categories.find((cat) => cat.name === Category)
          if (!cached) {
              this.categories.push({ name: Category, subcategories: [Subcategory] })
              return
          }
          if (!cached.subcategories.find((sub: string) => sub === Subcategory)) {
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
        const i = cat?.subcategories.findIndex((sub: string) => sub === this.selectedSubcategory)
        const next = i === cat.subcategories.length - 1 ? 0 : i + 1
        this.selectedSubcategory = cat.subcategories[next]
    },
    handleComponentIconEnter(e: any, component: GrasshopperComponent) {
        const el = e.target as HTMLElement
        const { top, left } = el.getBoundingClientRect()
        this.tooltip = {
            component: component,
            position: [left, top - 44]
        }
    },
    handleComponentIconLeave(): void {
        this.tooltip = undefined
    },
    handleStartComponentCreate(e: PointerEvent, component: GrasshopperComponent) {
        e.stopPropagation()
        this.creating = true
        // this.pipPosition = [ pageX, pageY ]
        this.pipComponent = component
    },
    handleMoveComponentCreate(e: PointerEvent) {
        const t = Date.now()
        if (!this.creating || t - this.prev < 30) {
            return
        }
        this.prev = t
        console.log(e)
    },
    handleEndComponentCreate(e: PointerEvent) {
        this.creating = false
    },
  },
  computed: {
      activeComponents(): GrasshopperComponent[] {
          return (this.components as GrasshopperComponent[]).filter((c) => c.Category === this.selectedCategory && c.Subcategory === this.selectedSubcategory).sort((a, b) => {
              const first = a.NickName.toUpperCase()
              const second = b.NickName.toUpperCase()
              return (first < second) ? -1 : (first > second) ? 1 : 0
          })
      }
  }
})
</script>

<style scoped>
#graph {
    background-size: 25px 25px;
    background-image:
        linear-gradient(to right, #98E2C6 1px, transparent 1px, transparent 10px),
        linear-gradient(to bottom, #98E2C6 1px, transparent 1px, transparent 10px)
}

#scene {
    position: fixed;
    left: 32px;
    bottom: 46px;
    width: 400px;
    height: 400px;
    background: #eff2f2;
    border: 2px solid #98E2C6;
}
</style>