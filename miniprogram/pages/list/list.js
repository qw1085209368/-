
var data = {
    "housetype_list": [],
    "style_list": [],
    "area_list": [{
       
        "code": 1
    }, {
      
        "code": 2
    }, {
      
        "code": 3
    }, {
      
        "code": 4
    }, {
      
        "code": 5
    }]
}
Page({
    data: {
        data: [], //数据
        Dp_id: 0, //
        Dv_id: 0, //
        Dc_id: 0, //
        tabTxt: ['车间', '设备', 'Code'], //tab文案
        tab: [true, true, true],
        Department:[],
        Devc:[],
        Alarm:[]
    },
    onLoad:function(){
        this.onQuery_test();
        var self = this;
        self.getFilter();
        this.search()
    },
    onReady: function() {
        //初始化数据
        
      
    },
//查询department begin
onQuery_test: function () {

    const db = wx.cloud.database();
   
    // 查询usertable
    db.collection('Department').get({
      success: res => {
        this.setData({

          Department: res.data,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        console.log('Department: ', this.data.Department)
        for(let i=0;i<this.data.Department.length;i++)
        data.housetype_list.push(this.data.Department[i])
        console.log('data.housetype_list',data.housetype_list)
        console.log('data',data)
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
//查询department end
//查询devc brgin--------------------------------
onQuery: function (id) {
    data.style_list=[]
    const db = wx.cloud.database()
    const _ = db.command
    //var  id=1;
    var that = this
   // if(id!=null){id=id}
    db.collection('Devc').where({department_id:id}).get({
        success: res => {
          that.setData({
            Devc: res.data,
         
          })
          for(let i=0;i<this.data.Devc.length;i++)
          data.style_list.push(this.data.Devc[i])
        console.log('data.style_list',  data.style_list)
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
//查询devc end
//查询alarm begin
search:function(){

  var aa=this.data.Dp_id
 
  var bb=this.data.Dv_id
  var cc = this.data.Dc_id
    const db = wx.cloud.database()

    if(aa&&bb&&cc){
      console.log('devc_id',bb)
      console.log('code', cc)
        db.collection('Alarm').where({devc_id:bb,code:cc}).get({
            success: res => {
              this.setData({
                Alarm: res.data
              })
              console.log('[数据库] [查询记录] 成功: ', res)
              console.log('Alarm: ', this.data.Alarm)
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
    else{
        db.collection('Alarm').get({
            success: res => {
              this.setData({
                Alarm: res.data
              })
              console.log('[数据库] [查询记录] 成功: ', res)
              console.log('Alarm: ', this.data.Alarm)
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
//查询alarm end

    // 选项卡
    filterTab: function(e) {
        var data = [true, true, true],
            index = e.currentTarget.dataset.index;
        data[index] = !this.data.tab[index];
        this.setData({
            tab: data
        })
        console.log('this.data.tab',this.data.tab)
    },
    // 获取筛选项
    getFilter: function() {
        var self = this;
        self.setData({
            filterList: data
        });
        console.log('this.data.filterList',this.data.filterList)
    },
        //筛选项点击操作1
        filter_01: function(e) {
         var aaa="tabTxt["+1+"]"
         this.setData({
             [aaa]:'设备'
         })
            var self = this,
              id = e.currentTarget.dataset.id,
                txt = e.currentTarget.dataset.txt,
                tabTxt = this.data.tabTxt;
                if(id!=null){this.onQuery(id);}
                
                else{  id = e.currentTarget.dataset.codeid}
              
            switch (e.currentTarget.dataset.index) {
                case '0':
                    tabTxt[0] = txt;
                    self.setData({
                        page: 1,
                        data: [],
                        tab: [true, true, true],
                        tabTxt: tabTxt,
                        Dp_id: id,
                   
                    });
                    break;
                case '1':
                    tabTxt[1] = txt;
                    self.setData({
                        page: 1,
                        data: [],
                        tab: [true, true, true],
                        tabTxt: tabTxt,
                        Dv_id: id
                    });
                    break;
                case '2':
                    tabTxt[2] = txt;
                    self.setData({
                        page: 1,
                        data: [],
                        tab: [true, true, true],
                        tabTxt:tabTxt,
                        Dc_id: id
                    });
                    break;
            }
            
        },
    //筛选项点击操作
    filter: function(e) {
        var self = this,
          id = e.currentTarget.dataset.devcid,
          id_code= e.currentTarget.dataset.codeid,
            txt = e.currentTarget.dataset.txt,
            tabTxt = this.data.tabTxt;
            // if(e.currentTarget.dataset.devcid){id=e.currentTarget.dataset.devcid}
            
            // else{  id = e.currentTarget.dataset.codeid}
          
        switch (e.currentTarget.dataset.index) {
            case '0':
                tabTxt[0] = txt;
                self.setData({
                    page: 1,
                    data: [],
                    tab: [true, true, true],
                    tabTxt: tabTxt,
                    Dp_id: id,
               
                });
                break;
            case '1':
                tabTxt[1] = txt;
                self.setData({
                    page: 1,
                    data: [],
                    tab: [true, true, true],
                    tabTxt: tabTxt,
                    Dv_id: id
                });
                break;
            case '2':
                tabTxt[2] ="Code:"+ txt;
                self.setData({
                    page: 1,
                    data: [],
                    tab: [true, true, true],
                    tabTxt: tabTxt,
                    Dc_id: id_code
                });
                break;
        }
        
    },
    //数据处理
    dataFormat: function(d) {
        if (d.data.status == "1") {
            if (d.data.data) {
                var datas = this.data.data.concat(d.data.data),
                    flag = d.data.data.length < 10;
                this.setData({
                    data: datas,
                    disabled: flag ? true : false,
                    moreTxt: flag ? "已加载全部数据" : "点击加载更多",
                    hasMore: true,
                    dataNull: true
                });

            } else {
                this.setData({
                    hasMore: false,
                    dataNull: false
                });
            }
        } else {
            console.log('接口异常！')
        }
        wx.hideToast();
    }
});
