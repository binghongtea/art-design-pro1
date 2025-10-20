import request from '@/utils/http'

/**
 * 获取用户列表
 * @param params 获取用户列表参数
 * @returns 用户列表响应
 */
export function GetRoleList() {
  return request.get({
    url: '/userService/role/getList'
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function DeleteUserList(params: any) {
  return request.get({
    url: '/userService/role/delete/' + params.roleId,
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function GetTreesForUserLevel(params: any) {
  return request.get({
    url: '/userService/menuMan/getTreesForUserLevel',
    params
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function AddRole(data: any) {
  return request.post({
    url: '/userService/role/add',
    data
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function UpdateRole(data: any) {
  return request.post({
    url: '/userService/role/update',
    data
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function GetRoleMenus(data: any) {
  return request.get({
    url: '/userService/role/getCheckMenusByRoleId/' + data.roleId
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}


