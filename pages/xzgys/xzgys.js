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
    listVal: '',
    index: 0,
    applierList: [{
      sys_Material_ID: 0, // 供应商产品
      sys_Material_IDName: '请选择',
      orderAmount: '', // 签订量
      price: '', // 签订价格,
      material_Supplier_ID: '' //供应商id
    }],
    u_Name: '',
    abbreviation: '',
    Carrier:''
  },
  formu_Name: function (e) {
    this.setData({
      u_Name: e.detail.value,
    })
  },
  formabbreviation: function (e) {
    this.setData({
      abbreviation: e.detail.value,
    })
  },
  formCarrier: function (e) {
    this.setData({
      Carrier: e.detail.value,
    })
  },
  addItem() {
    let arr = [...this.data.applierList]
    arr.push({
      sys_Material_ID: 0,
      sys_Material_IDName: '请选择',
      orderAmount: '',
      price: '',
      material_Supplier_ID: ''
    })
    this.setData({
      applierList: [...arr]
    })
  },
  delItem(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.applierList]
    arr.splice(index, 1)
    this.setData({
      applierList: [...arr]
    })
  },
  pickerChange(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.applierList]
    arr[index].sys_Material_ID = this.data.list[e.detail.value].id
    arr[index].sys_Material_IDName = this.data.list[e.detail.value].name
    console.log(arr)
    this.setData({
      applierList: [...arr]
    })
  },
  formInputChange(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.applierList]
    arr[index].orderAmount = e.detail.value
    this.setData({
      applierList: [...arr]
    })
  },
  formInputChange1(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.applierList]
    arr[index].price = e.detail.value
    this.setData({
      applierList: [...arr]
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log(valid, errors)
    })
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
    this.bindycl();
  },
  getSave: function (rew) {
    var that = this;
    var u_Name = that.data.u_Name;
    var abbreviation = that.data.abbreviation;
    var Carrier = that.data.Carrier;
    //console.log(that.data.abbreviation);
    if (u_Name == "") {
      wx.showToast({
        title: '供应商名称不能为空',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    if (abbreviation == "") {
      wx.showToast({
        title: '供应商简称不能为空',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    wx.request({
      url: app.globalData.url + '/gongyingshang/addgongyingshang',
      dataType: 'json',
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        status: 1,
        IsValid: 1,
        u_Name: u_Name,
        abbreviation: abbreviation,
        Carrier:Carrier,
        zdId:wx.getStorageSync('station_id')
      },
      success: function (re) {
        if (re.data.code == 0) {
          let arr = [...that.data.applierList].map(val => {
            return {
              ...val,
              material_Supplier_ID: re.data.data,
              zdId:wx.getStorageSync('station_id')
            }
          })
          //console.log(arr)
          that.setData({
            applierList: arr
          })
          wx.request({
            url: app.globalData.url + '/gongyingshang/addwuliao',
            dataType: 'json',
            method: "post",
            header: {
              "Content-Type": "application/json;utf-8"
            },
            data: that.data.applierList,
            success: function (r) {
              if (r.data.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: "新增成功",
                  showCancel: false,
                  success(rr) {
                    if (rr.confirm) {
                      if (rew == 1) {
                        that.setData({
                          applierList: [{
                            sys_Material_ID: 0, // 供应商产品
                            sys_Material_IDName: '请选择',
                            orderAmount: '', // 签订量
                            price: '', // 签订价格,
                            material_Supplier_ID: '' //供应商id
                          }],
                          u_Name: '',
                          abbreviation: ''
                        })
                      }
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: re.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  bindsave1: function (r) {
    this.getSave(1);
  },
  bindsave: function (res) {
    this.getSave(0);
  },
  bindycl: function (res) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/yuancailiao/getyuancailiaoList1',
      dataType: 'json',
      method: "get",
      data:{
        zdId:wx.getStorageSync('station_id')
      },
      success: function (res) {
        if (res.data.code == 0) {
          var dt = res.data.list;
          var list_array = [];
          for (var i = 0; i < dt.length; i++) {
            var model = {
              id: dt[i].id,
              name: dt[i].u_Name
            };
            list_array[i] = model;
          }
          that.setData({
            list: list_array
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