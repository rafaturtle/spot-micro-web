import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
     state : {
       imageUrl: null
     },
  getters : {},
  mutations : {
    UPDATE_IMAGE : (state,payload) => {
      console.log('mutation run')
      state.imageUrl = payload;
    },
  },
  actions : {
    UPDATE_IMAGE ({ commit, state}, payload) {
      console.log('action run'  + state + payload);
      if (state.imageUrl != payload){
        commit('UPDATE_IMAGE', payload);      
      }
    }
  }
})