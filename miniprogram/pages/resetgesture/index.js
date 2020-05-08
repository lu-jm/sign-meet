// pages/gesture/index.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    ischange: true,
    z_index: -100,
    id: '',
    time:'',
  },
  onEnd(data) {
    var that = this
    if (!that.data.ischange) {
      that.setData({
        data: data.detail.join(''),
        z_index: 500,
      })
      console.log("change",data.detail.join(''))
      that.operationGesture(that.data.data)
      var changetime = setTimeout(function() {
        that.operationGesture('')
      }, 60000)
      that.setData({
        time:changetime,
      });
    }else{
      console.log("attend", data.detail.join(''))
      that.setData({
        data: data.detail.join(''),
      });
      that.compareGesture()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.ischange)
    if (options.ischange == '0') {
      this.setData({
        ischange: true,
        id: options.id
      })
    } else {
      this.setData({
        ischange: false,
        id: options.id,
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
  //重置手势密码
  refushGesture: function() {
    var that = this
    this.setData({
      z_index: -100
    })
    that.operationGesture('')
    clearTimeout(that.data.time)
    wx.showToast({
      title: '手势已重置',
      icon:'none',
      duration:2000
    })
  },
  //对手势密码的操作，包括增加、删除、修改
  operationGesture: function(password) {
    var that = this
    wx.cloud.callFunction({
      name: 'getGesture',
      data: {
        meet_id: that.data.id,
        password: password
      },
      success: res => {
        console.log("重置成功")
      },
      fail: err => {
        console.log("重置失败")
      }
    })
  },
  compareGesture:function(){
    var that=this
    wx.cloud.callFunction({
      name:'compareGesture',
      data:{
        openid:app.globalData.openid,
        meet_id: that.data.id,
        password:that.data.data
      },
      success:res=>{
        console.log("res.result",res.result)
        if(res.result==1){
          wx.showToast({
            title: '签到成功',
            icon: 'none',
            duration: 2000,
          })
        }else if(res.result==0){
          wx.showToast({
            title: '签到失败',
            icon: 'none',
            duration: 2000,
          })
        }else{
          wx.showToast({
            title: '你已经签到过了',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  }


})