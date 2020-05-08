// pages/signmember/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meet_num: '',
    now_num: '',
    info_list: [],
    // 会议id
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      meet_num: options.num,
      id:options.id
    })
    this.getSignMember()
    this.setData({
      search: this.search.bind(this)
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
    this.onPullDownRefresh()
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
    this.getSignMember()
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
  toSingleMember: function(e) {
    var that = this
    var id = e.currentTarget.id
    var info = encodeURIComponent(JSON.stringify(that.data.info_list[id]))
    //console.log(id)
    // console.log(that.data.info_list[id])
    wx.navigateTo({
      url: '../singlemember/index?info=' + info + '&flag=' + 'sign',
    })
  },
  // 获取签到信息列表
  getSignMember: function() {
    wx.cloud.callFunction({
      name: 'getSignMember',
      data: {
        id: this.data.id
      },
      success: res => {
       // console.log(res.result.list)
        this.setData({
          now_num: res.result.list.length,
          info_list: res.result.list,
        })
        console.log(this.data.info_list)
      },
      fail: err => {
        console.log(err)
      },
    })
  },
   // 搜索过程中不断调用此函数
  search: function (value) {
    var that = this
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var arry = []
        that.data.info_list.map(item => {
          if (item.userinfo[0].name.search(value) != -1) {
            arry.push(Object.assign({}, {
              text: item.userinfo[0].name,
              value: item
            }))
          }
        })
        resolve(arry)
      }, 200)
    })
  },
  // 选择搜索结果
  selectResult: function (e) {
    console.log('select result', e.detail)
    var that = this
    var id = e.currentTarget.id
    var info = encodeURIComponent(JSON.stringify(e.detail.item.value))
    wx.navigateTo({
      url: '../singlemember/index?info=' + info + '&flag=' + 'sign',
    })
  },
})