<template>
    <div id="sandbox" :style="{'pointer-events': isPlacingComponent ? 'all' : 'inherit'}" @pointerup="onStopTrack" @pointermove="onTrack">
        <div class="toolbar" :style="{'pointer-events': isPlacingComponent ? 'none' : 'inherit'}">
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
            <div class="toolbar__categories toolbar__components" v-if="selectedSubCategory != ''" :style="{'overflow-x': isPlacingComponent ? 'hidden' : 'auto'}">
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
        <div v-if="selectedComponentExists" :key="selectedComponent.guid" class="component">
            <div class="component__title">
                {{ selectedComponentTitle }}
            </div>
            <div class="component__categories">
                {{ selectedComponentCategories }}
            </div>
            <div class="component__content">
                {{ selectedComponentDescription }}
            </div>
            <div 
            class="component__parameter" 
            v-for="(param, index) of selectedComponentParameters" 
            :key="param.nickName + index"
            :style="{'margin-bottom': index === selectedComponentInputParameters.length - 1 ? 'calc(var(--md) + var(--sm))' : 'var(--md)'}">
                <div class="component__parameter__label">
                    <div class="component__parameter__icon">
                        <svg width="100%" height="100%" viewBox='-1.1 -1.1 2.2 2.2'>
                            <polyline 
                            vector-effect="non-scaling-stroke" 
                            stroke="black" 
                            stroke-width="0.7mm" 
                            fill="none" 
                            points="0,0.866 -0.5,0.866 0.5,0.866 1,0 0.5,-0.866 -0.5,-0.866 -1,0 -0.5,0.866 0,0.866" />
                        </svg>
                    </div>
                    <div class="component__parameter__name" @pointerdown="onToggleParameter($event, param)">
                        {{ param.name.toLowerCase() }} ({{ param.nickName.toLowerCase() }})
                    </div>
                </div>
                <div v-if="openParameterGuids.includes(param.instanceGuid)" class="component__parameter__info">
                    <div class="component__parameter__entry">
                        {{ param.description.toLowerCase() }}
                    </div>
                    <div class="component__parameter__entry" v-if="index < selectedComponentInputParameters.length">
                        source - {{ parameterIdToSourceName(param.instanceGuid).toLowerCase() }} <span v-if="parameterIdToSourceName(param.instanceGuid).toLowerCase() === 'no sources'">[ <span contenteditable="true" @input="onSetParameterValue($event, param.instanceGuid)">set value</span> ]</span>
                    </div>
                    <div class="component__parameter__entry" style="margin-bottom: calc(var(--md) + var(--sm));">
                        type - {{ param.typeName.toLowerCase() }}
                    </div>
                    <div class="component__parameter__entry" >
                        {{ selectedObject.cache[param.instanceGuid].length }} {{ selectedObject.cache[param.instanceGuid].length === 1 ? 'value' : 'values'}} -
                    </div>
                    <div class="component__parameter__values" v-if="selectedObject.cache[param.instanceGuid].length > 0">
                        <div class="component__parameter__branch" v-for="(entry, index) in selectedObject.cache[param.instanceGuid]" :key="index + param.instanceGuid">
                            <div class="component__parameter__value">
                                {{ pathToString(entry.path) }}
                            </div>
                            <div class="component__parameter__value" v-for="(value, i) in entry.values" :key="i + value.type">
                                {{ value.index }} : {{ valueToString(value) }}
                            </div>
                        </div>
                    </div>
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
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
import GrasshopperCategory from './../models/GrasshopperCategory';
import { GrasshopperComponent } from 'resthopper/dist/catalog/ComponentIndex';
import SvgarCube from 'svgar/dist/models/SvgarCube';
import GlasshopperGraphObject from '../models/GlasshopperGraphObject';

