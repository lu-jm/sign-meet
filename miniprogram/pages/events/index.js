const DB = wx.cloud.database().collection("meeting")
var app = getApp()
var attend_meet
var change_meet
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {}, //会议列表信息
    meetinfo: {},
    haslist: true, //是否存在至少一个会议
    choose: 'change_btn',
    hasfinish: false, //是否完成
    hideedit: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.onPullDownRefresh()
    this.setData({
      change_color: '#06ae56',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log("onShow")
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
    var that = this;

    that.getDBmeet();
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
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
  //查看我管理的或参加的会议
  myMeeting: function(e) {
    //若点击我管理的按钮
    if (e.target.id == 'attend_btn') {
      this.setData({
        attend_color: '#06ae56',
        change_color: 'black',
        choose: e.target.id,
        hideedit: false
      })
      this.setData({
        list: attend_meet
      })
      //判断列表是否为空,若为空则显示空白页面
      if (this.data.list.length == 0) {
        this.setData({
          haslist: false
        })
      } else {
        this.setData({
          haslist: true
        })
      }
      // console.log("choose attend", this.data.list)
      //若点击我参加的按钮
    } else {
      this.setData({
        attend_color: 'black',
        change_color: '#06ae56',
        choose: e.target.id,
        hideedit: true
      })
      this.setData({
        list: change_meet
      })
      //判断列表是否为空,若为空则显示空白页面
      if (this.data.list.length == 0) {
        this.setData({
          haslist: false
        })
      } else {
        this.setData({
          haslist: true
        })
      }
      // console.log("choose change", this.data.list)
    }
  },
  //点击查看该会议详细信息
  chooseMeeting: function(e) {
    console.log(e)
    var that = this
    let id = e.currentTarget.id
    var uninfo = that.data.list[id]
    var info = encodeURIComponent(JSON.stringify(uninfo))
    if (that.data.choose == "change_btn") {
      var isHide = false
    } else {
      var isHide = true
    }
    wx.navigateTo({
      url: '../meetinginfo/index?info=' + info + '&ishide=' + isHide,
    })
  },
  //获取用户数据
  getDBmeet: function() {
    var that = this
    const openid = app.globalData.openid
    //console.log("openid", openid)
    wx.cloud.callFunction({
      name: 'getDBmeetinfo',
      data: {
      },
      success: res => {
        console.log("获取成功", res)
        // console.log(res.result.attend_meeting)
        // //console.log(that.data.choose,that.data.haslist)
        // app.globalData.change_list = res.result.change_meeting.data
        // app.globalData.attend_list = res.result.attend_meeting
        attend_meet = res.result.attend_meeting
        change_meet = res.result.change_meeting.data

        if (that.data.choose == 'attend_btn') {
          if (attend_meet.length == 0) {
            this.setData({
              haslist: false
            })
          } else {
            this.setData({
              haslist: true,
              list: attend_meet
            })
          }

        } else {
          if (change_meet.length == 0) {
            this.setData({
              haslist: false
            })
          } else {
            this.setData({
              haslist: true,
              list: change_meet
            })
          }
        }
        wx.stopPullDownRefresh({
          complete(res) {
            wx.hideToast()
            // console.log(res)
          }
        })
      },
      fail: err => {
        console.log("调用失败", err)
      }
    })
  },
  //创建新的会议
  creatMeeting: function() {
    wx.switchTab({
      url: '../index/index',
      success: function() {
        // console.log("跳转成功")
      },
      fail: function() {
        console.log("跳转失败")
      }
    })
  },
  //删除会议
  delMeeting: function(e) {
    var that = this
    wx.showModal({
      title: '是否删除该会议',
      content: '删除的会议可以在回收站找到',
      success(res) {
        if (res.confirm) {

          var id = e.currentTarget.id
          //console.log(this.data.list[id])
          wx.cloud.callFunction({
            name: 'hideMeeting',
            data: {
              id: that.data.list[id]._id
            },
            success: function(res) {
              that.onPullDownRefresh()
            },
            fail: function(err) {
              console.log("删除失败", err)
            }
          })
          //that.getDBmeet()
        }
      }
    })
  },
  // 编辑修改会议，跳转到index/index
  editMeeting: function(e) {
    var that = this
    let id = e.currentTarget.id
    //app.globalData.change_meet_address = that.data.list[id].meet_address
    // console.log("event", app.globalData.change_meet_address)
    var info = encodeURIComponent(JSON.stringify(that.data.list[id]))
    //var address = encodeURIComponent(JSON.stringify(that.data.list[id].meet_address))
    // console.log(that.data.list[id])
    wx.reLaunch({
      url: '../index/index?info=' + info + '&flag=' + 1,
      success: res => {},
      fail: err => {
        console.log(err)
      }
    })
  }
})