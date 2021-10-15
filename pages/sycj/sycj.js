// pages/sycj/sycj.js
const app = getApp()
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10,
    oldlist: [],
    reslist: [],
    totalCount: 0
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
    that.setData({
      oldlist: []
    });
    that.getdata(1);
  },
  /**
   * 获取数据
   */
  getdata: function (page){
    var that = this;
    if (page == 1) {
      that.setData({
        oldlist: []
      })
    }
    var zd = wx.getStorageSync("station");
    var api_url = app.globalData.serverUrl + app.getServerUrl(zd);
    that.setData({
      api_url: api_url
    });
    var url = api_url + '/api/data/getSyListBy';
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var data={
      page: page,
      pageSize: that.data.pageSize
    };
    wx.request({
      url: url,
      data: data,
      // method: "POST",
      // // 请求头部
      // header: {
      //   'content-type': 'application/json',
      // },
      success: function (res) {
        console.log(res);
        if (res.data.code ==200) {
          // 回调函数
          const oldData = that.data.oldlist;
          that.setData({
            oldlist: oldData.concat(res.data.data.data),
            totalCount: res.data.totalCount,
            page: page + 1
          })
          // 隐藏加载框
          wx.hideLoading();
        } else {

        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 删除
   */
  del: function (e){
    var that=this;
    var syNumber = e.currentTarget.dataset.synumber;
    console.log(e.currentTarget.dataset);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var url = that.data.api_url+ '/api/data/deleteSy';
          var data={
            syNumber: syNumber
          };
          data = JSON.stringify(data);
          var headers = {
            "Content-Type": "application/json; charset=utf-8",
          };
          console.log(syNumber);
          that.ajaxReq(url, 'post', data, that.deleteSyCallback, headers);
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 继续
   */
  edit:function(e){
    var that = this;
    var item = e.currentTarget.dataset.item;
    var obj = JSON.stringify(item);
    console.log(obj);
    let action = "/pages/sylr/sylr?data=" + obj;
    wx.navigateTo({
      url: action
    })
  },
  /**
   * 删除回调
   */
  deleteSyCallback: function (res){
    var that=this;
    if (res.data.code === 200) {
      wx.showToast({
        title: '数据删除成功', // 标题
        icon: 'success',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      that.getdata(1);
    } else {
      wx.showToast({
        title: '数据删除失败，请稍后再试', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
     
    }
  },
  //请求数据
  ajaxReq: function (url, methods, data = {}, callback, headers = {}) {
    var that = this;
    wx.request({
      url: url,
      data: data,
      method: methods,
      header: headers,
      success: function (res) {
        if (res.data.code == 200) {
          callback(res);
        } else {
          wx.showToast({
            title: res.msg, // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }

      }
    });
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
    console.log("上拉");
    var that = this;
    var currentIndex = that.data.page;
    var totalCount = that.data.totalCount;
    var pagesize = that.data.pageSize;
    console.log(currentIndex * pagesize + "-----" + totalCount);
    if ((currentIndex - 1) * pagesize >= totalCount) {

    } else {
      that.getdata(currentIndex);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})