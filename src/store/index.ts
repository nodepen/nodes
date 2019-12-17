import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
import GlasshopperGraph from '@/models/GlasshopperGraph';
import { GrasshopperComponent } from 'resthopper/dist/catalog/ComponentIndex';
import GlasshopperGraphObject from '@/models/GlasshopperGraphObject';
import { getGraphObjectByComponent } from '@/services/GraphObjectService';

Vue.use(Vuex)

interface GraphMapping {
  [svgarGuid: string]: {
      objectGuid: string,
      componentGuid: string,
      parameterGuid: string,
  }
}

export default new Vuex.Store({
  state: {
    index: [] as ResthopperComponent[],
    map: {} as GraphMapping,
    allCategories: [] as string[],
    component: {} as ResthopperComponent | undefined,
    parameter: {} as ResthopperParameter | undefined,
    currentGraph: {} as GlasshopperGraph,
  },
  mutations: {
    setActiveComponent(state, component: ResthopperComponent) {
      state.component = component;
    },
    setActiveParameter(state, parameter: ResthopperParameter) {
      state.parameter = parameter;
    },
    cacheComponentIndex(state, components: ResthopperComponent[]) {
      state.index = components;
    },
    cacheComponentCategories(state, categories: string[]) {
      state.allCategories = categories;
    },
    addGraphObject(state, object: GlasshopperGraphObject) {
      state.currentGraph.addObject(object);
    },
    initializeGraph(state) {
      state.currentGraph = new GlasshopperGraph();
    },
    redrawGraph(state: any, s: { w: number, h: number }) {
      state.currentGraph.redraw(s.w, s.h);
    },
    activateEvents(state) {
      state.currentGraph.svgar.listen();
    }
  },
  actions: {
    loadAllComponents(context) {
      if (context.state.index.length == 0) {
        const components = Resthopper.ComponentIndex.getAllComponents();
        context.commit('cacheComponentIndex', components);
      }

      let categories: string[] = [];

      context.state.index.forEach(c => {
        if (!categories.includes(c.category)) {
          categories.push(c.category);
        }
      });

      context.commit('cacheComponentCategories', categories);
    },
    initializeGraph(context) {
      context.commit('initializeGraph');
    },
    addGraphObject(context, component: GrasshopperComponent) {
      const c = Resthopper.ComponentIndex.createComponent(component);
      const graphObject = getGraphObjectByComponent(c);

      context.commit('addGraphObject', graphObject);
      // Locate graph object class with service
      // Add to graph
    },
    redrawGraph(context: any, s: { w: number, h: number }) {
      context.commit('redrawGraph', s);

      // TODO: so bad, but it works for now
      setTimeout(() => context.commit('activateEvents'), 50);
    }
  },
  modules: {
  }
})
