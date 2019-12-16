<template>
    <div id="lab">
        <div class="window">
            <div class="graph" ref="svgar" v-html="svg">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GenericComponent from './../models/components/GenericComponent';
import GlasshopperGraph from './../models/GlasshopperGraph';
import Resthopper from 'resthopper';

export default Vue.extend({
    data() {
        return {
            
        }
    },
    created() {
        this.$store.dispatch('loadAllComponents');
        this.$store.dispatch('initializeGraph');

        (<GlasshopperGraph>this.$store.state.currentGraph).setCamera(0, 0, 20, 20);
    },
    mounted() {
        const el = <Element>this.$refs.svgar;
        const w = el.clientWidth;
        const h = el.clientHeight;

        this.$store.dispatch('addGraphObject', 'Multiply');

        this.$store.dispatch('redrawGraph', {w: w, h: h});
    },
    computed: {
        svg(): string {
            const g = this.$store.state.currentGraph;

            return g.svg;
        }
    }
    
})
</script>

<style scoped>
#lab {
    width: 100%;
    height: 100%;

    box-sizing: border-box;

    padding: var(--md);
    padding-left: 0;
}

.window {
    width: 100%;
    height: 100%;

    box-sizing: border-box;
    border-left: 1px solid grey;
}

.graph {
    width: 500px;
    height: 500px;
}

path.blackmediumdashed {
    animation: march 60s linear infinite;
}

@keyframes march {
    from {
        stroke-dashoffset: 1500;
    }
    to {
        stroke-dashoffset: 0;
    }
}
</style>