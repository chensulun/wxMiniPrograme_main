// pages/hjjc/hjjc.js
import * as echarts from '../../../ec-canvas/echarts';
var util = require('../../../utils/util.js');  
var barChart = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_time: util.formatDate(new Date()),
    ed_time: util.formatDate(new Date()),
    date: '',
    date1: '',
    ec: {
      onInit: function (canvas, width, height) {
          barChart = echarts.init(canvas, null, {
            width: width,
            height: height
          });
          canvas.setChart(barChart);
          return barChart;
        }
    },data:{}
    , type:'noise'
    , name:'噪声'
    ,time:[]
    ,value:[]
    ,timer1:{}
  },
  bindDateChange: function (e) {
    this.setData({
      bg_time: e.detail.value
    })
    this.getData();
  },
  bindDateChange1: function (e) {
    this.setData({
      ed_time: e.detail.value
    })
    this.getData();
  },
  getData(restart){
    let that=this;
    let param={};
    param.begin=that.data.bg_time;
    param.end=that.data.ed_time;
    param.type=that.data.type;
    app.formPost('/huanjing/getData',param,function(res){
      console.info(res);
      if(res.code==0){
        var time=[];
        var value=[];
        for(var i=0;i<res.list.length;i++){
          time[i] = res.list[i].addTime;
          value[i] = res.list[i].value;
        }
        that.setData({ data: res.data });
        setTimeout(() => { that.drawEcharts(time,value,that.data.name) }, 100)
      }
      if(restart){
        setTimeout(() => { that.getData(true) }, 1000 * 6)
      }
    },{loading:false})
  },
  drawEcharts (time,value,name) {
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            show: true,
            left: 10,
            top: 20,
            right: 10,
            bottom: 20,
            containLabel: true,
            borderColor: 'transparent'
        },
        xAxis: [{
            type: 'category',
            data: time,
            axisLine: {
                lineStyle: {
                    color: "#999"
                }
            }
        }],
        yAxis: [{
            type: 'value',
            splitNumber: 5,
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: 'rgba(240, 240, 240, 1)'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#333"
                },
            },
            nameTextStyle: {
                color: "#999"
            },
            splitArea: {
                show: false
            }
        }],
        series: [{
            name: name,
            type: 'line',
            data: value,
            lineStyle: {
                normal: {
                    width: 1,
                    color: 'rgba(80, 167, 255, 1)'
                }
            },
            itemStyle: {
                normal: {
                    color: '#fff',
                    borderWidth: 1,
                    /*shadowColor: 'rgba(72,216,191, 0.3)',
                    shadowBlur: 100,*/
                    borderColor: "rgba(80, 167, 255, 1)"
                }
            },
            smooth: true
        }]
    }
    barChart.setOption(option)
  },
  switchType(d) {
    console.info(d);
    this.setData({
      type: d.currentTarget.dataset.type,
      name: d.currentTarget.dataset.name,
    })
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(true);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})