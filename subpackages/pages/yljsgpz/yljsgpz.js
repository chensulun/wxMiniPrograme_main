// pages/xzrwd/xzrwd.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        id: 11,
        name: '选项1'
      },
      {
        id: 22,
        name: '选项2'
      },
      {
        id: 33,
        name: '选项3'
      }
    ],
    type: '',
    typeIndex: 0,
    projectlist: [],
    project: '',
    projectIndex: 0,
    name: '', // 项目名称
    azwzlist: [{
      id: 1,
      name: "左前"
    }, {
      id: 2,
      name: "左后"
    }, {
      id: 3,
      name: "右前"
    }, {
      id: 4,
      name: "右后"
    }],
    azjl_list: [{
      id: 1,
      name: "0.1m"
    }, {
      id: 2,
      name: "0.2m"
    }, {
      id: 3,
      name: "0.3m"
    }, {
      id: 4,
      name: "0.4m"
    }, {
      id: 5,
      name: "0.5m"
    }, {
      id: 6,
      name: "0.6m"
    }, {
      id: 7,
      name: "0.7m"
    }, {
      id: 8,
      name: "0.8m"
    }, {
      id: 9,
      name: "0.9m"
    }, {
      id: 10,
      name: "1.0m"
    }, {
      id: 11,
      name: "1.1m"
    }, {
      id: 12,
      name: "1.2m"
    }, {
      id: 13,
      name: "1.3m"
    }, {
      id: 14,
      name: "1.4m"
    }, {
      id: 15,
      name: "1.5m"
    }, {
      id: 16,
      name: "1.6m"
    }, {
      id: 17,
      name: "1.7m"
    }, {
      id: 18,
      name: "1.8m"
    }, {
      id: 19,
      name: "1.9m"
    }, {
      id: 20,
      name: "2.0m"
    }],
    applierList: [{
      sb_code: '',
      cxy_code: '',
      dwzz_code: '',
      azwz_index: 0,
      azjl_index: 0,
      sgkd:'',
      pb_code: ''
    }],
    successShow: false, // 成功提示框是否显示
    errorShow: false
  },
  successModalHide() {
    this.setData({
      successShow: false
    })
  },
  errorModalHide() {
    this.setData({
      errorShow: false
    })
  },
  addItem() {
    let arr = [...this.data.applierList]
    arr.push({
      sb_code: '',
      cxy_code: '',
      dwzz_code: '',
      azwz_index: 0,
      azjl_index: 0,
      sgkd:'',
      pb_code: ''
    })
    this.setData({
      applierList: [...arr]
    })
  },
  delItem(e) {
    let index = e.target.dataset.index
    let arr = [...this.data.applierList]
    arr.splice(index, 1)
    this.setData({
      applierList: [...arr]
    })
  },
  typePickerChange(e) {
    this.setData({
      [`${e.currentTarget.dataset.field}`]: e.detail.value
    })
  },
  pickerChange(e) {
    let index = e.target.dataset.index
    let field = e.target.dataset.field
    this.setData({
      [`applierList[${index}].${field}`]: e.detail.value
    })
  },
  // 普通输入框
  inputChange(e) {
    this.setData({
      [`${e.target.dataset.field}`]: e.detail.value
    })
  },
  // 铺摊机信息-多数据输入框
  formInputChange(e) {
    console.log(e)
    let index = e.target.dataset.index
    let field = e.target.dataset.field
    this.setData({
      [`applierList[${index}].${field}`]: e.detail.value
    })
    console.log(this.data.applierList)
  },
  submitForm() {

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
  //获取项目
  getProjectList: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/sgpz/getXmList',
      data: {
        zhanidanid: wx.getStorageSync("station_id")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: "GET",
      success: function (res) {
        that.setData({
          projectlist: res.data.data
        })
      }
    })
  },
  //绑定
  bindsave: function () {
    var project_id = this.data.projectlist[this.data.projectIndex].id;
    console.log(project_id);
    console.log(this.data.applierList);
    var data = {
      project_id: project_id,
      type: '压路机',
      zhandian_id: wx.getStorageSync("station_id"),
      list: []
    };
    var list = [];
    this.data.applierList.forEach(item => {
      var dic = {
        azjl: '0m',
        azwz: '右前',
        cxy_code: item.cxy_code,
        dwzz_code: item.dwzz_code,
        pb_code: item.pb_code,
        sb_code: item.sb_code,
        sgkd:item.sgkd,
        hj_code: ''
      };

      list.push(dic);
    });
    data.list = list;
    wx.request({
      url: app.globalData.url + '/sgpz/createSgpz',
      data: JSON.stringify(data),
      header: {
        'content-type': 'application/json;utf-8'
      },
      dataType: 'json',
      method: "POST",
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {

        }
      }
    })
    console.log(data);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getProjectList();
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

  scanCode(e) {
    let index = e.currentTarget.dataset.index;
    let field = e.currentTarget.dataset.field;
    var that=this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var result = JSON.parse(res.result);
        if (result.type === null || result.type === undefined) {
          wx.showToast({
            title: '错误二维码',
            icon: 'none',
            duration: 1000
          })
        } else {
          that.setData({
            [`applierList[${index}].${field}`]: result.key
          })
          console.log(that.data.applierList)
        }
      }
    })
  }
})