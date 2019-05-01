var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
Page({
    data: {
        devc_status_time:[]
    },
    touchHandler: function (e) {
        console.log(pieChart.getCurrentDataIndex(e));
    },        
    onLoad: function (e) {
  
        this.setData({
            devc_status_time: getApp().globalData.devc_status_time
        })
        console.log(' this.data.devc_status_time:', this.data.devc_status_time)
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: [{
                title: '2012年度成交量',
                name: '运行时间',
                data: this.data.devc_status_time[1].sum_time,
                // format: function (val) {
                //     return val.toFixed(2) + '万';
                //    }
            }, {
                name: '空闲时间',
                data: this.data.devc_status_time[2].sum_time,
            }, {
                name: '停机时间',
                data: this.data.devc_status_time[3].sum_time,
            }],
        
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });
    }
});