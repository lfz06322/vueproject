import axios from 'axios';
import { loginreq, req } from './axiosFun';

// 登录接口
export const login = (params) => { return loginreq("post", "/api/login", params) };
// 登录接口
export const getcode = (params) => { return loginreq("post", "/api/checkCode/checkImg", params) };
// 获取用户菜单
export const menu = (params) => { return axios.get("/api/menu?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 退出接口
export const loginout = () => { return axios.delete("/api/login?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 用户管理
 **/
// 用户管理-获取用户列表
export const userList = (params) => { return req("post", "/api/user/findAll", params) };
// 用户管理-保存
export const userSave = (params) => { return req("post", "/api/user/addUser", params) };
// 用户管理-编辑
export const userUpdate = (params) => { return req("post", "/api/user/update", params) };
// 用户管理-删除用户
export const userDelete = (params) => { return axios.delete("/api/user/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 用户管理-重置密码
export const userPwd = (params) => { return req("post", "/api/User/pwd", params) };
// 用户管理-修改状态
export const userLock = (params) => { return axios.get("/api/user/state?id=" + params.id + "&state=" + params.state + "&token=" + localStorage.getItem('logintoken')) };
// 用户管理-数据权限
export const UserDeptTree = (params) => { return axios.get("/api/userRole/findAll?id=" + params + "&token=" + localStorage.getItem('logintoken')) };
// 用户管理-数据权限保存
export const UserDeptSave = (params) => { return req("post", "/api/userRole/save", params) };
// 用户管理-获取部门设置
export const UserDeptdeptTree = (params) => { return axios.get("/api/UserDept/deptTree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 用户管理-保存部门设置
export const UserChangeDept = (params) => { return req("post", "/api/User/change/dept", params) };
// 用户管理-用户下线
export const userExpireToken = (params) => { return req("get", "/api/User/expireToken/" + params, {}) };
// 用户管理-刷新缓存
export const userFlashCache = (params) => { return req("get", "/api/User/flashCache/" + params, {}) };

/**
 * 菜单管理
 **/
// // 菜单管理-获取菜单Module/list
// export const ModuleList = () => { return req("post", "/api/Module/list") };
// // 菜单管理-根据菜单获取数据
// export const ModuleGet = (params) => { return axios.get("/api/Module/get/" + params + "?token=" + localStorage.getItem('logintoken')) };
// // 菜单管理-获取父级菜单Module/nodes
// export const ModuleNodes = (params) => { return req("post", "/api/Module/nodes", params) };
// // 菜单管理-修改菜单
// export const ModuleSave = (params) => { return req("post", "/api/Module/save", params) };
// // 菜单管理-删除菜单
// export const ModuleDelete = (params) => { return axios.delete("/api/Module/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 角色管理
 **/
// 角色管理-获取角色列表
export const roleList = (params) => { return req("post", "/api/role/findAll", params) };
// 角色管理-保存（添加编辑）
export const roleSave = (params) => { return req("post", "/api/role/add", params) };
// 角色管理-编辑
export const roleUpdate = (params) => { return req("post", "/api/role/update", params) };
// 角色管理-角色状态
export const roleState = (params) => { return req("post", "/api/role/state", params) };
// 角色管理-删除角色
export const roleDelete = (params) => { return axios.delete("/api/role/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 角色管理-菜单权限（获取）
export const RoleRightTree = (params) => { return axios.get("/api/jur/role?id=" + params + "&token=" + localStorage.getItem('logintoken')) };
// 角色管理-菜单权限（保存）
export const RoleRightSave = (params) => { return req("post", "/api/jur/save", params) };

/**
 * 公司管理
 **/
// 公司管理-获取公司列表
export const deptList = (params) => { return req("post", "/api/Dept/list", params) };
// 公司管理-保存（添加编辑）
export const deptSave = (params) => { return req("post", "/api/Dept/save", params) };
// 公司管理-删除公司
export const deptDelete = (params) => { return axios.get("/api/Dept/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 系统环境变量
 **/
// 系统环境变量-获取系统环境变量列表
export const variableList = (params) => { return req("post", "/api/Variable/list", params) };
// 系统环境变量-保存（添加编辑）
export const variableSave = (params) => { return req("post", "/api/Variable/save", params) };
// 系统环境变量-删除系统环境变量
export const variableDelete = (params) => { return axios.delete("/api/Variable/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 权限管理
 **/
// 权限管理-获取权限列表
export const menuList = (params) => { return req("post", "/api/menu/query", params) };
// 权限管理-保存权限
export const menuAdd = (params) => { return req("post", "/api/menu/add", params) };
// 权限管理-保存权限
export const menuParentList = (params) => { return req("post", "/api/menu/father", params) };
// 权限管理-保存权限
export const menuSave = (params) => { return req("post", "/api/menu/update", params) };
// 菜单管理-菜单状态
export const menuState = (params) => { return req("post", "/api/menu/state", params) };
// 权限管理-删除权限
export const menuDelete = (params) => { return axios.delete("/api/menu/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-获取权限
export const roleDropDown = () => { return axios.get("/api/Role/dropDown/all?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-配置权限
export const RolePermission = (params) => { return req("post", "/api/RolePermission/save", params) };

