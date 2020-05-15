var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputplaceholder_1: '邮箱',
    inputplaceholder_2: '密码',
    statusBarHeight: app.globalData.statusBarHeight,
    userInfo: {},
    hasUserInfo: false,

    canIUse: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.hasbasedata) {
      console.log("已经获取hasuserInfo", app.globalData.hasbasedata)
      this.setData({
        userInfo: app.globalData.userInfo,
        canIUse: false
      })
    } else {
      console.log('数据库不存在用户信息')
      this.setData({
        canIUse: true
      })
      // wx.getSetting({
      //   success(res) {
      //     if (res.authSetting['scope.userInfo']) {
      //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      //       wx.getUserInfo({
      //         success: function(res) {
      //           app.globalData.userInfo = res.userInfo
      //           console.log("onLoad", res.userInfo)
      //         }
      //       })
      //     }
      //   }
      // })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.hasbasedata) {
      this.setData({
        canIUse: false,
        userInfo:app.globalData.userInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  recycleBin: function() {
    wx.navigateTo({
      url: '../delevents/index',
    })
  },
  bindGetUserInfo: function(e) {
    wx.navigateTo({
      url: '../applyinfo/index',
    })
  },
  // 跳转至我的会议
  myMeeting: function() {
    wx.switchTab({
      url: '../events/index',
    })
  }
})