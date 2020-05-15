//app.js

App({
  onLaunch: function() {
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

    this.globalData = {}

    const db = wx.cloud.database()
    const userInfo = db.collection("user_info")
    // 获取用户openid
    wx.cloud.callFunction({
      name: 'getopenid',
      data: {},
    }).then(res => {
      this.globalData.openid = res.result.openid
      console.log(this.globalData.openid)
      userInfo.where({
        _id: res.result.openid
      }).get().then(res => {
        console.log(res)
        // 如果获取的长度为0，则说明未注册
        if (res.data.length === 0) {
          console.log('需要注册')
          this.globalData.hasbasedata = false
        } else {
          this.globalData.hasbasedata = true
        }
      })
    }).catch(console.err)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.hasuserInfo = true
              //console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: err => {
        console.log("用户信息获取失败")
      }
    })
  }
})