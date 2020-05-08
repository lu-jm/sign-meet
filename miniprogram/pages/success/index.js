Page({

  /**
   * 页面的初始数据
   */
  data: {
    success: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.success == 'false') {
      this.setData({
        success: false
      })
    } else {
      this.setData({
        success: true
      })
    }
    console.log("success", this.data.success)
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
  comeBack: function() {
    wx.navigateBack({

    })
  },
  restartScan: function() {
    var that=this
    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        //        console.log("扫描的信息",res.result)
        var info = JSON.parse(res.result)
        //        console.log("处理后信息",info)
        var _that=that
        wx.cloud.callFunction({
          name: 'compareqrcode',
          data: {
            info: info
          },
          success: function(res) {
            if (res.result == true) {
              _that.setData({
                success: true
              })
              //              console.log("签到成功",res.result)
            } else {
              _that.setData({
                success: false
              })
              //              console.log("签到失败", res.result)
            }
          },
          fail: function(err) {
            console.log("失败")
          }
        })
      }
    })
  }
})