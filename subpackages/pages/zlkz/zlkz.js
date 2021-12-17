import * as echarts from '../../../ec-canvas/echarts';
import req from '../../../utils/request';
var util = require('../../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    array: [],
    index: -1,
    lx_array: [],
    lx_index: 0,
    dateStart: util.formatDate(new Date()),
    dateEnd: util.formatDate(new Date()), // util.formatDateAdd(new Date(),7),
    pb_data: {
      time: ['2019-01-01'],
      value: [1]
    },
    ysb_data: {
      time: [],
      value: []
    },
    wd_data: {
      time: [],
      value: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.getZhandian();
    this.getType();
    // console.info(this.data.ec_peibi);

  },
  /*
  getZhandian: function () {
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");
    if (userinfo) {
      var userinfoJson = JSON.parse(userinfo);
      var token = wx.getStorageSync("token");
      req({
        url: app.globalData.globalUrl + '/manage/mixingStation/listByRole',
        method: 'GET',
        header: {
          'Authorization': "Bearer " + token
        }
      }).then(res => {
        console.log(res);
        var array = [];
        res.data.rows.forEach(e => {
          array.push(e)
        })
        that.data.array = array;
        that.setData({
          array: that.data.array,
        })
        console.log(that.data.array);
      }).catch(err => {
        console.log(err);
      })
    }
    // var that = this;
    // var userinfo = wx.getStorageSync("userInfo");
    // var userinfoJson = JSON.parse(userinfo);
    // if (userinfo) {
    //   app.appGet('zhandian/getRoleZhandian?role_id=' + userinfoJson.role_id, function (res) {
    //     console.info(res);
    //     var array = [];
    //     var station = wx.getStorageSync("station");
    //     var index = 0;
    //     var i = 0;
    //     res.list.forEach(item => {
    //       const accountInfo = wx.getAccountInfoSync()
    //       array.push(item.zdname);
    //       if (item.zdname == station) {
    //         index = i;
    //       }
    //       if (station == '任丘站(5000型)') {
    //         index = 1;
    //       }
    //       i++;
    //     })
    //     that.setData({
    //       index: index,
    //       array: array
    //     });
    //     that.reload(true);
    //   })
    // }

  },
  */
  reload: function (changeZhangdian) {
    // if (changeZhangdian) {
    //   this.setData({
    //     lx_index: 0
    //   });
    //   this.getType();
    //   this.getZhiliang();
    // } else {
    //   //this.getZhiliang();
    this.getType();
    // }

  },
  getZhiliang: function () {
    // let zhangdian = this.data.array[this.data.index].msName;
    let that = this;
    var data = {};
    // data.zhandian = zhangdian;
    data.bg_time = that.data.dateStart;
    data.ed_time = that.data.dateEnd;
    data.type_name = that.data.lx_array[that.data.lx_index];
    //console.log("参数");
    console.log(data.zhandian + " " + data.bg_time + " " + data.ed_time + " " + data.type_name);
    // console.log(JSON.stringify(data));
    data=JSON.stringify(data)
    console.log(data);
    req({
      url: 'https://test.zgdrkj.cn:8443/cs/api/data/getDataList',
      method: 'POST',
      // header: {
      //   'Authorization': "Bearer " + token
      // },
      data: data,
      dataType: 'json',
    }).then(res => {
      console.log(res);
      var pb_data = {
        time: [],
        value: []
      };
      var wd_data = {
        time: [],
        value: []
      };
      var ysb_data = {
        time: [],
        value: []
      };
      res.data.data[0].pb_data.forEach(item => {
        pb_data.time.push(item.time);
        pb_data.value.push(item.value);
      })
      res.data.data[1].ysb_data.forEach(item => {
        ysb_data.time.push(item.time);
        ysb_data.value.push(item.value);
      })
      res.data.data[2].wd_data.forEach(item => {
        wd_data.time.push(item.time);
        wd_data.value.push(item.value);
      })
      //that.setData({"pb_data":pb_data});
      that.ec_peibi = that.selectComponent('#peibi');
      that.ec_weidu = that.selectComponent('#weidu');
      that.ec_youshi = that.selectComponent('#youshi');
      that.ec_peibi.init((canvas, width, height) => {
        const barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        barChart.setOption(getpeibiOption(pb_data));
        return barChart;
      });
      that.ec_weidu.init((canvas, width, height) => {
        const barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        barChart.setOption(getWeiduOption(wd_data));
        return barChart;
      });
      that.ec_youshi.init((canvas, width, height) => {
        const barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        barChart.setOption(getYouShiOption(ysb_data));
        return barChart;
      });
    }).catch(err => {
      console.log(err);
    })
    // app.formPost('Zhiliang/getZlkz', data, function (res) {
    //   //console.info(res.data[0].pb_data);
    //   var pb_data = {
    //     time: [],
    //     value: []
    //   };
    //   var wd_data = {
    //     time: [],
    //     value: []
    //   };
    //   var ysb_data = {
    //     time: [],
    //     value: []
    //   };
    //   res.data[0].pb_data.forEach(item => {
    //     pb_data.time.push(item.time);
    //     pb_data.value.push(item.value);
    //   })
    //   res.data[1].ysb_data.forEach(item => {
    //     ysb_data.time.push(item.time);
    //     ysb_data.value.push(item.value);
    //   })
    //   res.data[2].wd_data.forEach(item => {
    //     wd_data.time.push(item.time);
    //     wd_data.value.push(item.value);
    //   })
    //   //that.setData({"pb_data":pb_data});
    //   that.ec_peibi = that.selectComponent('#peibi');
    //   that.ec_weidu = that.selectComponent('#weidu');
    //   that.ec_youshi = that.selectComponent('#youshi');
    //   that.ec_peibi.init((canvas, width, height) => {
    //     const barChart = echarts.init(canvas, null, {
    //       width: width,
    //       height: height
    //     });
    //     canvas.setChart(barChart);
    //     barChart.setOption(getpeibiOption(pb_data));
    //     return barChart;
    //   });
    //   that.ec_weidu.init((canvas, width, height) => {
    //     const barChart = echarts.init(canvas, null, {
    //       width: width,
    //       height: height
    //     });
    //     canvas.setChart(barChart);
    //     barChart.setOption(getWeiduOption(wd_data));
    //     return barChart;
    //   });
    //   that.ec_youshi.init((canvas, width, height) => {
    //     const barChart = echarts.init(canvas, null, {
    //       width: width,
    //       height: height
    //     });
    //     canvas.setChart(barChart);
    //     barChart.setOption(getYouShiOption(ysb_data));
    //     return barChart;
    //   });
    // });
  },
  getType: function () {
    let that = this;
    // let zhangdian = that.data.array[that.data.index].msName;
    var data = {};
    // data.zhandian = zhangdian;
    data.bg_time = that.data.dateStart;
    data.ed_time = that.data.dateEnd;
    // console.log(that.data.index);
    // console.log(zhangdian);
    console.log(data);
    // http://test.zgdrkj.cn:8443/cs/api/data/getMaterialsType
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: 'https://test.zgdrkj.cn:8443/cs/api/data/getMaterialsType',
      method: 'POST',
      // header: {
      //   'Authorization': "Bearer " + token
      // },
      data: data,
      dataType: 'json',
    }).then(res => {
      console.log(res);
      var arry = []
      res.data.data.forEach(item => {
        // if (arry.indexOf(item) == -1) {
        arry.push(item);
        // }
      })
      that.setData({
        "lx_array": arry
      });
      that.getZhiliang();
    }).catch(err => {
      console.log(err);
    })
    // app.formPost('Zhiliang/getType', data, function (res) {
    //   var arry = []
    //   res.data.forEach(item => {
    //     if (arry.indexOf(item) == -1) {
    //       arry.push(item);
    //     }
    //   })
    //   that.setData({
    //     "lx_array": arry
    //   });
    //   that.getZhiliang();
    // })
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

  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.getType();
  },

  bindPickerChange_lx: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      lx_index: e.detail.value
    })
    this.reload();
  },

  bindDateChange_start: function (e) {
    this.setData({
      dateStart: e.detail.value
    })
    this.reload(true);
  },
  bindDateChange_end: function (e) {
    this.setData({
      dateEnd: e.detail.value
    })
    this.reload(true);
  }

})

function getpeibiOption(pb_data) {
  var pbtitle = "配比数据图";
  const accountInfo = wx.getAccountInfoSync()
    pbtitle = "配比比例图";

  return {
    color: ['rgb(77,190,61)', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    title: {
      text: pbtitle,
      textStyle: {
        color: "#211613",
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: pb_data.time
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: pb_data.value,
      type: 'line',
      areaStyle: {}
    }]
  };
}


function getWeiduOption(data) {
  var pbtitle = "出料温度数据图";
  const accountInfo = wx.getAccountInfoSync()
    pbtitle = "出料温度比例图";

  return {
    title: {
      text: pbtitle,
      textStyle: {
        color: "#211613",
      }
    },
    color: ['rgb(77,190,61)', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data.value,
      type: 'line',
      areaStyle: {}
    }]
  };
}

function getYouShiOption(data) {
  var pbtitle = "油石比数据图";
  const accountInfo = wx.getAccountInfoSync()
    pbtitle = "油石比比例图";
  return {
    title: {
      text: pbtitle,
      textStyle: {
        color: "#211613",
      }
    },
    color: ['rgb(77,190,61)', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data.value,
      type: 'line',
      areaStyle: {}
    }]
  };
}