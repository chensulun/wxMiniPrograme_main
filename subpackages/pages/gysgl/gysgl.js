// pages/rwdgl/rwdgl.js
import req from '../../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    bg_time: '开始时间',
    ed_time: '结束时间',
    list: ['时间状态', '状态1', '状态2'],
    list1: ['不限审核', '已审核', '审核中'],
    list_data: [], //数组
    total: 0,
    pageSize: 10,
    pageNum: 1,
  },
  pickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      bg_time: e.detail.value
    })
    this.bindData();
  },
  bindDateChange1: function (e) {
    this.setData({
      ed_time: e.detail.value
    })
    this.bindData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    that.bindData(1);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉");
    var that = this;
    that.data.pageNum++;
    if (that.data.list_data.length >= that.data.total) {
        return;
    } else {
        that.bindData(pageNum);
    }
    console.log(that.data.pageNum);
},
  //绑定供应商列表
  bindData: function (pageNum) {
    var that = this;
    var bg_time1 = '';
    var ed_time1 = '';
    if (that.data.bg_time != "开始时间") {
      bg_time1 = that.data.bg_time;
    }
    if (that.data.ed_time != "结束时间") {
      ed_time1 = that.data.ed_time;
    }
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/manage/contract/list',
      header: {
        'Authorization': "Bearer " + token
      },
      data: {
        pageNum: pageNum,
        pageSize: 10,
      },
    }).then(res => {
      console.log(res);
      that.setData({
        list_data: res.data.rows,
        total: res.data.total
      })
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   url: app.globalData.url+'/gongyingshang/getSupplierList',
    //   data:{
    //     bg_time:bg_time1,
    //     ed_time:ed_time1,
    //     pageIndex:1,
    //     pageSize:9999,
    //     zdId:wx.getStorageSync('station_id')
    //   },
    //   dataType: 'json',
    //   method:"get",
    //   success:function(res){
    //     if(res.data.code==0){
    //       console.log(res.data.list);
    //       that.setData({
    //         list_data:res.data.list
    //       })
    //     }
    //   }
    // })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})