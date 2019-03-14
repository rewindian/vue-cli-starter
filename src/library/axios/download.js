/*
 * @Author: PengZhen
 * @Date: 2018-12-21 18:54:30
 * @Description: Download for axios
 * @Last Modified by: PengZhen
 * @Last Modified time: 2019-01-03 10:57:05
 */

import Axios from 'axios'

export default (url, param, method = 'get') => {
  const downloadFile = response => {
    if (!response.headers.hasOwnProperty('content-disposition')) {
      throw new Error('无法获取 content-disposition, 请确保后端 cors 允许访问该 header ')
    }

    // 获取文件名称
    let fileName
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition.indexOf('filename') !== -1) {
      fileName = decodeURIComponent(contentDisposition.split('filename=')[1])
    } else if (contentDisposition.indexOf('fileName') !== -1) {
      fileName = decodeURIComponent(contentDisposition.split('fileName=')[1])
    }

    // 根据 blob 创建 object url
    const blobURL = window.URL.createObjectURL(new Blob([response.data]))

    // 生成临时 a 标签，进行下载
    const link = document.createElement('a')
    link.href = blobURL
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    // 删除临时 a 标签
    document.body.removeChild(link)
    // 释放 object url
    window.URL.revokeObjectURL(blobURL)
  }

  // GET 请求，参数处理
  if (method.toLocaleLowerCase() === 'get') {
    const qs = require('qs')
    Axios({
      url: `${url}?${qs.stringify(param, { arrayFormat: 'repeat' })}`,
      method: 'GET',
      responseType: 'blob',
      isDownload: true
    }).then(downloadFile)
  }

  // POST 请求，参数处理
  else if (method.toLocaleLowerCase() === 'post') {
    Axios({
      url,
      method: 'POST',
      data: param,
      responseType: 'blob'
    }).then(downloadFile)
  }
}
