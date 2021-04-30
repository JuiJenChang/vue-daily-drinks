import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orderList: [],
    orderNumber: 0
  },
  mutations: {
    CREATE_ORDER(state, data) {
      state.orderList = [...state.orderList, data]
    },
    ADD_ORDER_NUMBER(state) {
      if (state.orderList.length === 0) {
        state.orderNumber = 1
      } else {
        state.orderNumber = state.orderList[state.orderList.length - 1].orderNumber + 1
      }
    },
    DELETE_ORDER(state, id) {
      state.orderList = state.orderList.filter(item => item.id !== id)
    },
    ADD_DRINK(state, data) {
      state.orderList.forEach(item => {
        if (item.id === data.id) {
          item.list.push(data.item)
        }
      })
    },
    EDIT_DRINK(state, data) {
      state.orderList.forEach(item => {
        if (item.id === data.id) {
          item.list = data.list
        }
      })
    },
    DELETE_DRINK(state, data) {
      state.orderList.forEach(item => {
        if (item.id === data.orderId) {
          item.list = item.list.filter(item => item.id !== data.drinkId)
        }
      })
    }
  },
  actions: {}
}) 