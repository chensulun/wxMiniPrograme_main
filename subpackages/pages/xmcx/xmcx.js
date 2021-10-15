// pages/rwdcx/rwdcx.js
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
    list1: ['不限审核', '已审核', '审核中','退回'],
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
    if(that.data.index==1)
    {
      project_type ="zsht";
    }
    if(that.data.index==2)
    {
      project_type ="xjht";
    }
    if(that.data.index==3)
    {
      project_type ="lssx";
    }

    var project_state = "";
    if(that.data.index1==1)
    {
      project_state="1";
    }
    if(that.data.index1==2)
    {
      project_state="0";
    }
    if(that.data.index1==3)
    {
      project_state="-1";
    }
    var addTimes=that.data.dateS;
    var addTimee=that.data.dateE;
    wx.request({
      url: app.globalData.url + '/sysProject/getProjectList',
      data: { currentIndex: currentIndex, pageSize: pagesize, project_type: project_type, project_state: project_state, addTimes: addTimes, addTimee: addTimee, zhanidanid: wx.getStorageSync("station_id")},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: "GET",
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          // 回调函数
          const oldData = that.data.oldlist;
          that.setData({
            oldlist: oldData.concat(res.data.list),
            totalCount: res.data.totalCount,
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