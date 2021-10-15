// pages/ggdb/ggdb.js

const app = getApp()

Page({

  /**
   * 页面的初始数据weui-bar__item_on
   */
  data: {
    nav_css1:'weui-bar__item_on',
    nav_css2:'',
    nav_dbsx:false,
    wxtz:null,
    bytz:null,
    username:null,
    xjtzlist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
    if (options.dbsx=="true"){
      this.setData({
        nav_css1:'',
        nav_css2:'weui-bar__item_on',
        nav_dbsx:true
      })
      wx.setNavigationBarTitle({
        title: '待办事项',
      })
    }else{
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
      wx.setNavigationBarTitle({
        title: '公告通知',
      })
    }
    this.getGonggao();
    this.getSh();
    this.getAqxj();
  },
  getGonggao(){
    var that=this;
    app.formPost('Tongzhi/getAll',{},function(res){
      console.info(res);
      that.setData({'gonggao':res.data.list})
    })
  },
  getSh(){
    var that = this;
    app.appPost('qianhe/getShList', {}, function (res) {
      console.log(res);
      that.setData({
        array: res.list
      })
    });
  },
  getAqxj() {
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");
    if(userinfo=="")
    {
      return;
    }
    app.appPost('safeManage/getxjtz?userId='+JSON.parse(userinfo).userid+'',{}, function (res) {
      console.log(res);
      that.setData({
        xjtzlist: res.list
      })
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
   
    this.setData({
      bytz: app.globalData.dbsxResult.bxtz,
      wxtz: app.globalData.dbsxResult.wxtz,
      username:wx.getStorageSync("username"),
    })//设置待办事项列表
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
   * 顶部导航菜单切换
   */
  navchange:function(res){
    if (res.target.dataset.nav=='nav1'){
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
      wx.setNavigationBarTitle({
        title: '公告通知',
      })
    }else{
      this.setData({
        nav_css1: '',
        nav_css2: 'weui-bar__item_on',
        nav_dbsx: true
      })
      wx.setNavigationBarTitle({
        title: '待办事项',
      })
    }
  },
  syscode: function (e) {
    console.log(e.currentTarget.dataset)
    // wx.navigateTo({
    //   url: "/pages/" + e.currentTarget.dataset.wxby + "/" + e.currentTarget.dataset.wxby + "?equipmentId="+e.currentTarget.dataset.equipmentid
    // })
    wx.scanCode({// 只允许从相机扫码
      onlyFromCamera: true,
      success(sys_res) {
        wx.request({//获取科目编码
          url: app.globalData.url + 'shebei/getShebeiBh',
          data: {
            kemu: e.currentTarget.dataset.kemu
          },
          dataType: 'json',
          success: function (bianmare) {
            console.log("二维码内容"+sys_res.result.key)
            console.log("科目查询编码" + bianmare.data)
            if (sys_res.result.key == bianmare.data) {
              wx.navigateTo({
                url: "/pages/" + e.currentTarget.dataset.wxby + "/" + e.currentTarget.dataset.wxby + "?equipmentId=" + e.currentTarget.dataset.equipmentid
              })
            } else {
              wx.showToast({
                title: "请扫描正确的二维码",
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function (dbsx_res) {
            wx.showToast({
              title: '服务故障，稍后重试',
              icon: 'none',
              duration: 5000
            })
          },
        })
        
      }
    })
  },
})