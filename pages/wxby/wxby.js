// pages/wxby/wxby.js
const app = getApp()
var util = require('../../utils/util.js');
var pramerter = {};//保养进度查询参数列表 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav1: 'weui-bar__item_on',
    nav_panl1: 'block',
    nav2: '',
    nav_panl2: 'none',
    site_array: ['站点'],
    site_index: 0,
    jc_array: ["类别"],
    jc_index: 0,
    zt_array: ['状态', '待保养', '保养中', '已完成'],
    zt_index: 0,
    dateStart: util.formatDate(new Date()),
    dateEnd: util.formatDateAdd(new Date(), 7),
    listByjd:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({//设置设备选项列表
      site_array: this.data.site_array.concat(app.globalData.zhandian),
      jc_array: this.data.jc_array.concat(app.globalData.kemu),
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
    pramerter = {};//保养进度查询参数列表 
    this.getbyjd(pramerter)
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
  navchange: function (res) {
    if (res.target.dataset.nav == 'nav1') {
      this.setData({
        nav1: 'weui-bar__item_on',
        nav_panl1: 'block',
        nav2: '',
        nav_panl2: 'none',
      })
    } else {
      this.setData({
        nav1: '',
        nav_panl1: 'none',
        nav2: 'weui-bar__item_on',
        nav_panl2: 'block',
      })
    }
  },
  bindSiteChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      site_index: e.detail.value
    })
    if (e.detail.value!=0){
      pramerter.site = this.data.site_array[e.detail.value]
    }else{
      delete pramerter.site
    }
    this.getbyjd(pramerter)
    
  },
  bindJcChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jc_index: e.detail.value
    })

    if (e.detail.value != 0) {
      pramerter.categoryMaintenance = this.data.jc_array[e.detail.value]
    } else {
      delete pramerter.categoryMaintenance
    }
    this.getbyjd(pramerter)
  },
  bindZtChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      zt_index: e.detail.value
    })

    if (e.detail.value != 0) {
      pramerter.stateMaintenance = this.data.zt_array[e.detail.value]
    } else {
      delete pramerter.stateMaintenance
    }
    this.getbyjd(pramerter)

  },
  bindDateChange_start: function (e) {
    console.log('日期发送选择改变，携带值为', e.detail.value)

    this.setData({
      dateStart: e.detail.value
    })
    pramerter.datePlan = e.detail.value
    this.getbyjd(pramerter)

  },
  getbyjd:function(prameter){//获取保养进度列表
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");
    prameter.username = wx.getStorageSync("realname")
    if (userinfo) {
      wx.request({
        url: app.globalData.url + 'CommonManager/getByjd',
        data: prameter,
        dataType: 'json',
        success: function (res) {
          app.globalData.listByjd = res.data.data;
          var nowdate=new Date().getTime();
          // for (var i = 0; i < res.data.data.length;i++){
          //   if (res.data.data[i].startBy!=null){
          //     var bydate = new Date(res.data.data[i].startBy).getTime();
          //     res.data.data[i].startBy = Math.ceil((nowdate - bydate) / 24 / 60 / 60 / 1000)
          //   }
            
          // }
          that.setData({
            listByjd: res.data.data
          })
          console.log(res.data.data)
        }
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: "未登录",
        duration: 2000,
      })
    }
  }

})