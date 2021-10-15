// pages/cjxz/cjxz.js
var util = require('../../utils/util.js');
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    titleVal: 'basic',
    formData: {},
    bgmc:[{id:'沥青混凝土用细集料试验报告',value:'沥青混凝土用细集料试验报告'},{id:'沥青混凝土用细集料试验报告',value:'沥青混凝土用细集料试验报告'},{id:'沥青混凝土用矿粉试验报告',value:'沥青混凝土用矿粉试验报告'},{id:'沥青混合料稳定度试验报告',value:'沥青混合料稳定度试验报告'},{id:'乳化沥青实验报告',value:'乳化沥青实验报告'},{id:'沥青实验报告',value:'沥青实验报告'}],
    bgmd:[{id:'日常试验',value:'日常试验'},{id:'原材抽检',value:'原材抽检'},{id:'生产抽检',value:'生产抽检'}],
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
    dateTimeArrays: null,
    dateTimes: null,
    startYear: 2000,
    endYear: 2050,
    files: [],
    pfiles: [],
    cindex:0,
    dindex:0
  },
  changeDateTime(e){
    console.log(e)
    this.setData({
      dateTime: e.detail.value,

    });
  },
  changeDateTimes(e){
    console.log(e)
    this.setData({
      dateTimes: e.detail.value,

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
  changeDateTimeColumns(e){
    console.log(e)
    var arr = this.data.dateTimes, dateArr = this.data.dateTimeArrays;
    s
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
     dateTimeArrays: dateArr,
     dateTimes: arr
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
  bgmcChange(e){
    var that = this;
    console.log("**************************");
    console.log(e);
    that.setData({
      cindex: e.detail.value,
    })
  },
  bgmdChange(e){
    var that = this;
    console.log("**************************");
    console.log(e);
    that.setData({
      dindex: e.detail.value,
    })
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
  cancelImg:function(e){//删除图片
    for (var i = 0; i < this.data.files.length;i++){
      if (this.data.files[i] == e.target.dataset.imgurl){
        this.data.files.splice(i,1);
        this.data.pfiles.splice(i,1);
        break;
        }
      }
    this.setData({
      files: this.data.files,
      pfiles: this.data.pfiles
    });
  },
  //上传服务器
  upImgs: function (imgurl, index,ptype) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.url + 'upload/file',//
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: null,
      success: function (res) {
        //console.log(JSON.parse(res.data).data); //接口返回网络路径
        var data = JSON.parse(res.data).data;
        //console.log(data['filePath']); //接口返回网络路径
          //that.data.filePaths.push(data['filePath'])
          // that.setData({
          //   filePaths: that.data.filePaths
          // })
          if(ptype=='附件'){
            that.setData({
              pfiles: that.data.pfiles.concat(data['filePath'])
            });
          }
          console.log(that.data.pfiles)
      }
    })
  },
  chooseImage: function (e) {//选择图片
    var that = this;
    if (that.data.files.length == 10){
      wx.showToast({
        title: "最多上传" +10+"张图片",
        icon:"none",
        duration:2000
      });
      return;
    }
    wx.chooseImage({
      count: 1,//最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        that.upImgs(res.tempFilePaths[0], 0,'附件') 

      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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
    var userinfoJson = JSON.parse(wx.getStorageSync("userInfo"));
    console.log("---------------------------------------");
    let site_supply = this.data.dateTimeArray[0][this.data.dateTime[0]]+'-'+this.data.dateTimeArray[1][this.data.dateTime[1]]+'-'+this.data.dateTimeArray[2][this.data.dateTime[2]]+' '+this.data.dateTimeArray[3][this.data.dateTime[3]]+':'+this.data.dateTimeArray[4][this.data.dateTime[4]]+':'+this.data.dateTimeArray[5][this.data.dateTime[5]]
    let site_supplys = this.data.dateTimeArrays[0][this.data.dateTimes[0]]+'-'+this.data.dateTimeArrays[1][this.data.dateTimes[1]]+'-'+this.data.dateTimeArrays[2][this.data.dateTimes[2]]+' '+this.data.dateTimeArrays[3][this.data.dateTimes[3]]+':'+this.data.dateTimeArrays[4][this.data.dateTimes[4]]+':'+this.data.dateTimeArrays[5][this.data.dateTimes[5]]
    console.log(site_supply);
    console.log(site_supplys);
    console.log(e)
    var data = { 
      projectCarId: 0, 
      sdNumber: e.detail.value.bgbh, 
      project: that.data.project_name,
      reportName: that.data.bgmc[that.data.cindex],
      reportGoal: that.data.bgmd[that.data.dindex],
      syResult: e.detail.value.cjjg,
      ypNumber: e.detail.value.sybh,
      syTime: site_supplys,
      clName: e.detail.value.clmc,
      wtNumber: e.detail.value.wtbh,
      wtUnit: e.detail.value.wtdw,
      projectName:"0",
      ypStatus: that.data.ypzt,
      file:that.data.pfiles,
      syNumber:"0",
      };
      var json = new Array();
      json[0]=data;
      var zdname = wx.getStorageSync("station");
      var zd = app.getServerUrl(zdname);
      var productUrl = app.globalData.serverUrl + zd + '/api/data/addReport';
    wx.request({
      url: productUrl,
      data: JSON.stringify(json),
      method: "POST",
      header: {
        'content-type': 'application/json;utf-8'
      },
      success: function (res) {
        if (res.data.code == 0) {
          // 回调函数
          wx.navigateTo({
            url: '../cjgl/cjgl'
          })
          // s

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
      dateTimeArray: obj.dateTimeArray,
      dateTimes: obj.dateTime,
      dateTimeArrays: obj.dateTimeArray
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