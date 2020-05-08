// pages/singlemember/index.js
const tm = require("./comparetime.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: '',
    title: '',
    info: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var info = JSON.parse(decodeURIComponent(options.info))
    if (options.flag == 'enlist') {
      this.setData({
        flag: true,
        title: '报名信息',
        info: info
      })
    } else {
      info.check_time = tm.changeTime(info.check_time)
      //console.log(info)
      switch (info.check_type) {
        case "scan":
          info.check_type = '扫码签到'
          break;
        case "photo":
          info.check_type = '拍照签到'
          break
        case "gesture":
          info.check_type = '手势签到'
          break
      }
      this.setData({
        flag: false,
        title: '签到信息',
        info: info
      })
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
  toCall: function() {
    if (this.data.flag == true) {
      wx.makePhoneCall({
        phoneNumber: this.data.info.tel,
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: this.data.info.userinfo[0].tel,
      })
    }
  },
  // 点击浏览图片
  previewImage(e) {
    var imgarr = this.data.info.img.split(' ')
    //console.log(imgarr)
    wx.previewImage({
      urls:imgarr
    })
  },
  // 点击确认签到图片信息
  checkConfirm:function(){
    var that=this
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name:'confirmCheckPic',
      data:{
        meetid:that.data.info.meet_id,
        openid:that.data.info.check_openid
      },
      success:res=>{
        console.log(res)
        wx.hideToast()
        wx.navigateBack({
          
        })
      },
      fail:err=>{
        console.log(err)
      }
    })
  }
})