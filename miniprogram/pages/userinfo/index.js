var app = getApp()
var num
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canTouch: false,
    setcolor: '#53bd44',
    setcontent: '获取验证码',
    timecount: 5,
    tel: '',
    name: '',
    checkcode: '',
    checkcode_id: '',
  },
  addTel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  addName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  addCheckcode: function(e) {
    this.setData({
      checkcode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    num = parseInt(options.info)
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

  setTime: function() {
    var that = this
    if (!(/^1[3456789]\d{9}$/.test(that.data.tel))) {
      wx.showToast({
        title: '输入手机号有误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var setbtn = setInterval(function() {
      that.setData({
        setcontent: '(' + that.data.timecount + ')s后重发',
        timecount: that.data.timecount - 1,
        canTouch: true,
        setcolor: '#ededed',
      })
      console.log(that.data.timecount)
      if (that.data.timecount < 0) {
        that.setData({
          canTouch: false,
          setcolor: '#53bd44',
          setcontent: '获取验证码',
          timecount: 5
        })
        clearInterval(setbtn)
        console.log("clear", that.data.canTouch, that.data.setcolor, that.data.setcontent)
      }
    }, 1000)
    wx.cloud.callFunction({
      name: 'getCheckCode',
      data: {
        tel: that.data.tel
      },
      success: res => {
        wx.showToast({
          title: '获取成功',
          icon: 'none',
          duration: 2000
        })
        console.log(res.result)
        that.setData({
          checkcode_id: res.result
        })
      },
      fail: err => {
        wx.showToast({
          title: '获取失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //点击确定提交用户信息
  checkCenter: function() {
    var that = this
    if (that.data.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(that.data.tel))) {
      wx.showToast({
        title: '输入手机号有误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.checkcode == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.callFunction({
      name: 'checkCode',
      data: {
        id: that.data.checkcode_id,
        code: that.data.checkcode
      },
      success: res => {
        // console.log('checkcode success')
        // console.log(app.globalData.userInfo)
        if (res.result == true) {
          // 添加用户信息
          // console.log(app.globalData.userInfo)
        // 添加用户数据
          wx.cloud.callFunction({
            name: 'addUserInfo',
            data: {
              name: that.data.name,
              tel: that.data.tel,
              userinfo: app.globalData.userInfo
            },
            success: res => {
              app.globalData.hasbasedata = true
              app.globalData.openid=res.result
              console.log(app.globalData.hasbasedata)
              console.log(app.globalData.openid)
              wx.navigateBack({
                delta: num
              })
              wx.hideLoading()
            },
            fail: err => {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 2000
              })
              console.log(err)
            }
          })
        } else {
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
            duration: 2000,
          })
        }

      }
    })
  }

})