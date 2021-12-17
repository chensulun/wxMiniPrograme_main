// pages/rwdmx/rwdmx.js
import req from '../../../utils/request';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    shId: '',
    shlx: '',
    shr: '',
    shzt: '1',

    businessKey: '',
    id: '',
    definitionkey: '',
    instancename: '',

    arr: [], //基本信息
    formData: [], //审核
    id: '', //审核id
    input: '', //输入框的值
    btn: undefined, //按钮的值
    checked: '', //按钮选中状态
    controlDefault: '' //同意不同意还要返回原始数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data = options;
    // console.log(that.data);
    // that.data.shr = JSON.parse(wx.getStorageSync('userInfo')).userid;
    that.data.shzt = 1;
    that.setData({
      // code: options.code,
      // shId: options.shId,
      businessKey: that.data.businessKey,
      id: that.data.id,
      definitionkey: that.data.definitionkey,
      instancename: that.data.instancename
    })
    console.log(that.data);
    // app.appGet('/sysProject/getProject?projectId=' + options.shId, function (res) {
    //   //console.log(res);
    //   res.data.project_state = "未审核";
    //   that.setData(res.data);
    // });
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
    this.getDetail(); //基本信息
    this.getType(); //生产主管意见
    this.getInfo(); //签订状态
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
  //获取签订状态
  getInfo: function () {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/task/formDataShow/' + that.data.id,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log();
      var data = res.data.data;
      var form = [];
      for (let i = 0; i < data.length; i++) {
        let strings = data[i].split('--__!!')
        let controlValue = null
        let controlDefault = null
        switch (strings[1]) {
          case 'radio':
            controlValue = 0;
            that.data.controlDefault = strings[4];
            controlDefault = strings[4].split('--__--');
            break;
            // default:
        }
        form.push({
          controlId: strings[0],
          controlType: strings[1],
          controlLable: strings[2],
          controlIsParam: strings[3],
          controlValue: controlValue,
          controlDefault: controlDefault,
        })
      }
      that.data.formData = form;
      that.setData({
        formData: that.data.formData
      });
      console.log(that.data.formData);
    }).catch(err => {
      console.log(err);
    })
  },
  //按钮事件
  //是否选中
  checkedTap: function (e) {
    var that = this;
    var orderNo = e.currentTarget.dataset.value;
    that.data.checked = orderNo;
    that.setData({
      checked: orderNo
    })
    that.data.formData[0].controlValue = (orderNo == '同意' ? 0 : 1);
    console.log(that.data.checked);
  },
  //输入框事件
  inputValue(e) {
    var that = this;
    // console.log(e.detail.value);
    that.setData({
      input: e.detail.value
    })
    that.data.formData[1].controlValue = e.detail.value;
  },
  //获取生产主管意见
  getType: function () {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/historyFromData/ByInstanceId/' + that.data.businessKey,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      // console.log(res);
      that.setData({
        // arr: arr
      })

    }).catch(err => {
      console.log(err);
    })
  },
  //获取基本信息
  getDetail: function name() {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/manage/taskPlan/' + that.data.businessKey,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      var arr = JSON.parse(res.data.data.taskData);
      console.log(arr);
      that.setData({
        arr: arr
      })

    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toBack: function (msg) {
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    beforePage.loadData(msg);
    wx.navigateBack({
      delta: 1,
    })
  },

  sh: function () {
    var that = this;
    var data = that.data.formData;
    data[0].controlDefault = that.data.controlDefault;
    var form = data;
    console.log(form);
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    // console.log( that.data.definitionkey);
    req({
      url: app.globalData.globalUrl + '/task/formDataSave/' + that.data.id + '/' + that.data.businessKey + '/' + encodeURI(that.data.definitionkey) + '/' + encodeURI(that.data.instancename),
      method: 'POST',
      header: {
        'Authorization': "Bearer " + token
      },
      data: form
    }).then(res => {
      console.log(res);
      if (res.data.code == '200') {
        wx.showModal({
          title: '操作成功',
          success(res) {
            wx.navigateBack({
              delta: 1,
            })
          }
        })
      }
    }).catch(err => {
      console.log(err);
    })
    // wx.showModal({
    //   title: '提示',
    //   content: msg,
    //   success(res) {
    //     if (res.confirm && callback) {
    //       callback();
    //     }
    //   }
    // })
    // var that = this;
    // var userinfo = wx.getStorageSync("userInfo");
    // var userinfoJson = JSON.parse(userinfo);
    // app.confirm('确认项目审核通过？', function () {
    //   app.formPost('qianhe/shenhe', {
    //     shr: userinfoJson.userid,
    //     code: that.data.code,
    //     shzt: 1,
    //     shId: that.data.shId,
    //     zd_id: wx.getStorageSync('station_id'),
    //     user_id: userinfoJson.userid,
    //     th_yy: ""
    //   }, function (res) {
    //     that.toBack(res.msg);
    //   })
    // })

  }
})