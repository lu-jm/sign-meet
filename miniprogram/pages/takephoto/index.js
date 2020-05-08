// pages/takephoto/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetid: '',
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      meetid: options.id
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
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  // 点击上传照片
  uploadCheckPhoto: function() {
    var that = this
    // 将图片上传至云存储空间
    console.log(that.data.src)
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'meetCheckPic/' + that.data.meetid + '/' + app.globalData.openid + '.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: that.data.src,
      // 成功回调
      success: res => {
        console.log(res)
        wx.cloud.callFunction({
          name: 'uploadCheckPhoto',
          data: {
            meetid: that.data.meetid,
            url: res.fileID
          },
          success: res => {
            console.log(res)
            if (res.result==1) {
              wx.showModal({
                content: '上传成功，等待确认',
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({})
                  }
                }
              })
            } else {
              wx.showModal({
                content: '已上传（等待确认）或已签到',
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({})
                  }
                }
              })
            }
          },
          fail: err => {
            console.log(err)
          }
        })
      },
    })
  }
})