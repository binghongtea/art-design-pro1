import request from '@/utils/http'

/**
 * 获取用户列表
 * @param params 获取用户列表参数
 * @returns 用户列表响应
 */
export function GetUserList(params: any) {
  return request.get({
    url: '/userService/role/getList'
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}
