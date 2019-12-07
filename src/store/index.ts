import Vue from 'vue'
import Vuex from 'vuex'
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';
import ResthopperParameter from 'resthopper/dist/models/ResthopperParameter';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    component: {} as ResthopperComponent | undefined,
    parameter: {} as ResthopperParameter | undefined,
  },
  mutations: {
    setActiveComponent(state, component: ResthopperComponent) {
      state.component = component;
    },
    setActiveParameter(state, parameter: ResthopperParameter) {
      state.parameter = parameter;
    }
  },
  actions: {
  },
  modules: {
  }
})
