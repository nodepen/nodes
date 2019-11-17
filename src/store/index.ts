import Vue from 'vue'
import Vuex from 'vuex'
import Resthopper from 'resthopper';
import ResthopperComponent from 'resthopper/dist/models/ResthopperComponent';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    component: {} as ResthopperComponent,
  },
  mutations: {
    setActiveComponent(state, component: ResthopperComponent) {
      state.component = component;
    }
  },
  actions: {
  },
  modules: {
  }
})
