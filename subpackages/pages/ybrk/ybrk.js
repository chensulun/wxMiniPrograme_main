// pages/xzrwd/xzrwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sampleId: '',
    yangpinindex: 0,
    yangpinlist: [
      { name: '请选择', id: '' },
      { name: '样品1', id: 1 },
      { name: '样品2', id: 2 },
      { name: '样品3', id: 3 }
    ]
  },
  yangpinpickerChange(e) {
    var that = this;
    console.log(e);
    that.setData({
      sampleId: that.data.yangpinlist[e.detail.value].sampleId,
      sampleName: that.data.yangpinlist[e.detail.value].sampleName,
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
    var that=this;
    var toCode = options.toCode;
    that.setData({
      toCode: toCode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  formInputChangewtUnit:function(e){
    var that=this;
    that.setData({
      wtUnit:e.detail.value
    })
  },
  formInputChangeprojectName:function(e){
    var that = this;
    that.setData({
      projectName: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getyangpinlist();
  },
  /**
   * 获取样品详情
   */
  getyangpinlist: function () {
    var that=this;
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    wx.request({
      url: app.globalData.serverUrl + zd +'/api/data/getManageInfo',
      data:{toCode:that.data.toCode},
      success: function (res) {
        console.log(res);
        if(res.data.code==200){
          var result=res.data.data;
          that.setData({
            manage:result
          });
        }else{
          wx.showToast({
            title: res.data.msg, // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }
        
      }
    })
  },
  bindsave: function (){
    this.savehoutai("1");
  },
  bindsave1:function(){
    this.savehoutai("");
  },
  savehoutai: function (backfun){
    var that = this;
    var zdname = wx.getStorageSync("station");
    var zd = app.getServerUrl(zdname);
    wx.request({
      url: app.globalData.serverUrl + zd + '/api/data/putManagePC',
      data: { toCode: that.data.toCode, putName: wx.getStorageSync('username')},
      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8'
      },
      success: function (res) {
        if (res.data.code == 200) {
          if (backfun == "") {
            wx.showToast({
              title: '操作成功！', // 标题
              icon: 'success',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
            setTimeout(function () {
              wx.switchTab({
                url: "/pages/index/index",
                success: function (e) {
                  let page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })

            }, 1500)
          } else {
            wx.showToast({
              title: '操作成功！', // 标题
              icon: 'success',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
            setTimeout(function () {
              that.camare();
            }, 1500)
          }

        } else {
          wx.showToast({
            title: res.data.msg, // 标题
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: res, // 标题
          icon: 'none'
        })
      }
    }); 
  },
  /**
   * 扫码
   */
  camare:function(){
    var that=this;
    wx.scanCode({// 只允许从相机扫码
      onlyFromCamera: true,
      success(sys_res) {
        // that.setData({
        //   smModal: true,
        //   modal:true
        // })
        console.log(sys_res);
        var toCode = sys_res.result;
        that.setData({
          toCode:toCode
        })
        that.getyangpinlist();
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