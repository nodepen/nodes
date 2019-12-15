<template>
    <div id="lab">
        <div class="window">
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GenericComponent from './../models/components/GenericComponent';
import Resthopper from 'resthopper';

export default Vue.extend({
    data() {
        return {

        }
    },
    created() {
        this.$store.dispatch('loadAllComponents');

        const c = Resthopper.ComponentIndex.createComponent('FourPointSurface');
        const g = new GenericComponent(c);
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
</style>