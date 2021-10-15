// pages/bdcx/bdcx.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    index1: 0,
    dateS:"",
    dateE:"",
    list: ['不限性质', '正式合同', '现金合同', '临时属性'],
    list1: [],
    timeModalShow: false,
    currentIndex: 1,
    oldlist: [],
    reslist: [],
    totalCount: 0,
    pageSize: 10
  },
  pickerChange(e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value,
      currentIndex: 1,
      oldlist: [],
      reslist: [],
      totalCount: 0,
      pageSize: 10
    })
    // todo 更新列表数据
    this.getList(1);
  },
  pickerChange1(e) {
    this.setData({
      index1: e.detail.value,
      currentIndex: 1,
      oldlist: [],
      reslist: [],
      totalCount: 0,
      pageSize: 10
    })
    this.getList(1);
  },
  openTimeModal() {
    this.setData({
      timeModalShow: true
    })
  },
  DateChangeS(e) {
    this.setData({
      dateS: e.detail.value
    })
  },
  DateChangeE(e) {
    this.setData({
      dateE: e.detail.value
    })
  },
  cancel() {
    this.setData({
      timeModalShow: false
    })
  },
  comfirm() {
    this.setData({
      timeModalShow: false,
      currentIndex: 1,
      oldlist: [],
      reslist: [],
      totalCount: 0,
      pageSize: 10
    })
    // todo 更新列表数据
    this.getList(1);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getList(1);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log("上拉");
    console.log("currentIndex" + that.data.currentIndex);
    console.log("totalCount"+that.data.totalCount);
    console.log("pageSize" + that.data.pageSize);
    
    var currentIndex = that.data.currentIndex;
    var totalCount = that.data.totalCount;
    var pagesize = that.data.pageSize;
    console.log(currentIndex * pagesize + "-----" + totalCount);
    if ((currentIndex-1) * pagesize >= totalCount) {
      
    } else {
      console.log(2);
      that.getList(currentIndex);
    }
    wx.pageScrollTo({
      //scrollTop: 0,
    })
  },
  getList: function (currentIndex){
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var pagesize = that.data.pageSize;
    var project_type="";

    var project_state = "";
    var addTimes=that.data.dateS;
    var addTimee=that.data.dateE;
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    console.log(zd);
    var productUrl = app.globalData.serverUrl + zd + '/api/data/getShipmentList';
    var producttypeUrl = app.globalData.serverUrl + zd + '/api/data/getShipmentTypeList';
    console.log(addTimes)
    console.log(addTimee)
    console.log(that.data.index1)
    wx.request({
      url: producttypeUrl,
      data: { beginDate: addTimes, endDate: addTimee},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: "GET",
      success: function (res) {
        if (res.data.errno == 0) {
          // 回调函数
          console.log(res.data.list)
          const oldData = that.data.list1;
          that.setData({
            list1: oldData.concat(res.data.list),
          })
          // 隐藏加载框
        } 
      }
    })
    wx.request({
      url: productUrl,
      data: { page: currentIndex, pageSize: pagesize, beginDate: addTimes, endDate: addTimee,type:that.data.list1.length==0?"":that.data.list1[that.data.index1]},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: "GET",
      success: function (res) {
        console.log(res.data);
        if (res.data.errno == 0) {
          // 回调函数
          const oldData = that.data.oldlist;
          console.log(res.data.list)
          that.setData({
            oldlist: oldData.concat(res.data.list),
            totalCount: res.data.num,
            currentIndex: currentIndex + 1
          })
          // 隐藏加载框
          wx.hideLoading();
        } else {
          
        }
      }
    })
  }
})