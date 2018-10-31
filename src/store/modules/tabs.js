const state = {
  tabs: [],
  activeTabs: ''
}

const mutations = {
  // 新增标签
  ADDTABS (state, data) {
    state.tabs.push(data)
    state.activeTabs = data.route
  },
  // 设置当前激活标签
  SETACTIVETABS (state, data) {
    state.activeTabs = data
  },
  // 删除标签
  DELETETABS (state, data) {
    let [tabs, activeName] = [state.tabs, state.activeTabs]
    if (activeName === data) {
      tabs.forEach((tab, index) => {
        if (tab.route === data) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.route
            console.log(activeName)
          }
        }
      })
    }
    state.activeTabs = activeName
    state.tabs = tabs.filter(tab => tab.route !== data)
  },
  // 关闭其他
  CLOSEOTHER (state) {
    let [tabs, activeName, indexActive] = [state.tabs, state.activeTabs, null]
    tabs.forEach((tab, index) => {
      if (tab.route === activeName) {
        indexActive = index
      }
    })
    let [arr1, arr2] = [tabs[0], tabs[indexActive]]
    state.tabs = []
    if (activeName === '/main') {
      state.tabs.push(arr1)
    } else {
      state.tabs.push(arr1, arr2)
    }
  },
  // 关闭所有
  CLOSEALL (state) {
    let arr1 = state.tabs[0]
    state.tabs = []
    state.tabs.push(arr1)
  }
}

const actions = {
  addTabs ({commit}, data) {
    commit('ADDTABS', data)
  },
  setActiveTabs ({commit}, data) {
    commit('SETACTIVETABS', data)
  },
  deleteTabs ({commit}, data) {
    commit('DELETETABS', data)
  },
  closeOther ({commit}, data) {
    commit('CLOSEOTHER', data)
  },
  closeAll ({commit}, data) {
    commit('CLOSEALL', data)
    commit('SETACTIVETABS', '/main')
  }
}

export default {
  state,
  actions,
  mutations
}
