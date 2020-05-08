// pages/resetscan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imgURL: '',
    time: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.info
    })
    this.flushImg()
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
  bindimg: function() {
    clearTimeout(this.data.time)
    this.flushImg()
  },
  flushImg: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'qrcode',
      data: {
        _id: that.data.id
      },
      success: function(res) {
        console.log("调用成功",res)
        that.setData({
          imgURL: res.result
        })
      },
      fail: function(err) {
        console.log("调用qrcode失败",err)
      }
    })
    var time = setTimeout(function() {
      console.log("时间到")
      that.delPassword()
    }, 60000)
    this.setData({
      time: time
    })
  },
  delPassword: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'deletePassword',
      data: {
        id: that.data.id
      },
      success: res => {
        console.log("delete success")
      },
      fail: err => {
        console.log("delete fail", err)
      }
    })
    clearTimeout(that.data.time)
  },
})