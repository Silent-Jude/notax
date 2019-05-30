import {
  getBillInfos
} from '@/api/CommonApi'
// 工具栏的按钮组状态管理。
const pjyw = {
  state: {
    totalPrintCount: 0, //  总共打印页数。
    currentPageCount: 0, //  当前任务已经打印的页数。
    isPrintedOk: 0, // 当前打印任务是否成功，1成功，0不成功
    // outRangeMark: '',
    // toolBarState,工具栏的状态。0默认状态，1待添加，2待送审，3待审核，4已审核,5仅供展示数据。
    toolBarState: 0,
    //  selectedNodeInfo: {},
    updateMark: false,
    currentRowIndex: 0, // 记录行标
    sendAuditUpdateMark: false,
    initBillInfos: [] // 所有票种信息
  },
  mutations: {
    // SET_OUTRANGEMARK: (state, val) => {
    //   state.outRangeMark = val
    // },
    SET_ISPRINTEDOK: (state, val) => {
      state.isPrintedOk = val
    },
    SET_CURRENTPAGECOUNT: (state, val) => {
      state.currentPageCount = val
    },
    SET_TOTALPRINTCOUNT: (state, val) => {
      console.log('收到了')
      state.totalPrintCount = val
    },
    SET_BILLINFOS: (state, val) => {
      state.initBillInfos = val
    },
    SET_TOOLBARSTATE: (state, value) => {
      state.toolBarState = value
    },
    //  SET_SELECTEDNODEINFO: (state, value) => {
    //    state.selectedNodeInfo = value
    //  },
    SET_UPDATEMARK: (state, bool) => {
      state.updateMark = bool
    },
    SET_CURRENTROWINDEX: (state, value) => {
      state.currentRowIndex = value
    },
    SET_SENDAUDITUPDATEMARK: (state, bool) => {
      state.sendAuditUpdateMark = bool
    }
  },
  actions: {
    // Set_OutRangeMark: ({ commit }, val) => {
    //   commit('SET_OUTRANGEMARK', val)
    // },

    SetIsPrintedOk: ({ commit }, value) => {
      commit('SET_ISPRINTEDOK', value)
    },
    SetCurrentPageCount: ({ commit }, value) => {
      commit('SET_CURRENTPAGECOUNT', value)
    },
    SetTotalPrintCount: ({ commit }, value) => {
      commit('SET_TOTALPRINTCOUNT', value)
    },
    set_BillInfos: ({
      commit
    }) => {
      var result = null
      getBillInfos().then(
        res => {
          result = JSON.parse(JSON.stringify(res.data))
          commit('SET_BILLINFOS', result)
        }
      )
    },
    SetSendAuditUpdateMark: ({
      commit
    }, bool) => {
      commit('SET_SENDAUDITUPDATEMARK', bool)
    },
    SetUpdateMark: ({
      commit
    }, bool) => {
      commit('SET_UPDATEMARK', bool)
    },
    SetToolBarState: ({
      commit
    }, toolBarState) => {
      commit('SET_TOOLBARSTATE', toolBarState)
    },
    //  SetSelectedNodeInfo: ({
    //    commit
    //  }, nodeObject) => {
    //    commit('SET_SELECTEDNODEINFO', nodeObject)
    //  },
    SetCurrentRowIndex: ({
      commit
    }, currentRowIndex) => {
      commit('SET_CURRENTROWINDEX', currentRowIndex)
    }
  }
}

export default pjyw
