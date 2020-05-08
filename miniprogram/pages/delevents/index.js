var app = getApp()
Page({
  data: {
    info: {} //隐藏的会议数据
  },

  onLoad: function(options) {
    this.getDelMeet()
  },

  //从数据库中获取隐藏的会议
  getDelMeet: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'getDelMeet',
      data: {
        isReclycle: false,
        openid: app.globalData.openid
      },
      success: res => {
        that.setData({
          info: res.result.data
        })
      },
      fail: err => {
        console.log(err)
      },
    })
  },

  //从数据库中还原该会议
  recycleMeeting: function(e) {
    var that = this
    wx.showModal({
      title: '是否还原该会议',
      content: '还原后可在我的会议列表中找到',
      success: res => {
        if (res.confirm) {
          var id = that.data.info[e.currentTarget.id]._id
          console.log(id)
          wx.cloud.callFunction({
            name: 'getDelMeet',
            data: {
              isReclycle: true,
              id: id,
              openid: app.globalData.openid
            },
            success: res => {
              console.log("成功", res.result.data)
              that.setData({
                info: res.result.data
              })
            },
            fail: err => {
              console.log(err)
            }
          })
        } else {}
      }
    })
  },
  delMeeting: function(e) {
    var that = this
    wx.showModal({
      title: '是否删除会议',
      content: '删除后无法恢复',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteMeet',
            data: {
              flag: e.currentTarget.id,
              id: that.data.info[e.currentTarget.id]._id,
              openid: app.globalData.openid,
            },
            success: res => {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000,
              })
              that.getDelMeet()
            },
            fail: err => {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  allDelete: function(e) {
    var that = this
    wx.showModal({
      title: '删除全部会议',
      content: '删除后无法恢复',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteMeet',
            data: {
              flag: e.currentTarget.id,
              openid: app.globalData.openid,
              info: that.data.info
            },
            success: res => {
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000,
              })
              that.getDelMeet()
            },
            fail: err => {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  }
})