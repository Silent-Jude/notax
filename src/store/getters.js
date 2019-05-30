const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  // isdisabled: state => state.app.isdisabled,
  savestate: state => state.app.savestate,
  currentRowIndex: state => state.pjyw.currentRowIndex,
  grantState: state => state.sjqx.grantState
}
export default getters
