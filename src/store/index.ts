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

export default new Vuex.Store({
  state: {
    index: [] as ResthopperComponent[],
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
    addGraphObject(state, object: GlasshopperGraphObject) {
      state.currentGraph.addObject(object);
    },
    initializeGraph(state) {
      state.currentGraph = new GlasshopperGraph();
    },
    redrawGraph(state: any, s: { w: number, h: number }) {
      state.currentGraph.redraw(s.w, s.h);
    }
  },
  actions: {
    loadAllComponents(context) {
      if (context.state.index.length == 0) {
        context.commit('cacheComponentIndex', Resthopper.ComponentIndex.getAllComponents());
      }
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
    }
  },
  modules: {
  }
})
