// pages/xzrwd/xzrwd.js
import req from '../../../utils/request';
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
    applierList: [{}],
    supplierName: '',
    supplierAbbreviation: '',
    supplierRepresentative: '',
    supplierPhone: '',
  },
  formSupplierName: function (e) {
    this.setData({
      supplierName: e.detail.value,
    })
  },
  formSupplierAbbreviation: function (e) {
    this.setData({
      supplierAbbreviation: e.detail.value,
    })
  },
  formSupplierRepresentative: function (e) {
    this.setData({
      supplierRepresentative: e.detail.value,
    })
  },
  formSupplierPhone: function (e) {
    this.setData({
      supplierPhone: e.detail.value,
    })
  },
  addItem() {
    let arr = [...this.data.applierList]
    arr.push({})
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
    arr[index].materialId = this.data.list[e.detail.value].materialId
    arr[index].materialName = this.data.list[e.detail.value].materialName
    console.log(arr)
    this.setData({
      applierList: [...arr]
    })
  },
  formInputChange(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.applierList]
    arr[index].quantity = e.detail.value
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
    var supplierName = that.data.supplierName;
    var supplierAbbreviation = that.data.supplierAbbreviation;
    var supplierRepresentative = that.data.supplierRepresentative;
    var supplierPhone = that.data.supplierPhone;
    if (supplierName == "") {
      wx.showToast({
        title: '供应商名称不能为空',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    if (supplierAbbreviation == "") {
      wx.showToast({
        title: '供应商简称不能为空',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");

    var data = {
      supplierName,
      supplierAbbreviation,
      supplierRepresentative,
      supplierPhone,
    }
    console.log(data);
    req({
      url: app.globalData.globalUrl + '/manage/supplier', //基本信息
      method: 'POST',
      header: {
        'Authorization': "Bearer " + token
      },
      data: JSON.stringify(data),
      dataType: 'json',
    }).then(res => {
      if (res.data.code == 200) {
        let arr = [...that.data.applierList].map(val => {
          return {
            ...val,
          }
        })
        var contractQuantity = 0;
        var contractAmount = 0;
        arr.forEach(
          e => {
            contractQuantity += Number(e.quantity);
            contractAmount += Number(e.price * e.quantity);
          }
        )
        var arrjson = JSON.stringify(arr)
        var data = {
          contractSupplierName: supplierName,
          contractSupplierAbbreviation: supplierAbbreviation,
          contractSupplierRepresentative: supplierRepresentative,
          contractSupplierPhone: supplierPhone,
          contractMaterialData: arrjson,
          inputMaterialList: arr,
          contractQuantity: contractQuantity,
          contractAmount: contractAmount
        }
        console.log(data);
        req({
          url: app.globalData.globalUrl + '/manage/contract', //签订信息
          method: 'POST',
          header: {
            'Authorization': "Bearer " + token
          },
          data: JSON.stringify(data),
          dataType: 'json',
        }).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: "操作成功",
              icon: "success",
              duration: 2000,
              success() {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
          } else {
            wx.showToast({
              title: "操作失败",
              icon: "error",
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   url: app.globalData.url + '/gongyingshang/addgongyingshang',
    //   dataType: 'json',
    //   method: "post",
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   data: {
    //     status: 1,
    //     IsValid: 1,
    //     supplierName: supplierName,
    //     supplierAbbreviation: supplierAbbreviation,
    //     supplierRepresentative:supplierRepresentative,
    //     supplierPhone:supplierPhone,
    //     zdId:wx.getStorageSync('station_id')
    //   },
    //   success: function (re) {
    //     if (re.data.code == 0) {
    //       let arr = [...that.data.applierList].map(val => {
    //         return {
    //           ...val,
    //           material_Supplier_ID: re.data.data,
    //           zdId:wx.getStorageSync('station_id')
    //         }
    //       })
    //       //console.log(arr)
    //       that.setData({
    //         applierList: arr
    //       })
    //       wx.request({
    //         url: app.globalData.url + '/gongyingshang/addwuliao',
    //         dataType: 'json',
    //         method: "post",
    //         header: {
    //           "Content-Type": "application/json;utf-8"
    //         },
    //         data: that.data.applierList,
    //         success: function (r) {
    //           if (r.data.code == 0) {
    //             wx.showModal({
    //               title: '提示',
    //               content: "新增成功",
    //               showCancel: false,
    //               success(rr) {
    //                 if (rr.confirm) {
    //                   if (rew == 1) {
    //                     that.setData({
    //                       applierList: [{
    //                         sys_Material_ID: 0, // 供应商产品
    //                         sys_Material_IDName: '请选择',
    //                         quantity: '', // 签订量
    //                         price: '', // 签订价格,
    //                         material_Supplier_ID: '' //供应商id
    //                       }],
    //                       supplierName: '',
    //                       supplierAbbreviation: ''
    //                     })
    //                   }
    //                 }
    //               }
    //             })
    //           }
    //         }
    //       })
    //     } else {
    //       wx.showModal({
    //         title: '提示',
    //         content: re.data.msg,
    //         showCancel: false
    //       })
    //     }
    //   }
    // })
  },
  cancel: function () {
    wx.navigateBack({
      delta: 1,
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
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/manage/material/list',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      var arr = res.data.data.slice(4)
      that.setData({
        list: arr
      })
      console.log(that.data.list);
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   url: app.globalData.url + '/yuancailiao/getyuancailiaoList1',
    //   dataType: 'json',
    //   method: "get",
    //   data: {
    //     zdId: wx.getStorageSync('station_id')
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       var dt = res.data.list;
    //       var list_array = [];
    //       for (var i = 0; i < dt.length; i++) {
    //         var model = {
    //           id: dt[i].id,
    //           name: dt[i].supplierName
    //         };
    //         list_array[i] = model;
    //       }
    //       that.setData({
    //         list: list_array
    //       })
    //     }
    //   }
    // })
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