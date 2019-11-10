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

        const n = pi.createParameter("Number", 2);
        n.isUserInput = true;

        let pt = ci.createComponent("ConstructPoint");
        pt.setInputByIndex(0, n);
        pt.setInputByIndex(1, n);
        pt.setInputByIndex(2, n);
        let point = pt.getOutputByIndex(0);

        let dept = ci.createComponent("Deconstruct");
        dept.setInputByIndex(0, point!);
        let x = dept.getOutputByIndex(0);
        let y = dept.getOutputByIndex(1);

        let m = ci.createComponent("Multiplication");
        m.setInputByIndex(0, x!);
        m.setInputByIndex(1, y!);
        let result = m.getOutputByIndex(0);

        let out = pi.createParameter("Number");
        out.isUserOutput = true;
        out.setSource(result!);

        def.parameters = [n, out];
        def.components = [pt, dept, m];

        //console.log(def.compile());
        //console.log(JSON.stringify(def.toRequest()));

        this.$http.post(`http://localhost:8081/grasshopper`, JSON.stringify(def.toRequest()))
        .then(x => {
            console.log(Resthopper.Parse.ResthopperSchemaAsOutputValue(x.data));
        })
        .catch(err => {
            console.log(err)
        });
    }
})
</script>