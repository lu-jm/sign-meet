const tm = require("./comparetime.js")
const DB = wx.cloud.database().collection("meeting")
const location = JSON.stringify({
  latitude: 39.89631551,
  longitude: 116.323459711
})
//签到方式
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '添加一个新的会议',
    address: '',
    isBindExpert: false, //调出更多选项
    // 表单数据
    list: {
      _id: '',
      startdate: [],
      enddate: [],
      meet_name: '',
      meet_num: '',
      meet_address: {},
      meet_introduce: '',
      checkItem: [],
      items: [{
          name: 'scan',
          value: '扫码',
          flag: false
        },
        {
          name: 'photo',
          value: '拍照',
          flag: false
        },
        {
          name: 'gesture',
          value: '手势',
          flag: false
        }
      ],
    }, //修改会议列表
    change: false, //是否执行修改操作
    map_change: false, //选点地图页面是否启动

    hasbasedata: true,
  },
  //修改会议开始结束日期

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //console.log("onLoad");
    // 如果flag==1表示将要修改该会议
    if (options.flag == '1') {

      var info = JSON.parse(decodeURIComponent(options.info))
      // 修改日期格式
      info.startdate = info.startdate.split(" ")
      info.enddate = info.enddate.split(" ")
      // 修改checkbox格式
      var array = that.data.list.items
      array[0].flag = info.checkitem.scan
      array[1].flag = info.checkitem.photo
      array[2].flag = info.checkitem.gesture
      // 签到方式数组
      var checkItem = []
      Object.keys(info.checkitem).forEach(function(key) {
        if (info.checkitem[key]) {
          checkItem.push(key)
        }
      })
      // console.log(info)
      // 对传值数据进行赋值
      that.setData({
        title: '修改当前会议',
        list: {
          _id: info._id,
          startdate: info.startdate,
          enddate: info.enddate,
          meet_name: info.meet_name,
          meet_num: info.meet_num,
          meet_address: info.meet_address,
          meet_introduce: info.meet_introduce,
          checkItem: checkItem,
          items: array
        },
        change: true,
        map_change: true,
      })

    } else {
      that.getCustomTime()
    }
    console.log(info)
    console.log(that.data.list)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //console.log("onReady");
    // this.toastDialog = this.selectComponent("#toastDialog");
    if (app.globalData.hasbasedata == false) {
      wx.showModal({
        title: '信息不完善',
        content: '请完善身份信息',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../applyinfo/index',
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    if (that.data.map_change == false) {
      const chooseLocation = requirePlugin('chooseLocation')
      const show_location = chooseLocation.getLocation();
      that.setData({
        'list.meet_address': show_location,
      })
      // console.log("onShow", show_location);
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // return{
    //   title:'分享',
    //   path:'pages/index/index'
    // }
  },
  //获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      ui: e.detail.userInfo
    })
  },
  //修改会议开始结束日期
  bindDateChange: function(e) {
    //console.log(e.target.id);
    //console.log(e.detail.value);
    if (e.target.id == "startdate") {
      this.setData({
        'list.startdate[0]': e.detail.value
      })
    } else {
      this.setData({
        'list.enddate[0]': e.detail.value
      })
    }
  },
  //修改会议开始结束时间
  bindTimeChange: function(e) {
    //console.log(e.detail.value);
    if (e.target.id == "starttime") {
      this.setData({
        'list.startdate[1]': e.detail.value
      })
    } else {
      this.setData({
        'list.enddate[1]': e.detail.value
      })
    }
  },
  //修改地址
  bindRegionChange: function(e) {
    met_addressgeneral = e.detail.value
    this.setData({
      region: e.detail.value
    })
  },
  //腾讯位置服务
  Tomap: function() {
    var that = this
    that.setData({
      map_change: false
    })
    const key = 'CHYBZ-2KVC4-UYUUS-XPPUG-6XL55-XVF2U'; //使用在腾讯位置服务申请的key
    const referer = '会议签到系统'; //调用插件的app的名称
    const category = '生活服务,娱乐休闲';
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
    });
  },

  //更多选项调出
  isBindview: function() {
    var isBind = this.data.isBindExpert;
    this.setData({
      isBindExpert: !isBind
    })
    //console.log(this.data.isBindExpert);
  },
  //上传文件
  upfile: function() {
    wx.chooseImage({
      success: function(res) {
        var tempfile = res.tempFilePaths
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        wx.cloud.uploadFile({
          cloudPath: 'meetCheckPic/tem.png',
          filePath: tempfile[0],
          success: res => {
            console.log(res.fileID)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
    // wx.cloud.callFunction({
    //   name:'uploadfile',
    //   data:{},
    //   success(res) {
    //     console.log("请求成功", res)
    //   },
    //   fail(res) {
    //     console.log("请求失败", res)
    //   }
    // })
  },
  //添加或者修改会议
  changemeeting: function(e) {
    var that = this
    //console.log(that.data.list.checkItem)
    var start = that.data.list.startdate[0] + ' ' + that.data.list.startdate[1] + ':00'
    var end = that.data.list.enddate[0] + ' ' + that.data.list.enddate[1] + ':00'
    // 判断是否将信息填写完整
    if (that.data.list.meet_name == '' || that.data.list.meet_address == {} ||
      that.data.list.checkItem.length == 0 || that.data.list.meet_num == 0) {
      wx.showToast({
        title: '请确认是否填写完整',
        icon: 'none',
        duration: 2000
      })
      return
      // 判断个人信息是否存在
    } else if (app.globalData.hasbasedata == false) {
      //this.modal = this.selectComponent("#modal")
      wx.showModal({
        title: '提交失败',
        content: '请完善身份信息',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../applyinfo/index',
            })
          }
        }
      })
      return
      // 判断会议开始时间和结束时间
    } else if (tm.compareStartEnd(start, end) == 0) {
      wx.showToast({
        title: '开始时间不能大于结束时间',
        icon: 'none',
        duration: 2000,
      })
      return
    } else {
      var value
      if (e.target.id == 'change_btn') {
        value = 0
      } else {
        value = 1
      }
      wx.showLoading({
        title: '上传中',
      })

      that.uploadmeeting(value) //1表示添加会议 0表示修改会议
    }
  },


  //上传会议
  uploadmeeting: function(value) {
    var that = this
    wx.cloud.callFunction({
      name: 'addMeetdata',
      data: {
        flag: value,
        list: that.data.list
      },
      success: function(res) {
        wx.hideLoading()
        console.log(res)
        that.deleteFromDate()
      },
      fail: function(err) {
        console.log(err)
        //console.log(that.data.met_address)
        wx.hideLoading()
        wx.showModal({
          title: '上传失败',
          content: '请检查网络连接',
          showCancel: false
        })
      }
    })
  },
  // 删除表单数据
  deleteFromDate: function() {
    var that=this
    that.setData({
      title: '添加一个新的会议',
      change: false,
      map_change: false,
      list: {
        meet_name: '',
        meet_introduce: '',
        meet_address: '',
        meet_num: '',
        items: [{
          name: 'scan',
          value: '扫码',
          flag: false
        }, {
          name: 'photo',
          value: '拍照',
          flag: false
        }, {
          name: 'gesture',
          value: '手势',
          flag: false
        }],
        checkItem: []
      }
    })
    that.getCustomTime()
  },

  //获取组件中的信息，赋给全局变量
  addTheme: function(e) {
    this.setData({
      'list.meet_name': e.detail.value
    })
  },
  addIntroduce: function(e) {
    this.setData({
      'met_introduce': e.detail.value
    })
  },
  addStartdate: function(e) {
    this.setData({
      // 开始日期
      'list.startdate[0]': e.detail.value
    })
  },
  addStarttime: function(e) {
    this.setData({
      // 开始时间
      'list.startdate[1]': e.detail.value
    })
  },
  addEnddate: function(e) {
    this.setData({
      'list.enddate[0]': e.detail.value
    })
  },
  addEndtime: function(e) {
    this.setData({
      'list.enddate[1]': e.detail.value
    })
  },
  addNum: function(e) {
    this.setData({
      'list.meet_num': e.detail.value
    })
  },
  // 选择签到方式
  checkMode: function(e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      'list.checkItem': e.detail.value
    })
  },
  //获取当前时间函数
  getCustomTime: function() {
    var dt = new Date();
    const y = dt.getFullYear()
    // 总长度2位不足用0填充
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    this.setData({
      'list.startdate[0]': y + '-' + m + '-' + d,
      'list.startdate[1]': hh + ':' + mm,
    })
    this.setData({
      'list.enddate[0]': this.data.list.startdate[0],
      'list.enddate[1]': this.data.list.startdate[1]
    })
  },

  scan: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        //        console.log("扫描的信息",res.result)
        var info = JSON.parse(res.result)
        //        console.log("处理后信息",info)
        wx.cloud.callFunction({
          name: 'compareqrcode',
          data: {
            info: info
          },
          success: function(res) {
            if (res.result == true) {
              console.log("签到成功", res.result)
            } else {
              console.log("签到失败", res.result)
            }
            wx.navigateTo({
              url: '../success/index?success=' + res.result,
              success: function() {
                //console.log("跳转成功")
              },
              fail: function(err) {
                //console.log("跳转失败", err)
              }
            })
          },
          fail: function(err) {
            //console.log("失败")
          }
        })
      }
    })
  },

})