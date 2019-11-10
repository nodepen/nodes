<template>
<div id="workspace">
    OK
</div>
</template>

<style scoped>
#workspace {
    width: 100%;
    height: 100%;
}
</style>

<script lang="ts">
import Vue from 'vue'
import Resthopper from 'resthopper';

export default Vue.extend({
    name: 'workspace',
    mounted() {
        const ci = Resthopper.ComponentIndex;
        const pi = Resthopper.ParameterIndex;

        let def = new Resthopper.Definition();

        const n = pi.createParameter("Number", 1);
        n.isUserInput = true;

        let pt = ci.createComponent("ConstructPoint");
        pt.setInputByIndex(0, n);
        pt.setInputByIndex(1, n);
        pt.setInputByIndex(2, n);

        def.parameters = [n];
        def.components = [pt];

        console.log(def.compile());
        console.log(JSON.stringify(def.toRequest()));

        this.$http.post(`http://localhost:8081`, JSON.stringify(def.toRequest()))
        .then(x => {
            console.log(Resthopper.Parse.ResthopperSchemaAsOutputValue(x.data));
        })
        .catch(err => {
            console.log(err)
        });
    }
})
</script>