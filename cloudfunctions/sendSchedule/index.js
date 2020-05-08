// 云函数入口文件
const cloud = require('wx-server-sdk')
const tm = require('./comparetime.js')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  var info = ''
  var time = new Date().getTime() + 30 * 60 * 1000
  try {
    // 获取需要发送模板信息的数据
    info = await db.collection("schedule_send")
      .where({
        done: false,
        date: _.lte(time)
      })
      .get()
// 循环发送数据
    for (var i = 0; i < info.data.length; i++) {
      try {
        const result = await cloud.openapi.subscribeMessage.send({
          touser: info.data[i].openid,
          page: '../miniprogram/pages/event/index',
          lang: 'zh_CN',
          data: {
            thing1: {
              value: info.data[i].meet_name
            },
            date4: {
              value: tm.changeTime(info.data[i].date)
            }
          },
          templateId: 'KhdKD7zy9_rxqOwmM7ks_dgDC49PH8yOvpIkzsTbx7s',
          miniprogramState: 'developer'
        })
        try {
          await db.collection("schedule_send")
            .doc(info.data[i]._id)
            .update({
              data: {
                done: true
              }
            })
        } catch (e) {}
      } catch (e) {}
    }
  } catch (e) {}
  return {info,time}
}