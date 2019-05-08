//index.js
//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var utils=require('../../utils/util.js')
var timers; // 计时器
var control_update=0;
Page({
  // 页面初始数据
  data: {
    Department: [],//Department_length保存数据库传来的数据 
    Department_length:0,//Department_length数组长度
    re_depart_id: 0, //部门编号，用于删除操作
    telValue_name: '',//部门名称，用于添加操作
    flag: 0,//删除弹窗 跳出控制
    devc_status:[1,2,3], //统计车间内设备 各自运行状态数目
   // Department_status:[],
    timer:''       //计时器
  },
  onShow: function () {//页面显示时执行的操作
   // this.onGotUserInfo(),
    this.onQuery_test('Department')
   //var _this = this;
  //   this.setData({                    //每隔一分钟刷新一次
  //     timer: setTimeout(function () {
  //      // console.log("----Countdown----");
  //       // utils.global_devc() ; //每隔一分钟开始随机更新
  //       //_this.onQuery_test('Department');//重新查询一遍数据库
  //      // utils.add_Dev c_status()
  //     // utils.add_Production() //添加产品 
  //         }, 1000)  //6000=6秒
  // }
  // )

  },
  //计时器begin---------------
  startBtn: function () {
    var that=this
    console.log("开始按钮");
    control_update=1
    that.Countdown();
  },
　// 自定义的暂停按钮  
    pauseBtn: function () { 
      console.log("暂停按钮");
      control_update=0
      clearTimeout(timers);
    },
    Countdown:function() {
      var that=this
     // var timer=''
     timers = setTimeout(function () {
        console.log("----Countdown----");
        utils.global_devc(control_update) ; //每隔一分钟开始随机更新
        that.onQuery_test('Department');//重新查询一遍数据库
        that.Countdown();
      }, 6000)
    },
  //计时器end-------------
  onLoad: function () {

  
    this.onQuery_test('Department')
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)

  },
  onUnload: function () {
    clearInterval(this.data.timer)//清除定时器
},
  //！！！！！！  //数据库车间查询操作
  onQuery_test: function (aaa) {

    const db = wx.cloud.database();
    var str = aaa;
    // 查询usertable
    db.collection(str).get({
      success: res => {
        this.setData({

          Department: res.data,
        })
        //console.log('[数据库] [查询记录] 成功: ', res)
        console.log('Department [数据库] [查询记录] 成功: ', this.data.Department)
    
        this.setData({
          Department_length:this.data.Department.length+1
        })
        getApp().globalData.global_department=this.data.Department
     console.log('Department_length',this.data.Department_length)
     this.onQuery_status('Devc',1,1)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
   
  },
  //车间设备状态查询begin----------------------------------
  onQuery_status: function (aaa,bbb,ccc) {

    const db = wx.cloud.database();
    var str = aaa; 


    // 查询usertable
     for(let j=0;j<=this.data.Department.length+1;j++){
     // var update="Department["+j+"].total_01"
     //console.log('遍历Department.depart_id',this.data.Department[j].depart_id)
     
        for(let i=1;i<=3;i++){
        db.collection(str).where({department_id:this.data.Department[j].depart_id,devc_status:i}).count({
          success: res => {
            var update="Department["+j+"].total_0"+i
            this.setData({

              [update]: res.total,
             
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })} 
    
      }  
  },
  //车间设备状态查询end------------------------------------
  //标签切换
  switchTab: function (e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e)
    var that = this
    this.setData({
      curNavId: id,
      curIndex: index,
    })

  },
  //跳转至详情页
  navigateDetail: function (e) {
    wx.navigateTo({
      url: '../Devc/Devc?departmentId=' + e.currentTarget.dataset.departmentId
    })

  },
  //-----------------------长按删除begin---------------------------
  //touch start
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
    //console.log(" startTime = " + e.timeStamp);  
  },

  //touch end
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    //console.log(" endTime = " + e.timeStamp);  
  },

  handleClick: function (e) {
    //console.log("endTime - startTime = " + (this.endTime - this.startTime));    
    if (this.endTime - this.startTime < 360) {
      console.log("点击");
    }
  },

  handleLongPress: function (e) {
    var aaa = e.currentTarget.dataset.departmentId
    var that = this
    that.setData({
      re_depart_id: aaa
    })

    console.log("长按");
    console.log("re_depart_id:", this.data.re_depart_id);
    this.showDialogBtn()

  },
  //云函数删除数据库
  onRemove: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        depart_id: this.data.re_depart_id
      },
      success: res => {
        console.log(res.result),
          that.setData({
            re_depart_id: 0
          })
          this.onShow()
      },
      fail: res => {
        console.error('云函数异常:', res),
          that.setData({
            re_depart_id: 0
          })
      }

    })

  },



  /**
   * 删除弹窗---------------------------------------
   */


  showDialogBtn: function () {

    this.setData({
      showModal: true,
      flag: 1
    })
  },
  /**
   * 删除弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {},
  /**
   * 删除隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 删除对话框取消按钮点击事件
   */
  onCancel: function () {
    this.setData({
      flag: 0
    });
    this.hideModal();
  },

  /**
   * 删除对话框确认按钮点击事件
   */
  onConfirm: function () {

    this.setData({
      flag: 0
    });
    this.onCancel()
    this.onRemove()
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 200,
    })
    this.onLoad()
  },

  //------------------------长按删除end---------------------------

  //-------添加操作begin---------------------------

  //输入框名称
  inputChange_name(e) {
    var that = this
    this.setData({
      telValue_name: e.detail.value
    })
  },


  /**
   * 弹窗
   */


  add_showDialogBtn: function () {

    this.setData({
      add_showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {},
  /**
   * 隐藏模态对话框
   */
  add_hideModal: function () {
    this.setData({
      add_showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  add_onCancel: function () {
    this.add_hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  add_onConfirm: function () {
    this.add_onCancel()
    this.onAdd()
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })

    //this.onLoad()

   // console.log('id', this.data.telValue_id)
    console.log('name', this.data.telValue_name)
  },
  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('Department').add({
      data: {
        depart_name: this.data.telValue_name,
        depart_id: this.data.Department_length
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
       
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        this.onShow()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    this.setData({
      Department_length: '',
      telValue_name: ''
    })
  },
  //-------------------添加操作END-------------------------------------------


})