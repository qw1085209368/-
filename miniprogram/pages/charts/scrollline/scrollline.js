var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var startPos = null;
Page({
    data: {
        producation:[]
    },
    touchHandler: function (e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });        
    },
    createSimulationData: function () {
        var categories = [];
        var data = [];
        this.setData({
            producation:getApp().globalData.producation
        })
        console.log('getApp().globalData.producation',getApp().globalData.producation)
        for (var i = 0; i <  getApp().globalData.producation.length; i++) {
            categories.push(getApp().globalData.producation[i].create_time);
            data.push(getApp().globalData.producation[i].count);
           // console.log(' getApp().globalData.producation.length', getApp().globalData.producation[i].count)
        }
        return {
            categories: categories,
            data: data
        }
    },
    onLoad: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        
        var simulationData = this.createSimulationData();
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: simulationData.categories,
            animation: false,
            series: [{
                name: '生产量',
                data: simulationData.data,
                format: function (val, name) {
                    return val.toFixed(2) + '万';
                }
            }],
            xAxis: {
                disableGrid: false
            },
            yAxis: {
                title: '生产指标(万)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    },
});