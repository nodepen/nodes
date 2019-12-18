<template>
    <div id="sandbox">
        <div class="toolbar">
            <div class="toolbar__categories">
                <div 
                v-for="(category, index) in categories" 
                :key='category.name' 
                :class="{'toolbar__category--active' : selectedCategory === category.name}" 
                :style="{'animation-delay': `${index * 0.1}s`}"
                class="toolbar__category"
                @click="selectedCategory = category.name">
                    {{category.name.toLowerCase()}}
                </div>
            </div>
            <div class="toolbar__categories" v-if="selectedCategory != ''">
                <div
                v-for="(subCategory, index) in activeCategory.subCategories"
                :key="`${subCategory.name}${index}`"
                :class="{'toolbar__category--active' : selectedSubCategory === subCategory.name}" 
                :style="{'animation-delay': `${index * 0.1}s`}"
                class="toolbar__category"
                @click="selectedSubCategory = subCategory.name">
                    {{subCategory.name.toLowerCase()}}
                </div>
            </div>
            <div class="toolbar__categories" v-if="selectedSubCategory != ''">
                <div
                v-for="(component, index) in activeSubCategory.components"
                :key="`${component.name}${index}`"
                class="toolbar__component">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GrasshopperCategory from './../models/GrasshopperCategory';

export default Vue.extend({
    data() {
        return {
            selectedCategory: '',
            selectedSubCategory: '',
        }
    },
    computed: {
        categories(): GrasshopperCategory[] {
            return this.$store.state.configuration;
        },
        activeCategory(): GrasshopperCategory {
            return this.$store.state.configuration.find((x: GrasshopperCategory) => x.name == this.selectedCategory)!;
        },
        activeSubCategory(): any {
            return (<GrasshopperCategory[]>this.$store.state.configuration)
                .find(x => x.name === this.selectedCategory)!.subCategories
                .find(x => x.name === this.selectedSubCategory)!;
        }
    }
})
</script>

<style scoped>
#sandbox {
    width: 100%;
    height: 100%;

    pointer-events: none;

    box-sizing: border-box;
    padding: var(--md);

    overflow: hidden;

    display: flex;
    flex-direction: column;
}

@keyframes drop {
    from {
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.toolbar {
    width: 100%;
    pointer-events: all;

    display: flex;
    flex-direction: column;

    font-size: var(--md);
}

.toolbar__categories {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: var(--sm);

    overflow-x: auto;
}

.toolbar__subcategories {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.toolbar__category {
    margin-right: var(--md);
    padding-bottom: var(--sm);
    border-bottom: 0.7mm solid rgba(0, 0, 0, 0);
    transform: translateY(-20px);
    opacity: 0;

    animation-name: drop;
    animation-duration: 0.25s;
    animation-fill-mode: forwards;
}

.toolbar__category:hover {
    cursor: pointer;
    border-bottom: 0.7mm solid black;
}

.toolbar__category--active {
    border-bottom: 0.7mm solid black;
}

.toolbar__component {
    width: var(--lg);
    height: var(--lg);
    margin-right: var(--md);

    box-sizing: border-box;
    border: 0.7mm solid black;
}
</style>