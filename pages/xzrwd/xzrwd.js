// pages/xzrwd/xzrwd.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    titleVal: 'basic',
    formData: {},
    zzshzt:0,
    task_status:2,
    index:0,
    qlxindex:0,
    url:'http://localhost:8080//',
    xmnoList:[],
    qlxList:[],
    rules: [
      {
        name: 'name',
        rules: { required: true, message: '工程名称必填' },
      },
      {
        name: 'name1',
        rules: { required: true, message: '客户名称必填' },
      }
    ],
    date: '2016-09-01',
    list: [
      {
        id: 0,
        name: '选项1'
      },
      {
        id: 1,
        name: '选项2'
      },
      {
        id: 2,
        name: '选项3'
      }
    ],
    listVal: '',
    index: 0,
    dateTimeArray: null,
    dateTime: null,
    startYear: 2000,
    endYear: 2050
  },
  changeDateTime(e){
    console.log(e)
    this.setData({
      dateTime: e.detail.value,

    });
  },
  changeDateTimeColumn(e){
    console.log(e)
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
     dateTimeArray: dateArr,
     dateTime: arr
    });
  },
  xmnopickerChange(e){
    var that = this;
    console.log("**************************");
    console.log(e);
    that.setData({
      index: e.detail.value,
      project_id: that.data.xmnoList[e.detail.value].project_id,
      custom_name: that.data.xmnoList[e.detail.value].custom_name,
      sgdw: that.data.xmnoList[e.detail.value].sgdw,
     
      project_no: that.data.xmnoList[e.detail.value].project_no,
      project_name: that.data.xmnoList[e.detail.value].project_name
    })
    that.setQlxListInit(that.data.xmnoList[e.detail.value].project_id);
  },
  qlxpickerChange(e){
    var that=this;
    that.setData({
      qlxindex: e.detail.value,
      qlx: that.data.qlxList[e.detail.value].qlx
    })
  },
  radioChange (e) {
    var that=this;
    that.setData({
      task_status: e.detail.value
    })
    console.log(e)
  },
  bindDateChange (e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  bindSiteSupplyChange(e) {
    this.setData({
      siteSupply: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  switchTitle (d) {
    console.log(d)
    this.setData({
      titleVal: d.target.dataset.type
    })
  },
  submitForm(e) {
    var that=this;
    console.log("---------------------------------------");
    let site_supply = this.data.dateTimeArray[0][this.data.dateTime[0]]+'-'+this.data.dateTimeArray[1][this.data.dateTime[1]]+'-'+this.data.dateTimeArray[2][this.data.dateTime[2]]+' '+this.data.dateTimeArray[3][this.data.dateTime[3]]+':'+this.data.dateTimeArray[4][this.data.dateTime[4]]+':'+this.data.dateTimeArray[5][this.data.dateTime[5]]
    console.log(site_supply);
    var data = { 
      project_id: that.data.project_id, 
      project_no: that.data.project_no, 
      custom_name: that.data.custom_name,
      sgdw: that.data.sgdw,
      engineer_name: that.data.project_name,
      concrete_name: that.data.qlx,
      transport_way: e.detail.value.transport_way,
      site_name: e.detail.value.site_name,
      zzshzt: that.data.zzshzt,
      task_status: that.data.task_status,
      plan_amount: e.detail.value.plan_amount,
      append_amount: e.detail.value.append_amount,
      total_amount: e.detail.value.total_amount,
      interval_start: e.detail.value.interval_start,
      scheduled_open: e.detail.value.scheduled_open,
      site_supply: site_supply,
      task_id:0,
      idzhandian: wx.getStorageSync("station_id")
      };
    wx.request({
      url: app.globalData.url + 'production/editTask',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0) {
          // 回调函数
          wx.navigateTo({
            url: '../rwdgl/rwdgl'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }

      }
    })
    // that.selectComponent('#form').validate((valid, errors) => {
    //   debugger;
    //   console.log(valid, errors)

    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray
    });
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
    var that=this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    that.setData({
      date:Y+"-"+M+"-"+D,
      siteSupply: Y + "-" + M + "-" + D
    })
    that.setXmnoListInit();
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
  setXmnoListInit:function(){
    var that=this;
    wx.request({
      type: "GET",
      url: app.globalData.url + '/production/getProjectList',
      data: { idzhandian: wx.getStorageSync("station_id")},
      success: function (res) {
        var str = '';
        var xmnoList1=[];
        console.log(res);
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          var xmno=new Object();

          xmno.project_id = data[i].project_id;
          xmno.custom_name = data[i].custom_name;
          xmno.project_name = data[i].project_name;
          xmno.sgdw = data[i].sgdw;
          xmno.project_no = data[i].project_no;
          xmno.project_no_name = data[i].project_no + " " + data[i].project_name;
          xmnoList1.push(xmno);
        }
        that.setQlxListInit(xmnoList1[0].project_id);
        that.setData({
          xmnoList: xmnoList1,
          project_id: xmnoList1[0].project_id,
          custom_name: xmnoList1[0].custom_name,
          sgdw: xmnoList1[0].sgdw,
          project_no: xmnoList1[0].project_no,
          project_name: xmnoList1[0].project_name
        })
       

      }
    });
  },
  //获取项目的硂类型
  setQlxListInit:function(projectId){
    var that=this;
    wx.request({
      type: "GET",
      url: app.globalData.url + '/production/getProjectFx',
      data: { projectId: projectId },
      success: function (res) {
        var str = "";
        var qlxList1=[];
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          var qlx=new Object();
          qlx.qlx = data[i].qlx;
          qlxList1.push(qlx);
        }
        that.setData({
          qlxList: qlxList1,
          qlx: qlxList1[0].qlx
        });
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})