Page({

  //touch start
handleTouchStart: function(e) {    
      this.startTime = e.timeStamp;    
      //console.log(" startTime = " + e.timeStamp);  
  },  
   
  //touch end
  handleTouchEnd: function(e) {    
      this.endTime = e.timeStamp;    
      //console.log(" endTime = " + e.timeStamp);  
  },  
   
  handleClick: function(e) {    
      //console.log("endTime - startTime = " + (this.endTime - this.startTime));    
      if (this.endTime - this.startTime < 600) {      
      console.log("点击");    
      }  
  },  
   
  handleLongPress: function(e) {    
 
  console.log("长按");  
    this.showDialogBtn()

  },

  onRemove: function () {
   wx.cloud.callFunction({
     name:'remove',
     data:{
       depart_id:6
     },
     success:res=>{  console.log(res.result) },
     fail: res => { console.error('云函数异常:', res)}

   })

  },
  // 输入框id
  inputChange_id(e) {
    var that = this
    this.setData({
      telValue_id: e.detail.value
    })
  },
  //输入框名称
  inputChange_name(e) {
    var that = this
    this.setData({
      telValue_name: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 弹窗
   */


  showDialogBtn: function () {

    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 200,
      complete: function () {
        this.hideModal();
      }
    })
    this.onCancel()

    this.onRemove()
    this.onLoad()
  
  },


})