export default Vue.extend({
    data() {
        return {
            selectedCategory: '',
            selectedSubCategory: '',
            selectedComponentCategory: 'output',
            openParameterGuids: [] as string[],
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
        },
        selectedObject(): GlasshopperGraphObject | undefined {
            return this.$store.state.currentGraph.graphObjects.find((x:GlasshopperGraphObject) => x.component.guid === this.$store.state.component.guid);
        },
        selectedComponent(): ResthopperComponent | undefined {
            return this.$store.state.component;
        },
        selectedComponentExists(): boolean {
            try {
                const n = this.$store.state.component.name.toLowerCase();
                return true;
            }
            catch {
                return false;
            }
        },
        selectedComponentTitle(): string {
            const c: ResthopperComponent = this.$store.state.component;
            if (c.name === undefined) {
                return '';
            }
            return c.name.toLowerCase();
        },
        selectedComponentCategories(): string {
            const c: ResthopperComponent = this.$store.state.component;
            if (c.category === undefined) {
                return '';
            }
            return `${c.category.toLowerCase()} > ${c.subCategory.toLowerCase()}`;
        },
        selectedComponentDescription(): string {
            const c: ResthopperComponent = this.$store.state.component;
            if (c.description === undefined) {
                return '';
            }
            return c.description.toLowerCase();
        },
        selectedComponentParameters(): ResthopperParameter[] {
            const c: ResthopperComponent = this.$store.state.component;
            if (c.name === undefined) {
                return [];
            }
            return [...c.getAllInputs().reverse(), ...c.getAllOutputs().reverse()];
        },
        selectedComponentInputParameters(): ResthopperParameter[] {
            const c: ResthopperComponent = this.$store.state.component;
            if (c.name === undefined) {
                return [];
            }
            return c.getAllInputs();
        },
        selectedComponentOutputParameters(): ResthopperParameter[] {
            const c: ResthopperComponent = this.$store.state.component;
            if (c.name === undefined) {
                return [];
            }
            return c.getAllOutputs();
        }
    },
    methods: {
        test(): void {
            console.log('test');
        },
        onSetParameterValue(event: InputEvent, guid: string): void {
            console.log(guid);
            const p: ResthopperParameter = this.$store.state.currentGraph.locateParameter(guid);
            const el: Element = event.target as Element;

            if (p === undefined) {
                return;
            }

            let stringValue = el.textContent ?? '';
            let numberValue = stringValue === '' ? NaN : +stringValue ?? NaN;

            if (p.typeName.toLowerCase() === 'number') {
                if (Number.isNaN(numberValue)) {
                    return;
                }
                p.values = [numberValue]
                console.log(p.values);
            }
            else if (p.typeName.toLowerCase() === 'text') {
                if (stringValue === '') {
                    return;
                }
                p.values = [stringValue];
                console.log(p.values)
            }

            this.$store.state.currentGraph.computeAll();
        },
        onSelectCategory(event: PointerEvent, category: string): void {
            this.selectedCategory = category;
            this.selectedSubCategory = '';
        },
        onSelectComponentCategory(event: MouseEvent, category: string): void {
            this.selectedComponentCategory = category;
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
        onToggleParameter(event: PointerEvent, parameter: ResthopperParameter): void {
            if (this.openParameterGuids.includes(parameter.instanceGuid)) {
                this.openParameterGuids = this.openParameterGuids.filter(x => x != parameter.instanceGuid);
            }
            else {
                this.openParameterGuids.push(parameter.instanceGuid);
            }
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
            event.preventDefault();

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
                const [x, y] = (<SvgarCube>this.$store.state.currentGraph.svgar)
                    .mapPageCoordinateToSvgarCoordinate(this.placingPosition.x, this.placingPosition.y);
                
                this.stagedComponent!.position = {
                    x: x,
                    y: y
                }

                this.$store.dispatch('addGraphObject', this.stagedComponent)
            }

            this.isPlacingComponent = false;
            this.placingPosition = {x: 0, y: 0};
            this.prev = 0;
        },
        entryToString(entry: { path: number[], type: string, value: any }): string {
            const n = entry.path.length;
            return `{${entry.path.slice(0, n - 1).join(';')};} [${entry.path[n - 1]}] ${entry.type === 'GH_Number' ? entry.value : entry.type.toLowerCase().replace('gh_', '')}`;
        },
        valueToString(value: { index: number, type: string, value: any }): string {
            switch(value.type) {
                case 'GH_Number':
                    return value.value;
                default:
                    return value.type.toLowerCase().replace('gh_', '');
            }
        },
        pathToString(path: number[]): string {
            return `{ ${path.join(';')}; }`;
        },
        parameterIdToSourceName(id: string): string {
            const param: ResthopperParameter = this.$store.state.currentGraph.locateParameter(id);
            if (param.sources.length === 0) {
                return 'no sources'
            }

            const source = this.$store.state.currentGraph.locateComponentByParameter(param.getSource());

            return source.name;
        }
    }
})
</script>

<style scoped>
#sandbox {
    width: 100%;
    height: 100%;

    pointer-events: none;
    touch-action: none;

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

@keyframes grow {
    from {
        height: 0%;
    }
}

.toolbar__categories {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: var(--sm);
    user-select: none;

    overflow-x: auto;
}

.toolbar__components {
    margin-bottom: calc(var(--md) * 3);
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
    background: none;

    user-select: none;
    touch-action: none;

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

    touch-action: none;

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

@keyframes fromleft {
    from {
        transform: translateX(calc(100vw * -1));
    }
}

.component {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;

    pointer-events: none !important;
}

.component > *:not(.toolbar__categories) {
    animation: fromleft 0.5s;
    pointer-events: none !important;
}

.component > .toolbar__categories > .toolbar__category {
    animation-delay: 0.5s;
    opacity: 0;
    animation-fill-mode: forwards;
}

.component__title {
    width: 100%;
    font-size: var(--lg);

    margin-bottom: var(--md);

    pointer-events: none;
}

.component__categories {
    width: 100%;
    font-size: var(--md);

    margin-bottom: var(--md);

    pointer-events: none;
}

.component__subtitle {
    width: 100%;
    font-size: var(--sm);

    margin-bottom: var(--sm);

    pointer-events: none;
}

.component__content {
    width: 100%;
    font-size: var(--md);

    margin-bottom: calc(var(--md) + var(--sm));

    pointer-events: none;
}

.component__parameter {
    margin-bottom: var(--md);

    pointer-events: none !important;
}

.component__parameter > * {
    pointer-events: none !important;
}

.component__parameter__label {
    height: var(--lg);

    user-select: none;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.component__parameter__icon {
    width: var(--lg);
    height: 100%;

    margin-right: var(--md);
}

.component__parameter__name {
    height: 100%;
    line-height: var(--lg);
    vertical-align: middle;
    pointer-events: all;
}

.component__parameter__name:hover {
    cursor: pointer;
}

.component__parameter__info {
    padding-left: calc(var(--lg) + var(--md));
}

.component__parameter__entry {
    height: var(--md);
    margin-top: var(--md);
}

.component__parameter__values {
    margin-top: var(--md);
    max-height: calc(var(--md) * 4.5);
    max-width: 40ch;
    overflow-y: auto;
}

.component__parameter__branch {
    pointer-events: none !important;
}

.component__parameter__value {
    margin-bottom: var(--md);

    pointer-events: none !important;
}
</style>