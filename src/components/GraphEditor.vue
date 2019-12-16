<template>
    <div id="graph" ref="svgar" v-html="svg">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
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

        (<any>this.$store.state.currentGraph).setCamera(0, 0, 20, 20);
	},
	mounted() {
		const el = <Element>this.$refs.svgar;
		this.w = el.clientWidth;
		this.h = el.clientHeight;

		this.$store.dispatch('addGraphObject', 'Multiply');
        this.$store.dispatch('redrawGraph', {w: this.w, h: this.h});
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

</style>