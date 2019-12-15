import Vue from 'vue'
import Vuex from 'vuex'
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';
import GlasshopperGraph from '@/models/GlasshopperGraph';
import { GrasshopperComponent } from 'resthopper/dist/catalog/ComponentIndex';
import GlasshopperGraphObject from '@/models/GlasshopperGraphObject';

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
    }
  },
  actions: {
    loadAllComponents(context) {
      if (context.state.index.length == 0) {
        context.commit('cacheComponentIndex', Resthopper.ComponentIndex.getAllComponents());
      }
    },
    addGraphObject(context, component: GrasshopperComponent, position: {x: number, y: number} = {x: 0, y: 0}) {
      const c = Resthopper.ComponentIndex.createComponent(component);
      // Locate graph object class with service
      // Add to graph
    }
  },
  modules: {
  }
})
