<template>
    <div id="lab">
        <div class="window">
            <div class="menu">
            </div>
            <div class="graph" ref="svgar">
                <div class="graph__svg" v-html="svg">
                    <!-- <div style="width: 100%; height: 100%;" v-html="svg">
                    </div> -->
                </div>
                <div class="graph__overlay">
                </div>
                <div class="graph__info">
                    <div class="graph__info__main">
                        <div class="graph__info__main__title">
                        </div>
                        <div class="graph__info__main__body">
                        </div>
                    </div>
                </div>
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
            w: 0,
            h: 0,
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

        this.w = w;
        this.h = h;

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

    padding-left: var(--md);
    border-left: 1px solid gainsboro;

    display: flex;
    flex-direction: column;
}

.menu {
    width: 100%;
    height: calc(var(--lg) + var(--md));
}

.graph {
    width: 100%;
    max-width: 100%;
    flex-grow: 1;

    display: flex;
    flex-direction: row;
}

.graph__svg {
    position: absolute;
}

.graph__overlay {
    height: 100%;
    flex-grow: 1;
}

.graph__info {
    height: 100%;
    width: 40ch;
    max-width: calc(100vw);

    display: flex;
    flex-direction: column;

    margin: calc(1.5 * var(--md));
    box-sizing: border-box;
}

.graph__info__main {
    width: 100%;
    background: rgba(255, 255, 255, 0.9);

    border-radius: var(--md);
    border: 2px solid black;
    box-shadow: 0mm 3px 7px 0px gainsboro;
}

.graph__info__main__title {
    width: 100%;
    height: 5ch;

    box-sizing: border-box;

    border-top-left-radius: var(--md);
    border-top-right-radius: var(--md);

    border-bottom: 1px solid gainsboro;
}

.graph__info__main__body {
    height: 20ch;

    box-sizing: border-box;
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