// pages/rwdcx/rwdcx.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    index1: 0,
    index2: 0,
    date: util.formatDate(new Date()),
    date1: util.formatDate(new Date()),
    list: ['双石站'],
    list1: ['生产月报'],
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
      index: e.detail.value
    })
  },
  pickerChange1(e) {
    this.setData({
      index2: e.detail.value
    })
  },
  openTimeModal() {
    this.setData({
      timeModalShow: true
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  DateChange1(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  cancel() {
    this.setData({
      timeModalShow: false
    })
  },
  comfirm() {
    this.setData({
      timeModalShow: false
    })
    this.getList(1);
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
    this.setData({
      list: [wx.getStorageSync("station")]
    })
    this.getList(1);
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    return;
    var that = this;
    console.log("上拉");
    console.log("currentIndex" + that.data.currentIndex);
    console.log("totalCount" + that.data.totalCount);
    console.log("pageSize" + that.data.pageSize);

    var currentIndex = that.data.currentIndex;
    var totalCount = that.data.totalCount;
    var pagesize = that.data.pageSize;
    console.log(currentIndex * pagesize + "-----" + totalCount);
    if ((currentIndex - 1) * pagesize >= totalCount) {

    } else {
      console.log(2);
      that.getList(currentIndex);
    }
    wx.pageScrollTo({
      //scrollTop: 0,
    })
  },
  getList: function (currentIndex) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    var pagesize = that.data.pageSize;
    that.setData({
      oldlist: [],
      reslist: [],
      totalCount: 0
    })
    wx.request({
      url: 'https://test.zgdrkj.cn:8443/' + 'cs' + '/api/data/ajaxMonthList',
      data: {
        product: that.data.list[that.data.index],
        beginDate: that.data.date,
        endDate: that.data.date1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: "GET",
      success: function (res) {
        console.log(res);
        if (res.data.errno == 0) {
          // 回调函数
          const oldData = that.data.oldlist;
          that.setData({
            oldlist: oldData.concat(that.sort(res.data.list)),
            totalCount: res.data.totalCount,
            currentIndex: currentIndex + 1
          })
          // 隐藏加载框
          wx.hideLoading();
        } else {

        }
      }
    })
  },
  //倒叙
  sort: function (list) {
    var newList = [];
    for (var i = list.length - 1; i >= 0; i--) {
      newList.push(list[i]);
    }
    return newList;
  },
  sc: function (e) {
    var year = e.target.dataset.year;
    var month = e.target.dataset.month;
    var station = e.target.dataset.station;
    var state = e.target.dataset.state;
    var that = this;
    // debugger;
    if (state == 0) {
      var data = {
        month: month,
        year: year,
        station: station
      }
      wx.request({
        url: 'https://test.zgdrkj.cn:8443/' + 'cs' + '/api/data/ajaxMonthCreate',
        data: JSON.stringify(data),
        method: "POST",
        contentType: 'application/json;utf-8',
        dataType: "json",
        success: function (res) {
          var path = 'https://test.zgdrkj.cn:8443/' + 'cs' + "/api/data/downloadFile/" + that.data.list[that.data.index] + "月报(" + year + "年" + month + "月).docx";
          console.log(path);
          that.preview(path);
        }
      })
    }
  },
  preview: function (path) {
    wx.downloadFile({
      url: path,
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        //this.webview = Path
        wx.openDocument({
          filePath: Path,
          fileType: "docx",
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log("fail");
            console.log(res)
          },
          complete: function (res) {
            console.log("complete");
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})