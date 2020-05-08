// pages/signmeet/index.js
const app = getApp()
const tm = require('../index/comparetime.js')
var ithas = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meet: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var uninfo = decodeURIComponent(options.info)
    var info = JSON.parse(uninfo)
    wx.cloud.callFunction({
      name: 'getSigninfo',
      data: {
        id: info
      },
      success: res => {
        //console.log(res.result)
        if (res.result.flag == 0) {
          wx.showModal({
            content: '会议不存在或已过期',
          })
        } else {
          res.result.info.list[0].startdate = tm.changeTime(res.result.info.list[0].startdate)
          res.result.info.list[0].enddate = tm.changeTime(res.result.info.list[0].enddate)
          that.setData({
            meet: res.result.info.list[0]
          })
          //console.log(that.data.meet)
        }
      }
    })
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
    ithas = false
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
  toMapCheck: function() {
    wx.openLocation({
      latitude: this.data.meet.meet_address.latitude,
      longitude: this.data.meet.meet_address.longitude,
      scale: 18,
    })
  },
  toCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.meet.userinfo[0].tel,
    })
  },
  //点击报名按钮，弹出对话框，点击是判断身份信息，是则调用云函数signMeet，否则完善身份信息
  signMeet: function() {
    var that = this
    wx.showModal({
      title: '确定要报名吗',
      content: '报名完成后可以在我参加的会议中查看',
      success: res => {
        if (res.confirm) {
          if (!app.globalData.hasbasedata) {
            wx.showModal({
              title: '报名失败',
              content: '请完善身份信息',
              success: res => {
                if (res.confirm) {
                  if (app.globalData.hasuserInfo) {
                    var num = 1
                    wx.navigateTo({
                      url: '../userinfo/index?info=' + num,
                    })
                  } else {
                    wx.navigateTo({
                      url: '../applyinfo/index',
                    })
                  }
                }
              }
            })
            return
          } else {
            if (!ithas) {
              wx.cloud.callFunction({
                name: 'signMeet',
                data: {
                  openid: app.globalData.openid,
                  meet: that.data.meet._id
                },
                success: res => {
                  console.log(res.result)
                  if (res.result == 1) {
                    ithas = true
                    wx.showToast({
                      title: '报名成功',
                      icon: 'none',
                      duration: 2000,
                    })
                  }else{
                    ithas = true
                    wx.showToast({
                      title: '您已经报名了',
                      icon: 'none',
                      duration: 2000,
                    })
                  }
                },
                fail: err => {},
              })
            } else {
              wx.showToast({
                title: '不能重复报名',
                icon: 'none',
                duration: 2000,
              })
            }
          }
        }
      }
    })
  }
})