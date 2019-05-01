// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Devc').where(
      {
       
        _id: event._ID
        
      }
    ).remove()
  }
  catch (e) {
    console.error(e)
  }

}