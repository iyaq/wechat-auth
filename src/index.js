/**
 * ------------------------------------------------------------------
 * 微信授权主入口文件
 * @author SongJinDa <310676645@qq.com>
 * @date 2017/3/26
 * ------------------------------------------------------------------
 */

import WeChatAuth from './wechat-auth'
import url from 'url'
import querystring from 'querystring'
import wx from 'weixin-js-sdk'
export default {
  install (Vue, options) {
    let weChatAuth = new WeChatAuth(options)
    let router = options.router
    if (!router) return false

    function urlCodeQueryFilter (code) {
      if (code) {
        weChatAuth.setAuthCode(code)
        weChatAuth.removeUrlCodeQuery()
      }
    }

    function checkRouterAuth (to, from, next) {
      let authCode = weChatAuth.getAuthCode()
      if ((!to.meta || !to.meta.auth) && !authCode) return true
      if (!authCode && !weChatAuth.getAccessToken()) {
        weChatAuth.openAuthPage(encodeURIComponent(window.location.href))
        return false
      } else if (authCode && !weChatAuth.getAccessToken()) {
        weChatAuth.getCodeCallback(next)
        return false
      }
      return true
    }

    function beforeEach (to, from, next) {
      let query = querystring.parse(url.parse(window.location.href).query)
      let code = query.code
      urlCodeQueryFilter(code)
      if (!code && !checkRouterAuth(to, from, next)) {
        return false
      }
      if (to.meta.title) {
        document.title = to.meta.title
      }
      let mark = to.fullPath.indexOf('code')
      console.log(to.fullPath);
      console.log(from.fullPath);
      if (mark != -1 && from.fullPath == '/home') {
        wx.closeWindow()
       }else{
      next()
       }
    }

    router.beforeEach((to, from, next) => {
      beforeEach(to, from, next)
    })
  }
}
