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
    <div class="overlay__parameter">
        <span class="text--md">{{p.name.toLowerCase()}} : {{p.typeName.toLowerCase()}}</span>
    </div>
    <div class="overlay__description">
        <span class="text--md">{{p.description.toLowerCase()}}</span>
    </div>
    <div class="overlay__value">
        <span class="text--md" @mouseenter="showEditValue = true" @mouseleave="showEditValue = false">{{p.getValue() || "no value"}}</span> <span v-show="showEditValue">E</span>
    </div>
    <div class="directions">
    </div>
    <div class="output">
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

.overlay__parameter {
    width: 100%;
    padding-top: var(--md);
    margin-bottom: var(--md);

    border-top: 1px solid #ccc;
}

.overlay__value {
    width: 100%;
    margin-top: var(--md);

    pointer-events: all;
}

.overlay__value:hover {
    cursor: pointer;
}

.directions {
    width: 100%;
    flex-grow: 1;
}

.output {
    width: 100%;
    padding-top: 100%;

    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: var(--md);

    background: rgba(20, 20, 20, 0.5);

    pointer-events: all;
}

.output::after {
    padding: none;
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
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
export default Vue.extend({
    name: 'workspace-overlay',
    props: ['component'],
    data() {
        return {
            showEditValue: false,
        }
    },
    computed: {
        c(): ResthopperComponent {
            return this.$store.state.component;
        },
        p(): ResthopperParameter {
            return this.$store.state.parameter;
        },
        name(): string {
            return this.separateCamelCase(this.c.name);
        }
    },
    methods: {
        separateCamelCase(string: string): string {
            if (string == undefined) {
                return "";
            }
            return string.match(/[A-Z][a-z]+/g)!.join(" ").toLowerCase();
        }
    }
})
</script>