// pages/signmember/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meet_num: '',
    info_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: 'getEnlistMember',
      data: {
        id: options.id
      },
      success: res => {
        console.log("onLoad", res.result)
        this.setData({
          info_list: res.result,
          meet_num: res.result.length
        })
      },
      fail: err => {
        console.log(err)
      },
    })
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
  toSingleMember: function(e) {
    var that = this
    var id = e.currentTarget.id
    var info = encodeURIComponent(JSON.stringify(that.data.info_list[id]))
    console.log(id)
    console.log(info)
    wx.navigateTo({
      url: '../singlemember/index?info=' + info + '&flag=' + "enlist",
    })
  },
  // 搜索过程中不断调用此函数
  search: function(value) {
    var that = this
    console.log(this.data.search)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var arry = []
        that.data.info_list.map(item => {
          if (item.name.search(value) != -1) {
            arry.push(Object.assign({}, {
              text: item.name,
              value: item
            }))
          }
        })
        resolve(arry)
      }, 200)
    })
  },
  // 选择搜索结果
  selectResult: function(e) {
    console.log('select result', e.detail)
    var that = this
    var id = e.currentTarget.id
    var info = encodeURIComponent(JSON.stringify(e.detail.item.value))
    wx.navigateTo({
      url: '../singlemember/index?info=' + info + '&flag=' + "enlist",
    })
  },
})