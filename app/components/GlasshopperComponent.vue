<template>
    <div class="border-solid border-dark border-2 shadow-osm rounded-md bg-light flex z-10" :style="{ position: 'fixed', left: `${position[0] - 5}px`, top: `${position[1] - 5}px`}">
        <div class="p-2 flex flex-col items-center justify-evenly">
            <div v-for="(input, i) in component.Inputs" :key="`${component.NickName}-${input.NickName}`" class="pip-left text-sm mt-1 mb-1 w-8 whitespace-no-wrap" :class="i < component.Inputs.length - 1 ? 'border-b-2 border-dark pb-2' : ''">
                    <div class="pip mr-1 z-0 w-3 h-3 bg-light border-solid border-dark border-2 rounded-full inline-block" />
                    <div class="inline-block">{{ input.NickName }}</div>
            </div>
        </div>
        <div class="m-2 ml-0 mr-0 w-8 overflow-hidden flex flex-col items-center justify-center rounded-md border-solid border-dark border-2 shadow-ism" >
            <span class="font-bold" style="transform: rotate(-90deg);">{{ component.NickName }}</span>
        </div>
        <div class="p-2 flex flex-col items-center justify-evenly">
            <div v-for="(output, i) in component.Outputs" :key="`${component.NickName}-${output.NickName}`" class="pip-right text-right text-sm mt-1 mb-1 w-8 whitespace-no-wrap" :class="i < component.Outputs.length - 1 ? 'border-b-2 border-dark pb-2' : ''">
                <div class="inline-block">{{ output.NickName }}</div>
                <div class="pip ml-1 z-0 w-3 h-3 bg-light border-solid border-dark border-2 rounded-full inline-block" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'glasshopper-component',
    props: ['position', 'component'],
    data() {
        return {
            dims: [1, 1, 1],
        }
    },
    mounted() {
        this.$emit('change', this.dims)
    }
})
</script>

<style scoped>
.pip-left > * {
    transform: translateX(-15px);
}

.pip-right > * {
    transform: translateX(15px);
}
</style>