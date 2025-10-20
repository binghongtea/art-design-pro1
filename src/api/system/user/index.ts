import request from '@/utils/http'

/**
 * 获取用户列表
 * @param params 获取用户列表参数
 * @returns 用户列表响应
 */
export function GetUserList(data: any) {
  return request.post({
    url: '/userService/user/userList',
    data
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function DeleteUserList(params: any) {
  return request.get({
    url: '/userService/user/delete/' + params.userUuid,
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function AddUser(data: any) {
  return request.post({
    url: '/userService/user/accountAddUser',
    data
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function GetRoleIdsByUserId(userId: any) {
  return request.get({
    url: '/userService/user/getRoleIdsByUserId/' + userId
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}


export function UpdateUser(data: any) {
  return request.post({
    url: '/userService/user/update',
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


