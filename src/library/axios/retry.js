/*
 * @Author: PengZhen
 * @Date: 2018-12-21 18:54:55
 * @Description: Retry for axios
 * @Last Modified by: PengZhen
 * @Last Modified time: 2019-01-03 10:53:46
 */

import axios from './index'

export default error => {
  const config = error.config

  if (!config || !config.retry) {
    return Promise.reject(error)
  }

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(error)
  }

  // Increase the retry count
  config.__retryCount += 1

  // Record whether the retry is complete
  config.__isRetryComplete = config.__retryCount === config.retry

  console.warn(`retry 第 ${config.__retryCount} 次: ${error}`)

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve()
    }, config.retryDelay || 1)
  })

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function() {
    return axios(config)
  })
}
