// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Devc_status').where({devc_id:event.devc_id}).get()
  } catch(e) {
    console.error(e)
  }
}