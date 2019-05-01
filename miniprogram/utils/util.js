var app = getApp();
data:{

  Devc:[]
}
/**
 * 转换地址数据
 * */ 
function replacePhone(arr,isreplace){//自动生成
  var newAddr =[]
  for(let i = 0 ; i < arr.length; i++){
    if(isreplace){
      let phone = arr[i].phone
      arr[i].phone = phone.replace(phone.substring(3,7),'****')
    }
    newAddr[i] = arr[i].name + ' ' + arr[i].phone + '\n' + arr[i].province + arr[i].city + arr[i].addr
  }
  
  return newAddr
}
//微信小程序获取时间begin-------------------------
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function EndTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()+1
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//微信小程序获取时间end---------------------


function global_devc(flag){ //设置全局函数global_devc
  if(flag==1){
    const db = wx.cloud.database()
    db.collection('Devc').get({
      success: res => {
        getApp().globalData.global_devc=res.data, //设置全局Devc数组
        getApp().globalData.global_devc_length=res.data.length//设置全局Devc数组长度
       // ,add_Devc_status()
        ,update_status()
      },
      
    
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }
    } ,
  )
  }

}

function update_status() {   //随机更新设备状态并调用add_Devc_status 添加设备状态更新纪录
  console.log('getApp().globalData.global_devc_length', getApp().globalData.global_devc_length)
 if(getApp().globalData.global_devc_length!=0){

  //0<=Math.random()<1  随机小数
  //   Math.floor(X) =X的整数位
  // 例如
  // Math.floor(6.999)  ===  6
  // Math.floor(39.001)   ===  39
  // Math.floor(8)   ===  8
  //Math.random()*50  //这样我们就能得到一个 >=0 且 <50的随机小数
    var random = Math.floor(Math.random() * (getApp().globalData.global_devc_length+20)) //得到0-length-1的随机数
    console.log('random',random)
    var _id=getApp().globalData.global_devc[random]._id
    var devc_id=getApp().globalData.global_devc[random].devc_id //随机得到一个设备id
   if (devc_id!=null){
     console.log('d_id', _id)

     const db = wx.cloud.database()
     var i = Math.floor(Math.random() * 3) + 1  //得到 1-3之间的随机数
     console.log('i', i)
     db.collection('Devc').doc(_id).update({
       data: {
         devc_status: i
       },
       success: res => {
         console.log('[数据库] [更新记录] 成功：', res)
         add_Devc_status(devc_id, i)//传入设备id和更新后的状态码

       },
       fail: err => {

         console.error('[数据库] [更新记录] 失败：', err)
       }
     })
   }
  
 
 }



  
}
function add_Devc_status(devc_id,i){  //自动添加设备状态变化 需要获取设备数组长度 
        global_devc()//获取全局函数
        const db = wx.cloud.database();
        var TIME = formatTime(new Date());
        var TIME2=EndTime(new Date());
              console.log('TIME',TIME);
            //  console.log('TIME2',TIME2)

        if(getApp().globalData.global_devc_length!=0){
        
             db.collection('Devc_status').add({
              data: {
               // _openid:'onqDm5fnuuaOOccmm3cp9KjmfaRg', //固定
                devc_id:devc_id,//设备id
                devc_status_id:33,//相当这张表主键  无用
                end_time:TIME2,//状态结束时间
                hold_time:null,//状态持续时间
                start_time:TIME,//状态开始时间
                status:i//状态码 1-3
             
                
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
        
                console.log('[Devc_status] [新增记录] 成功，记录 _id: ', res._id)
               // console.log('status:',i) ,console.log('devc_id:',devc_id)
                this.onQuery()
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '新增记录失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
             });

    }
   
}
function add_Production(){  //自动添加产品记录 
 
  const db = wx.cloud.database(department_id,devc_id);
  var TIME = formatTime(new Date());
        console.log('TIME',TIME);
      var department_id=department_id
      var devc_id=devc_id
      var count = Math.floor(Math.random() * 100)+50
      var i=Math.floor(Math.random() * 5)+1
     // var devc_id=Math.floor(Math.random() * 5)+14 // (6-4)
       db.collection('Production').add({
        data: {
          count:count,
          create_time:TIME,
          department_id:1,
          devc_id:6,
          name:"零件"+i,
          production_id:1
          
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
  
          console.log('[Production] [新增记录] 成功，记录 _id: ', res._id)
       //   console.log('department_id',department_id)
        //  console.log('devc_id',devc_id) 
         
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
         
        }
       });

}


 
 
    



module.exports = {
  formatTime: formatTime,
  replacePhone : replacePhone,
  update_status:update_status,
  global_devc:global_devc,
  add_Devc_status:add_Devc_status,
  EndTime:EndTime,
  add_Production:add_Production
}

