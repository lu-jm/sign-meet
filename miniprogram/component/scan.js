var scan=function() {
  wx.scanCode({
    onlyFromCamera: true,
    success: function (res) {
      //        console.log("扫描的信息",res.result)
      var info = JSON.parse(res.result)
      //        console.log("处理后信息",info)
      wx.cloud.callFunction({
        name: 'compareqrcode',
        data: {
          info: info
        },
        success: function (res) {
          if (res.result == true) {
            wx.navigateTo({
              url: '../pages/success/index?success=' + res.result,
              success: function () { },
              fail: function () { }
            })
            //              console.log("签到成功",res.result)
          } else {
            //              console.log("签到失败", res.result)
          }
        },
        fail: function (err) {
          console.log("失败")
        }
      })
    }
  })
}