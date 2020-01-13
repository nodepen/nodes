import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
import GlasshopperGraph from '@/models/GlasshopperGraph';
import { GrasshopperComponent } from 'resthopper/dist/catalog/ComponentIndex';
import GlasshopperGraphObject from '@/models/GlasshopperGraphObject';
import { getGraphObjectByComponent } from '@/services/GraphObjectService';
import GrasshopperCategory from '@/models/GrasshopperCategory';
import GraphMapping from '@/models/GlasshopperGraphMapping';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    index: [] as ResthopperComponent[],
    map: {} as GraphMapping,
    configuration: [] as GrasshopperCategory[],
    allCategories: [] as string[],
    component: {} as ResthopperComponent | undefined,
    parameter: {} as ResthopperParameter | undefined,
    currentGraph: {} as GlasshopperGraph,
    focus: 'graph' as 'graph' | 'scene'
  },
  mutations: {
    setActiveComponent(state, component: ResthopperComponent) {
      state.component = component;
    },
    setActiveParameter(state, parameter: ResthopperParameter) {
      state.parameter = parameter;
    },
    clearSelection(state) {
      state.component = undefined;
      state.parameter = undefined;
    },
    cacheComponentIndex(state, components: ResthopperComponent[]) {
      state.index = components;
    },
    cacheComponentCategories(state, categories: string[]) {
      state.allCategories = categories;
    },
    cacheConfiguration(state, categories: GrasshopperCategory[]) {
      state.configuration = categories;
    },
    addGraphObject(state, object: GlasshopperGraphObject) {
      state.currentGraph.addObject(object);
    },
    initializeGraph(state) {
      state.currentGraph = new GlasshopperGraph();
    },
    redrawGraph(state: any, s: { w: number; h: number }) {
      state.currentGraph.redraw(s.w, s.h);
    },
    activateEvents(state) {
      state.currentGraph.svgar.listen();
    },
    updateMap(state, mapping: GraphMapping) {
      Object.assign(state.map, mapping);
    },
    resetMap(state) {
      state.map = {};
      state.currentGraph.reset();
    },
    setFocus(state, target: 'graph' | 'scene') {
      state.focus = target;
    }
  },
  actions: {
    loadAllComponents(context) {
      if (context.state.index.length == 0) {
        const components = Resthopper.ComponentIndex.getAllComponents();
        context.commit('cacheComponentIndex', components);
      }

      const configuration: GrasshopperCategory[] = [];

      context.state.index.forEach(c => {
        // Instatiate top-level category if it does not already exist
        if (!configuration.map(x => x.name).includes(c.category)) {
          configuration.push({
            name: c.category,
            subCategories: []
          })
        }

        const category = configuration.find(x => x.name == c.category)!;

        // Instantiate subcategory if it does not already exist
        if (!category.subCategories.map(x => x.name).includes(c.subCategory)) {
          category.subCategories.push({
            name: c.subCategory,
            components: []
          })
        }

        const subCategory = category.subCategories.find(x => x.name == c.subCategory)!;

        // Add component to subcategory
        subCategory.components.push({ name: c.name });
        
      });

      context.commit('cacheConfiguration', configuration);
    },
    initializeGraph(context) {
      context.commit('initializeGraph');
    },
    addGraphObject(context, component: ResthopperComponent) {
      const graphObject = getGraphObjectByComponent(component);
      context.commit('addGraphObject', graphObject);
      context.commit('resetMap');

      // Locate graph object class with service
      // Add to graph
    },
    redrawGraph(context: any, s: { w: number; h: number }) {
      context.commit('redrawGraph', s);
    },
    updateMap(context, map: GraphMapping) {
      context.commit('updateMap', map);
    },
    setActiveComponentById(context, guid: string) {
      const component = context.state.currentGraph.locateComponent(guid);
      if (component === undefined) {
        return;
      }
      context.commit('setActiveComponent', component);
    },
    setActiveComponentByReference(context, component: ResthopperComponent) {
      context.commit('setActiveComponent', component);
    },
    clearSelection(context) {
      context.commit('clearSelection');
    },
    toggleFocus(context) {
      if (context.state.focus === 'graph') {
        context.commit('setFocus', 'scene');
      }
      else {
        context.commit('setFocus', 'graph');
      }
    }
  },
  modules: {
  }
})
