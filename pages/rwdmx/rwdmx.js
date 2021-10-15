// pages/rwdmx/rwdmx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shId:'',
    shlx:'',
    shr:'',
    shzt:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.data = options;
    that.data.shr = JSON.parse(wx.getStorageSync('userInfo')).userid;
    that.data.shzt=1;
    app.appGet('/production/getTaskDetail?taskId=' + options.shId,function(res){
      console.log(res);
      res.data.audit_status = res.data.audit_status==1?"已审核":"未审核";
      res.data.task_status = res.data.task_status == 1 ? "正供" : res.data.task_status == 2?"待供":"供毕";
      that.setData(res.data);
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

  },toBack:function(msg){
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    beforePage.loadData(msg);
    wx.navigateBack({
      delta: 1,
    })
  },sh:function(){
    var that=this;
    app.confirm('确认任务单审核通过？',function(){
      app.formPost('qianhe/addShRecord', that.data, function (res) {
        that.toBack(res.msg);
      })
    })
    
  }
})