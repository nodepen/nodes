<template>
    <div id="sandbox" :style="{'pointer-events': isPlacingComponent ? 'all' : 'inherit'}" @pointerup="onStopTrack" @pointermove="onTrack">
        <div class="toolbar">
            <div class="toolbar__categories">
                <div 
                v-for="(category, index) in categories" 
                :key='category.name' 
                :class="{'toolbar__category--active' : selectedCategory === category.name}" 
                :style="{'animation-delay': `${index * 0.1}s`}"
                class="toolbar__category"
                @click="onSelectCategory($event, category.name)">
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
            <div class="toolbar__categories" v-if="selectedSubCategory != ''" :style="{'overflow-x': isPlacingComponent ? 'hidden' : 'auto'}">
                <div
                v-for="(component, index) in activeSubCategory.components"
                :key="`${component.name}${index}`"
                class="toolbar__component"
                :style="{
                    'opacity': (stagedComponent.name === component.name && isPlacingComponent) ? '0.5' : '1',
                    'pointer-events': isPlacingComponent ? 'none' : 'inherit'}"
                @pointerenter="onStageComponent($event, component.name)"
                @pointerleave="onLeaveComponent"
                @pointerdown="onStartTrack">
                </div>
            </div>
        </div>
        <div 
        class="toolbar__preview"
        v-if="isPreviewComponent && !isPlacingComponent"
        :style="{'left': previewPosition.x + 'px', 'top': previewPosition.y + 'px'}">
            {{stagedComponentName}}
        </div>
        <div
        class="component__preview"
        v-if="isPlacingComponent"
        :style="{'left': placingPosition.x + 2 + 'px', 'top': placingPosition.y + 2 + 'px'}">
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import GrasshopperCategory from './../models/GrasshopperCategory';
import { GrasshopperComponent } from 'resthopper/dist/catalog/ComponentIndex';
import SvgarCube from 'svgar/dist/models/SvgarCube';

export default Vue.extend({
    data() {
        return {
            selectedCategory: '',
            selectedSubCategory: '',
            stagedComponent: {} as ResthopperComponent,
            isPreviewComponent: false,
            previewPosition: {} as { x: number, y: number },
            isPlacingComponent: false,
            placingPosition: {} as { x: number, y: number},
            prev: 0,
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
        },
        stagedComponentName(): string {
            return `${this.stagedComponent!.name.toLowerCase()}`;
        }
    },
    methods: {
        onSelectCategory(event: PointerEvent, category: string): void {
            this.selectedCategory = category;
            this.selectedSubCategory = '';
        },
        onStageComponent(event: PointerEvent, componentName: string): void {
            const component = Resthopper.ComponentIndex.createComponent(componentName as GrasshopperComponent);
            const el = <Element>event.srcElement;
            const pos = <DOMRect>el.getBoundingClientRect();

            this.isPreviewComponent = true;
            this.previewPosition = {
                x: pos.x,
                y: pos.y,
            }
            
            this.stagedComponent = component;
        },
        onLeaveComponent(event: PointerEvent): void {
            this.isPreviewComponent = false;
            this.previewPosition = { x: 0, y: 0 }
        },
        onStartTrack(event: PointerEvent): void {
            this.isPlacingComponent = true;
            this.placingPosition = {
                x: event.pageX,
                y: event.pageY,
            }

            this.prev = Date.now();
        },
        onTrack(event: PointerEvent): void {
            const d = Date.now();
            if (d - this.prev < 15) {
                return;
            }

            this.placingPosition = {
                x: event.pageX,
                y: event.pageY,
            }

            this.prev = d;
        },
        onStopTrack(event: PointerEvent): void {
            if (this.isPlacingComponent) {
                const svgarPosition = (<SvgarCube>this.$store.state.currentGraph.svgar)
                    .mapPageCoordinateToSvgarCoordinate(this.placingPosition.x, this.placingPosition.y);
                
                this.stagedComponent!.position = {
                    x: svgarPosition[0],
                    y: svgarPosition[1]
                }

                this.$store.dispatch('addGraphObject', this.stagedComponent)
            }

            this.isPlacingComponent = false;
            this.placingPosition = {x: 0, y: 0};
            this.prev = 0;
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
    user-select: none;

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
    min-width: var(--lg);
    min-height: var(--lg);
    margin-right: var(--md);

    box-sizing: border-box;
    border: 0.7mm solid black;
    background: white;

    animation-name: drop;
    animation-duration: 0.25s;
    animation-fill-mode: forwards;
}

.toolbar__preview {
    position: absolute;
    pointer-events: none;
    width: 30ch;
    user-select: none;

    transform: translateY(calc(var(--lg) + var(--md)));
}

.toolbar__component:hover {
    cursor: pointer;
    background: black;
}

.component__preview {
    position: absolute;
    pointer-events: none;
    width: calc(var(--lg) * 3);
    height: calc(var(--lg) * 3);
    box-sizing: border-box;

    border: 0.7mm solid black;

    animation: appear 0.35s;

    transform: translate(calc(((var(--lg) * 1.5) + 0.7mm) * -1), calc(((var(--lg) * 1.5) + 0.7mm) * -1))
}

@keyframes appear {
    from {
        width: var(--lg);
        height: var(--lg);
        transform: translate(calc(((var(--lg) * 0.5) + 0.7mm) * -1), calc(((var(--lg) * 0.5) + 0.7mm) * -1));
    }
}
</style>