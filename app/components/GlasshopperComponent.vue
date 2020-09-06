<template>
    <div ref="panel" class="border-solid border-dark border-2 shadow-omd rounded-md bg-light flex z-10 overflow-hidden" :style="{ position: 'fixed', left: `${component.position[0] - 5}px`, top: `${component.position[1] - 5}px`}" @click="handleSelect">
        <div class="p-2 flex flex-col items-center justify-evenly">
            <div v-for="(input, i) in component.component.Inputs" :key="`${component.component.NickName}-${input.NickName}`" class="pip-left text-sm mt-1 mb-1 w-12 whitespace-no-wrap z-10" :class="i < component.component.Inputs.length - 1 ? 'border-b-2 border-dark pb-2' : ''">
                    <div class="pip mr-1 z-0 w-3 h-3 bg-light border-solid border-dark border-2 rounded-sm inline-block hover:bg-gray-500 hover:cursor-pointer shadow-ism" />
                    <div class="inline-block"  @click="() => showInput(input.NickName)">{{ input.NickName }}</div>
                    <input v-if="open.includes(input.NickName)" class="w-6 rounded-md pl-1 text-gray-600 bg-pale" @change="(e) => handleChange(i - 1, e.target.value)" />
            </div>
        </div>
        <div class="m-2 ml-0 mr-0 w-8 overflow-hidden flex flex-col items-center justify-center rounded-md border-solid border-dark border-2 shadow-ism bg-white z-10" >
            <span class="font-bold" style="transform: rotate(-90deg);">{{ component.component.NickName }}</span>
        </div>
        <div class="p-2 flex flex-col items-center justify-evenly">
            <div v-for="(output, i) in component.component.Outputs" :key="`${component.component.NickName}-${output.NickName}`" class="pip-right text-right text-sm mt-1 mb-1 w-8 whitespace-no-wrap z-10" :class="i < component.component.Outputs.length - 1 ? 'border-b-2 border-dark pb-2' : ''">
                <div class="inline-block">{{ output.NickName }}</div>
                <div class="pip ml-1 z-0 w-3 h-3 bg-light border-solid border-dark border-2 rounded-sm inline-block hover:bg-gray-500 hover:cursor-pointer shadow-ism" />
            </div>
        </div>
        <div class="selection-test" :style="{ opacity: component.selected ? 1 : 0, transform: `translate(${tf[0]}px, ${tf[1]}px)`, 'clip-path': `circle(${component.selected ? `${r}px` : '0px'} at center)`, transition: 'clip-path', 'transition-duration': '300ms', 'transition-timing-function': 'ease' }" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'glasshopper-component',
    props: ['component'],
    data() {
        return {
            dims: [1, 1, 1],
            overrides: [undefined, undefined, undefined] as (number | undefined)[],
            open: [] as string[],
            selectEventPosition: [0, 0],
            tf: [0, 0],
            doDraw: false,
            r: 0,
        }
    },
    mounted() {
        this.$emit('change', this.dims)

        // Determine dimensions of component
        const p: Element = this.$refs.panel
        const { clientWidth: w, clientHeight: h } = p
        this.r = Math.sqrt((w * w) + (h * h)) + 25
    },
    methods: {
        showInput(name: string): void {
            console.log(name)
            this.open.push(name)
        },
        handleChange(position: number, value: number): void {
            this.dims[position] = value
            this.$emit('change', this.dims)
        },
        handleSelect(e: any): void {
            const p: Element = this.$refs.panel
            const { clientWidth, clientHeight } = p
            const { layerX, layerY } = e
            this.tf = [ (clientWidth * (-3 / 2)) + layerX, (clientHeight * (-3 / 2)) + layerY ]
            if (!this.component.selected) {
                this.$emit('select', this.component.id)
            }  
        }
    }
})
</script>

<style scoped>
.pip-left > * {
    transform: translateX(-12px);
}

.pip-right > * {
    transform: translateX(12px);
}

.selection-test {
    position: absolute;
    width: 300%;
    height: 300%;
    background: #d8fab8;
}
</style>