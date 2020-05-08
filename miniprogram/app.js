//app.js

App({
  onLaunch: function() {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'ljm137-qvi5o',
        traceUser: true,
      })
    }

    that.globalData = {}


    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              that.globalData.hasuserInfo = true
              //console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: err => {
        console.log("用户信息获取失败")
      }
    })

    try {
      var value = wx.getStorageSync('hasbasedata')
      if (value) {
        that.globalData.hasbasedata = true
        try{
          that.globalData.openid = wx.getStorageSync('openid')
        }catch(e){}
        console.log("true")
      } else {
        wx.cloud.callFunction({
          name: 'getopenid',
          data: {},
          success: res => {
            that.globalData.openid = res.result.openid
            that.globalData.hasbasedata = res.result.ishas
            if (res.result.ishas == true) {
              try {
                wx.setStorageSync('hasbasedate', true)
                wx.setStorageSync('openid', res.result.openid)
              } catch (e) {}
            } else {
              try {
                wx.setStorageSync('hasbasedate', false)
              } catch (e) {}
            }
            //console.log("ishas", res.result.ishas)
            // console.log("info", res.result.info.data[0].tel)
            //console.log("openid", res.result.openid)
          },
          fail: function(err) {
            console.log("获取openid失败", err)
          }
        })
      }
      //console.log("get hasbasedata success", value)
      //console.log("hasbasedata", that.globalData.hasbasedata)
    } catch (e) {}
  }
})