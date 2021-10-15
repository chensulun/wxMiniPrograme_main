// pages/xzrwd/xzrwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bianhao: 'BH2345636',
    name: '样品1',
    danwei: '委托单位',
    projectName: '项目名称',
    status: '检验中...'
  },
  yangpinpickerChange(e) {
    var that = this;
    console.log(e);
    that.setData({
     yangpinid: '',
     yangpinindex: e.detail.value,
    })
  
  },
  formInputChange(e) {
    this.setData({
      kucun: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var toCode = options.toCode;
    that.setData({
      toCode: toCode
    })
    var bianhao = options.id;
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    var action = app.globalData.serverUrl + zd + '/api/data/getManageInfo?toCode='+bianhao;
    console.info(app.globalData);
    app.appGet2(action,{'succCode':200},function(res){
      console.info(res);
      var status = res.data.manageState;
      that.setData({
        bianhao:res.data.toCode,
        name: res.data.sampleName,
        danwei:res.data.wtUnit,
        projectName:res.data.projectName, 
        status:status
      })
    })
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
    //this.getdata();
  },
  getdata:function(){
    var that = this;
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    wx.request({
      url: app.globalData.serverUrl + "shuangshi" + 'api/data/getManageInfo',
      data: { toCode: that.data.toCode},
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            detail:that.data.data
          })
        }else{
          wx.showToast({
            title: res.data.msg, // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }
      }
    })
  },
  /**
   * 结束
   */
  bindsave:function(){
    wx.switchTab({
      url: "/pages/index/index",
      success: function (e) {
        let page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  /**
   * 扫一扫
   */
  bindsave1:function(){
    var that = this;
    wx.scanCode({        //扫描API
      success: function (res) {
        console.log("输出----------------");
        console.log(res);    //输出回调信息
        var result = JSON.parse(res.result);
        if (result.type = "xj") {
          if (result.wz != that.data.chuandi.wz || result.code != that.data.chuandi.code) {
            wx.showToast({
              title: "请扫描正确位置二维码",
              icon: "none",
              duration: 2000
            });
          } else {
            
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: "请扫描正确二维码",
            duration: 2000,
          })
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