import request from '@/utils/http'

/**
 * 获取用户列表
 * @param params 获取用户列表参数
 * @returns 用户列表响应
 */
export function GetTypeList(data: any) {
  return request.post({
    url: '/deviceDataService/sysDictionary/findList',
    data
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

// 上传文件
export function uploadFileService(file: any) {
  let data = new FormData()
  data.append('file', file.raw)
  data.append('name', file.name)
  return request.post({
    url: '/userService/minio/uploadOperation2',
    data
  })
}