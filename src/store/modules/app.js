// import { getTableListInfo } from '@/api/getTableListInfo'
import Cookies from 'js-cookie'
import {
  deepClone
} from '@/utils/Common'

const app = {
  state: {
    allCodeLabelDictionary: {},
    selectedBillRowGuid: '',
    mainHeight: 300,
    selectedTargetTab: null,
    // 保存取消按钮禁用状态
    // isdisabled: true,
    // 保存按钮提交表单，0禁用1添加2修改
    savestate: 0,
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    listInfo: [{
      date: '',
      name: ''
    }],
    selectedSubMenuGuid: '',
    detailInfo: {
      mainstoragemark: 0,
      isenabled: 1,
      basRemittedbank: {},
      basChargeagency: {},
      basChargetype: {},
      basFundtype: {},
      basBudgetsubject: {},
      accAccounts: {}
    },
    selectedTabsId: 0,
    expandedNode: ['-1'],
    currendNodeIndex: 0,
    inputSearchValue: '',
    inputSearchType: '',
    selectedNodeInfo: {
      state: {}
    }
  },
  mutations: {
    SET_ALLCODELABELDICTIONARY: (state, object) => {
      state.allCodeLabelDictionary = object
    },
    SET_SELECTEDBILLROWGUID: (state, guid) => {
      state.selectedBillRowGuid = guid
    },
    SET_MAINHEIGHT: (state, height) => {
      state.mainHeight = height
      console.log('设置好了高度，高度是：', height)
    },
    SET_TARGET: (state, obj) => {
      state.selectedTargetTab = obj
    },
    SET_SELECTEDNODEINFO: (state, value) => {
      state.selectedNodeInfo = value
    },
    SET_INPUTSEARCHVALUE: (state, value) => {
      state.inputSearchValue = value
    },
    SET_SEARCHTYPE: (state, value) => {
      state.inputSearchType = value
    },
    SET_EXPANDEDNODE: (state, nodeArr) => {
      state.expandedNode = [...nodeArr]
    },
    SET_CURRENTNODEINDEX: (state, nodeIndex) => {
      state.currendNodeIndex = nodeIndex
    },
    SET_SELECTEDTABSID: (state, tabsId) => {
      state.selectedTabsId = tabsId
      // console.log('当前激活的tabs是' + state.selectedTabsId)
    },
    SET_DETAILINFO: (state, detailInfo) => {
      console.log('收到的detailInfo为：', detailInfo)
      // detailInfo
      // 坑爹。后台如果传一个空的detailInfo，导致isenabled未undefined，而vue中已经存在的对象属性的值改变，也不会刷新页面重新渲染。进而导致el-radio失效。
      if (detailInfo.isenabled === undefined) {
        detailInfo.isenabled = 1
        detailInfo.mainstoragemark = 0
      }
      var data = deepClone(detailInfo)
      state.detailInfo = data
    },
    INITDETAILINFO: (state) => {
      state.detailInfo = {
        mainstoragemark: 0,
        isenabled: 1,
        basRemittedbank: {},
        basChargeagency: {},
        basChargetype: {},
        basFundtype: {},
        basBudgetsubject: {},
        accAccounts: {}
      }
      console.log('初始化了detailinfo')
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    // 列表信息数据。
    SET_LISTINFO: (state, tableArray) => {
      state.listInfo = [...tableArray]
      console.log('收到的列表信息为：', state.listInfo)
    },
    SET_SUBMENUGUID: (state, guid) => {
      state.selectedSubMenuGuid = guid
    },
    // 保存按钮提交表单，number0禁用1添加2修改
    SET_SAVESTATE: (state, number) => {
      state.savestate = number
    }
  },
  actions: {
    set_allcodelabeldictionary: ({ commit }, object) => {
      commit('SET_ALLCODELABELDICTIONARY', object)
    },
    Set_SelectedBillRowGuid: ({ commit }, guid) => {
      commit('SET_SELECTEDBILLROWGUID', guid)
    },
    SetSubMenuGuid: ({ commit }, guid) => {
      commit('SET_SUBMENUGUID', guid)
    },
    SetMainHeight: ({ commit }, height) => {
      commit('SET_MAINHEIGHT', height)
    },
    SetTarget: ({ commit }, targetObj) => {
      commit('SET_TARGET', targetObj)
    },
    // ChangeTabsArray: ({ commit }, index) => {
    //   commit('CHANGETABSARRAY', index)
    // },
    SetSelectedNodeInfo: ({
      commit
    }, nodeObject) => {
      commit('SET_SELECTEDNODEINFO', nodeObject)
    },
    SetListInfo: ({
      commit
    }, tableArray) => {
      commit('SET_LISTINFO', tableArray)
    },
    SetDetailInfo: ({
      commit
    }, detailInfo) => {
      commit('SET_DETAILINFO', detailInfo)
    },
    InitDetailInfo: ({ commit }) => {
      commit('INITDETAILINFO')
    },
    SetSelectedTabsId: ({
      commit
    }, tabsId) => {
      commit('SET_SELECTEDTABSID', tabsId)
    },
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({
      commit
    }, {
      withoutAnimation
    }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({
      commit
    }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SETSAVESTATE: ({
      commit
    }, number) => {
      commit('SET_SAVESTATE', number)
    }
    // 调用getTableListInfo
    // GetListInfo({ commit }, guid) {
    //   return new Promise((resolve, reject) => {
    //     // getTableListInfo应该有参数guid，但是接口没写。
    //     getTableListInfo().then(res => {
    //       // console.log(res.data)
    //       commit('GET_LISTINFO', res.data)
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default app
