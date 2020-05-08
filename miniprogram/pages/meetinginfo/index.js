const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosemet_id: {},
    imgURL: '',
    time: '',
    deltime: '',
    // 判断是否是管理的会议
    isManage: false,
    hideimg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 传值数据处理
    var info_lock = decodeURIComponent(options.info);
    var info = JSON.parse(info_lock);
    that.setData({
      choosemet_id: {
        _id:info._id,
        meet_name:info.meet_name,
        meet_introduce: info.meet_introduce,
        startdate: info.startdate,
        enddate: info.enddate,
        meet_num: info.meet_num,
        meet_address: info.meet_address,
        checkitem:info.checkitem
      },
    })
    console.log("onLoad", info)
    //页面传值是字符串
    if (options.ishide == 'false') {
      that.setData({
        isManage: true, //我管理的会议
      })
      return
    } else {
      that.setData({
        isManage: false,
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
    //    console.log("onShow", this.data.choosemet_id)
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
    //clearTimeout(this.data.time)
    //clearTimeout(this.data.deltime)
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
    var that = this
    var info = encodeURIComponent(JSON.stringify(that.data.choosemet_id._id))
    return {
      title: '发送给参会人员',
      path: '/pages/signmeet/index?info=' + info
    }
  },
  showImg: function() {
    wx.navigateTo({
      url: '../resetscan/index?info=' + this.data.choosemet_id._id,
    })
  },
  btnFlushImg: function() {
    clearTimeout(this.data.time)
    this.flushImg()
  },
// 刷新签到二维码
  flushImg: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'qrcode',
      data: {
        _id: that.data.choosemet_id._id
      },
      success: function(res) {
        console.log("调用成功",res.result)
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

  delPassword: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'deletePassword',
      data: {
        id: that.data.choosemet_id._id
      },
      success: res => {
        console.log("delete success")
      },
      fail: err => {
        console.log("delete fail", err)
      }
    })
    clearTimeout(this.data.time)
    // var deltime=setTimeout(function(){
    //   that.delPassword()
    // },15000)
    // this.setData({
    //   deltime:deltime
    // })
  },
  // 扫码签到
  scan: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        //        console.log("扫描的信息",res.result)
        var info = JSON.parse(res.result)
        console.log("处理后信息", info)
        wx.cloud.callFunction({
          name: 'compareqrcode',
          data: {
            info: info,
            openid: app.globalData.openid
          },
          success: function(res) {
            console.log(res.result)
            switch (res.result) {
              case -1:
                wx.showToast({
                  title: '会议不存在或未报名',
                  icon: 'none',
                  duration: 2500,
                })
                break;
              case 0:
                wx.showToast({
                  title: '你已经签到过了',
                  icon: 'none',
                  duration: 2500,
                })
                break;
              case 1:
                wx.showToast({
                  title: '签到成功',
                  icon: 'none',
                  duration: 2500,
                })
                break;
              case -2:
                wx.showToast({
                  title: '签到失败',
                  icon: 'none',
                  duration: 2500,
                })
                break;
            }
          },
          fail: function(err) {
            console.log("失败", err)
          }
        })
      }
    })
  },
  //设置手势签到
  setGesture: function() {
    var that = this
    if (that.data.isManage) {
      wx.navigateTo({
        url: '../resetgesture/index?id=' + that.data.choosemet_id._id + '&ischange=' + 1,
      })
    } else {
      wx.navigateTo({
        url: '../resetgesture/index?id=' + that.data.choosemet_id._id + '&ischange=' + 0,
      })
    }
  },
  //查看报名名单
  showEnlistMember: function() {
    var that = this
    wx.navigateTo({
      url: '../enlistmember/index?id=' + that.data.choosemet_id._id
    })
  },
  //查看签到名单
  showSignMember: function() {
    var that = this
    wx.navigateTo({
      url: '../signmember/index?id=' + that.data.choosemet_id._id + '&num=' + that.data.choosemet_id.meet_num,
    })
  },
  //去地图查看位置
  toMapCheck: function() {
    wx.openLocation({
      latitude: this.data.choosemet_id.meet_address.location.coordinates[1],
      longitude: this.data.choosemet_id.meet_address.location.coordinates[0],
      scale: 18,
    })
  },
  //添加日程提醒
  addSchedule: function() {
    var that = this
    wx.requestSubscribeMessage({
      tmplIds: ['KhdKD7zy9_rxqOwmM7ks_dgDC49PH8yOvpIkzsTbx7s'],
      success(res) {
        if (res['KhdKD7zy9_rxqOwmM7ks_dgDC49PH8yOvpIkzsTbx7s'] === 'accept') {
          wx.cloud.callFunction({
            name: 'addSchedule',
            data: {
              id: that.data.choosemet_id._id,
              name:that.data.choosemet_id.meet_name,
              date:that.data.choosemet_id.startdate
            },
            success: res => {
              console.log(res)
            },
            fail: err => {
              console.error(err)
            }
          })
        }
        console.log("提醒成功")
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 拍照页面跳转
  takephoto:function(){
    var that=this
    wx.navigateTo({
      url: '../takephoto/index?id=' + that.data.choosemet_id._id,
    })
  }
})