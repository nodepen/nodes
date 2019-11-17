<template>
    <div id="overlay">
        <div class="overlay__title">
            <div class="text--lg">{{name}} <span style="opacity: 0.5;">({{c.nickName.toLowerCase()}})</span></div>
        </div>
        <div class="overlay__subtitle">
            <span class="text--md">{{c.category.toLowerCase()}} &gt; {{c.subCategory.toLowerCase()}}</span>
        </div>
        <div class="overlay__description">
            <span class="text--sm">{{c.description.toLowerCase()}}</span>
        </div>
    </div>
</template>

<style scoped>
#overlay {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.overlay__title {
    width: 100%;
    height: var(--lg);
    box-sizing: border-box;
    line-height: var(--lg);
    vertical-align: middle;

}

.overlay__subtitle {
    width: 100%;
    height: var(--md);
    padding-bottom: var(--md);
    margin-bottom: var(--md);

    line-height: var(--md);
    vertical-align: middle;
}

.overlay__description {
    margin-bottom: var(--md);
}

.text--lg {
    font-size: calc(1.75 * var(--md));
    color: white;

    transform: translateY(-0.1rem);
}

.text--md {
    font-size: var(--md);
    color: white;
}

.text--sm {
    color: white;
}
</style>

<script lang="ts">
import Vue from 'vue'
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent'
export default Vue.extend({
    name: 'workspace-overlay',
    props: ['c'],
    computed: {
        c(): ResthopperComponent {
            return this.$store.state.component;
        },
        name(): string {
            return this.separateCamelCase(this.c.name);
        }
    },
    methods: {
        separateCamelCase(string: string): string {
            return string.match(/[A-Z][a-z]+/g)!.join(" ").toLowerCase();
        }
    }
})
</script>