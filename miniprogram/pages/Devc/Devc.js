// pages/Devc/Devc.js
//获取应用实例
var app = getApp()
var utils=require('../../utils/util.js')
Page({
  data:{
    flag:1,
    flagg:1,//用于控制删除窗口
    id:1,
    currentTab:1,
    userid:1,
    devc_id:1,
    Devc:[],
    departmentId:1,
    devc_name: '',
    add_devc_id:'',
    re_item_id:0,
    _ID:'',
    emptty:[{
      department_id:1,
      devc_id:1,
      devc_name:'默认'
    }],
    devc_status:[],
    devc_status_all_length:0,
    devc_status_time:[{
     

    }],
    producation:[],
    devc_length:0


   
  },

  onLoad:function(option){
    if( option.departmentId != null){
      var a = option.departmentId;
      var that = this;
      that.setData({ departmentId: a, }) 
     
    }
    this.onQuery()
   
  },
  
  onShow:function(option){
    this.onQuery()
  },
  onQuery: function () {
    const db = wx.cloud.database()
    const _ = db.command
  
    var that = this
    var id
    var empty=[{}] //如果是空表的话。。。
    //查询Devc表的长度 begin
    wx.cloud.callFunction({
      name: 'devc_length',
   
      success: res => {
       // console.log(res.total),
          that.setData({
            devc_length:parseInt( res.result.total)+1
          })
          console.log('this.data.devc_length',this.data.devc_length)
      },
      fail: res => {
        console.error('云函数异常:', res)
        
      }

    })

  //查询Devc表的长度 end

    var that=this
    var update="emptty["+0+"].department_id"
    id = parseInt(that.data.departmentId)
    db.collection('Devc').where({department_id:id}).get({
        success: res => {
          that.setData({
            Devc: res.data,
            flag:res.data[0].devc_id
          })
   
            if(this.data.Devc.length==0){
              this.setData({
              [update]:this.data.devc_length,
               Devc:this.data.Devc.concat(this.data.emptty), //注意 concat和push的区别
              
              })
              that.setData({
                flag:this.data.Devc[0].devc_id,  //记录数组中的第一个
                //id:this.data.Devc[0].devc_id
                currentTab:1
              })
              console.log('flagflagflagflag',this.data.flag)
             console.log('Devc111:',this.data.Devc)
            }

          that.setData({
            add_devc_id: this.data.Devc.length
         
          })
          this.onQuery_status()
        
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      }
    )
  },
  //producation begin-----------------------产品
  production:function(devc_id){

   //var id=getApp().globalData.global_devc_id
    //var id=1

    const db = wx.cloud.database()


    db.collection('Production').where({devc_id:devc_id}).get({
      success: res => {
        this.setData({
          producation: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        console.log('producation: ', this.data.producation)
        getApp().globalData.producation=this.data.producation
      //  console.log('  getApp().globalData.producation ',   getApp().globalData.producation)
        //console.log('  getApp().globalData.producation ',   getApp().globalData.producation[0].count)
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

  //producation end---------------------

  onQuery_status: function (devc_id) {  //统计一台设备运行时间/空闲时间/停机时间 的总长

    var devc_id;
    var status_id=1;
    var sum_time=0
    if (devc_id == null) { console.log('kong'); devc_id=this.data.Devc[0].devc_id;this.production(devc_id)}
    else { devc_id=devc_id;this.production(devc_id)}
  
    const db = wx.cloud.database()
    this.setData({ devc_id: devc_id})
    const _ = db.command
   
    for(let i=1;i<=3;i++){
        db.collection('Devc_status').where({ devc_id:devc_id,status:i}).get({  //注意新表权限！！！
          success: res => {
          //  devc_status_time(devc_id)
            this.setData({
              devc_status: res.data,
            })
          
          console.log('111111')
            for(let j=0;j<this.data.devc_status.length;j++){
                var update="devc_status["+j+"].hold_time"
                var t1 =new Date(this.data.devc_status[j].start_time)
                var t2 =new Date(this.data.devc_status[j].end_time)
                var t3=new Date(t2-t1+ 16 * 3600 * 1000)
                 sum_time=sum_time+parseInt(t3.getHours())*60+parseInt(t3.getMinutes())*1
                //sum_time=sum_time+10
                this.setData({
                // [update]:parseInt(t3.getHours())*60+parseInt(t3.getMinutes())*1//时间间隔转为分钟
                 [update]:sum_time//时间间隔转为分钟
              })
             
            }
           // utils.update_status(this.data.devc_status[0]._id)
          //  console.log('devc_status',this.data.devc_status)
            this.Devc_status_time(devc_id,i,sum_time)
            sum_time=0
           // this.production()
         
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
    }  
  },
  Devc_status_time:function(devc_id,status_code,sum_time){
  
     // for(i=0;i<=3;i++)
      var updata0="devc_status_time[0].devc_id"
      var updata1="devc_status_time["+status_code+"].sum_time"
  
      this.setData({
          [updata0]:devc_id,
          [updata1]:sum_time,
         
      })
      
      console.log('devc_status_time:',this.data.devc_status_time)
  },

 
  // Devc_status_requery: function (devc_id) {
  //   var that = this
  //   wx.cloud.callFunction({
  //     name: 'Devc_status_requery',
  //     data: {
  //       devc_id: devc_id
  //     },
  //     success: res => {
  //       console.log(res.data),
  //         that.setData({
  //           devc_status_all_length: res.data.length
  //         })
  //         this.onShow()
  //     },
  //     fail: res => {
  //       console.error('云函数异常:', res)
  
  //     }

  //   })

  // },

//数据库查询右边栏
  // onQuery_right: function (e) {
  //   var devc_id;
  //   if (e == null) { console.log('kong', e); devc_id=1;}
  //   else { devc_id=e.currentTarget.dataset.itemId}
  //   const db = wx.cloud.database()
  //   //var userid=e.currentTarget.dataset.itemId
  //   this.setData({ devc_id: devc_id})
  //   const _ = db.command

  //   db.collection('Devc').where({ devc_id: devc_id}).get({
  //     success: res => {
  //       this.setData({
  //         lyTable: res.data,
  //       })
  //       console.log('[数据库] [查询记录] 成功: ', res)
    
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       console.error('[数据库] [查询记录] 失败：', err)
  //     }
  //   })
  // },

  //点击左侧菜单，右侧界面切换
  switchNav:function(e){
    console.log('switchNavswitchNavswitchNav')
    var page = this;
    var id = e.currentTarget.dataset.index
    var id2=e.currentTarget.dataset.itemId  //这个是Devc表中的 devc_id
    getApp().globalData.global_devc_id=id2//全局变量
    if(this.data.currentTab==id){    
        return false;
    }else{
         page.setData({ currentTab: id  }); 
    }
    page.setData({flag:id2});
    this.onQuery_status(id2)
   // this.onQuery_right(e);
  },


  //详情页
    seeDetail:function(event){
      var chartid = event.currentTarget.dataset.chartId;
      var string='';
      var string2 = '../charts/'
      console.log('chartid:',chartid)
      switch (chartid) {
          case '1':
          string = "column"; console.log(1) ;break;
          case '2':
          string = "line"; console.log(2);break;
          case '3':
          string = "pie"; console.log(3); break;
          case '4':
          string = "scrollline"; console.log(4); break;
          default:
          console.log("default");     
        }
      console.log('string:',string);
      string2= string2 + string +'/'+ string
      console.log('string2',string2)     
      getApp().globalData.devc_status_time=this.data.devc_status_time
      var ccc=this.data.devc_status_time
      console.log('getApp().globalData.devc_status_time',getApp().globalData.devc_status_time)
      if( ccc[1].sum_time==0 && ccc[2].sum_time==0&& ccc[3].sum_time==0){
        wx.showToast({
          title: '暂无数据',
          icon: 'loading', //支持"success"、"loading" 
          duration: 500 //提示的延迟时间，单位毫秒，默认：1500 
        })
      }
      else{
        wx.navigateTo({
          // url: string2+'?devc_id='+this.data.devc_status_time
           url: string2
         })
      
      }
   
  },
   //详情页
   seeDetail2:function(event){
    var chartid = event.currentTarget.dataset.chartId;
    var string='';
    var string2 = '../charts/'
    console.log('chartid:',chartid)
    switch (chartid) {
        case '1':
        string = "column"; console.log(1) ;break;
        case '2':
        string = "line"; console.log(2);break;
        case '3':
        string = "pie"; console.log(3); break;
        case '4':
        string = "scrollline"; console.log(4); break;
        default:
        console.log("default");     
      }
    //console.log('string:',string);
    string2= string2 + string +'/'+ string
    //console.log('string2',string2)     
    getApp().globalData.devc_status_time=this.data.devc_status_time
   // var ccc=this.data.devc_status_time
    console.log('getApp().globalData.devc_status_time',getApp().globalData.devc_status_time)
  if(getApp().globalData.producation.length==0){
      wx.showToast({
        title: '暂无数据',
        icon: 'loading', //支持"success"、"loading" 
        duration: 500 //提示的延迟时间，单位毫秒，默认：1500 
      })
    }
    else{
      wx.navigateTo({
        // url: string2+'?devc_id='+this.data.devc_status_time
         url: string2
       })
    
    }
 
},
  //-------添加操作begin---------------------------
  //添加车间窗口弹出------



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
   // console.log('id', this.data.telValue_id)
    console.log('name', this.data.telValue_name)
    this.onShow()

  
  },
  onAdd: function () {//点击按钮添加设备
    const db = wx.cloud.database()
    db.collection('Devc').add({
      data: {
        //_openid:"onqDm5fnuuaOOccmm3cp9KjmfaRg",
        devc_name: this.data.telValue_name,
        //devc_id: this.data.telValue_id,
        devc_id:this.data.devc_length,
        devc_status:3,
        department_id:parseInt(this.data.departmentId),
      
                 
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
      telValue_name:'',
      //telValue_id:''
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
    if (this.endTime - this.startTime < 560) {
      console.log("点击");
    }
  },

  handleLongPress: function (e) {
    var aaa = e.currentTarget.dataset.itemId
    var bbb=e.currentTarget.dataset.mainId
    var that = this
    that.setData({
      re_item_id: aaa,
      _ID:bbb
    })

    console.log("长按");
    console.log("re_depart_id:", this.data.re_item_id);
    this.showDialogBtn()

  },
  //云函数删除数据库
  onRemove: function () {
    var that = this
    console.log('this.data.re_item_id:',this.data.re_item_id)
    console.log('this.data.departmentId:',this.data.departmentId)
    console.log('_id:',this.data._ID)
    wx.cloud.callFunction({
      name: 'remove_devc',
      data: {
        // devc_id: this.data.re_item_id,
        //devc_id:12
        _ID:this.data._ID
        //department_id:this.data.departmentId
      },
      success: res => {
        console.log(res.result),
          that.setData({
            re_depart_id:0,
            flag:this.data.Devc[0].devc_id,
            devc_id:this.data.Devc[0].devc_id,
            currentTab:1
           
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
   * 删除弹窗
   */


  showDialogBtn: function () {

    this.setData({
      showModal: true,
    
      flagg:1 ,
     
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
    this.onCancel()
    this.onRemove()
    this.setData({
      //flag: 0,
     // id:flag,
     flag:this.data.Devc[0].devc_id,
      devc_id:this.data.Devc[0].devc_id
    });
  
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 200,


    })

    this.onLoad()


  },

  //------------------------长按删除end---------------------------

})