// 工具栏的按钮组状态管理。
const sjqx = {
  state: {
    rightTreeExpandedNode: ['-1'],
    selectedLeftTreeNodeGuid: '',
    leftTreeNodeFamilyIdList: [],
    rightSearchValue: '',
    rightSearchType: '',
    currentNodeIndexRight: 0,
    exchangeState: 'normal'
    // grantState: false
  },
  mutations: {
    SET_EXCHANGESTATE: (state, val) => {
      if (val !== undefined) {
        state.exchangeState = val
      } else {
        if (state.exchangeState === 'normal') {
          state.exchangeState = 'reverse'
        } else {
          state.exchangeState = 'normal'
        }
      }
    },
    SET_RIGHTTREEEXPANDEDNODE: (state, nodeArr) => {
      state.expandedNode = [...nodeArr]
    },
    SET_SELECTEDLEFTTREENODEGUID: (state, nodeObject) => {
      state.selectedLeftTreeNodeGuid = JSON.parse(JSON.stringify(nodeObject))
    },
    SET_LEFTTREENODEFAMILYIDLIST: (state, idArr) => {
      state.leftTreeNodeFamilyIdList = idArr
      console.log('收到的数组是：', idArr)
    },
    SET_RIGHTSEARCHVALUE: (state, value) => {
      state.rightSearchValue = value
    },
    SET_RIGHTSEARCHTYPE: (state, value) => {
      state.rightSearchType = value
    },
    SET_CURRENTNODEINDEXRIGHT: (state, nodeIndex) => {
      state.currentNodeIndexRight = nodeIndex
    }
    // SET_GRANTSTATE: (state, bool) => {
    //   state.grantState = bool
    // }

  },
  actions: {
    SetExchangeState: ({
      commit
    }, val) => {
      commit('SET_EXCHANGESTATE', val)
    },
    SetRightTreeExpandedNode: ({
      commit
    }, nodeArr) => {
      commit('SET_RIGHTTREEEXPANDEDNODE', nodeArr)
    },
    SetSelectedLeftTreeNodeGuid: ({
      commit
    }, nodeObject) => {
      commit('SET_SELECTEDLEFTTREENODEGUID', nodeObject)
    },
    SetLeftTreeNodeFamilyIdList: ({
      commit
    }, idArr) => {
      commit('SET_LEFTTREENODEFAMILYIDLIST', idArr)
    }
  }
}

export default sjqx
