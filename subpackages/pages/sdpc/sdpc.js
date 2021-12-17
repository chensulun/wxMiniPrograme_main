const app = getApp()
import req from '../../../utils/request';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhandianindex: 0,
    cailiaoTypeindex: 0,
    normindex: 0,
    kucun: '',
    date: '请选择'
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // zhandianpickerChange(e) {
  //   var that = this;
  //   that.setData({
  //     zhandianindex: e.detail.value,
  //     station_id: that.data.zhandianlist[e.detail.value].station_id,
  //     zdName: that.data.zhandianlist[e.detail.value].station
  //   })

  // },
  // cailiaoTypeChange(e) {
  //   var that = this;
  //   console.log(that.data.cailiaoTypeList[e.detail.value]);
  //   var child = that.data.cailiaoTypeList[e.detail.value].child;
  //   var norms = [];
  //   for (var i = 0; i < child.length; i++) {
  //     // for (var j = 0; j < that.data.normList.length;j++){
  //     //   if(child[i].id==that.data.normList[j].id){
  //     //     that.setData({
  //     //       normindex:j
  //     //     })
  //     //   }
  //     // }
  //     var normobj = new Object();
  //     normobj.id = child[i].id;
  //     normobj.name = child[i].u_Name;
  //     norms.push(normobj);
  //   }
  //   if (child.length == 0) {
  //     var normobj = new Object();
  //     normobj.id = that.data.cailiaoTypeList[e.detail.value].id;
  //     normobj.name = that.data.cailiaoTypeList[e.detail.value].name;
  //     norms.push(normobj);
  //   }
  //   that.setData({
  //     normList: norms
  //   })
  //   that.setData({
  //     cailiaoTypeindex: e.detail.value,
  //     cailiaoId: that.data.cailiaoTypeList[e.detail.value].id,
  //     clTpye: that.data.cailiaoTypeList[e.detail.value].name,
  //     normList: norms,
  //     clName: norms[0].name,
  //     normindex: 0
  //   })
  // },
  normListChange(e) {
    var that = this;
    that.setData({
      normId: that.data.normList[e.detail.value].materialId,
      clName: that.data.normList[e.detail.value].materialName,
      normindex: e.detail.value,
    })
  },
  formInputChange(e) {
    this.setData({
      kucun: e.detail.value
    })
  },
  bindsave() {
    this.savedata("");
  },
  bindsave1() {
    wx.navigateBack({
      delta: 1,
    })
  },

  savedata: function (backfun) {
    var that = this;
    if (that.data.kucun == "") {
      wx.showToast({
        title: '请输入库存',
        icon: 'none'
      });
      return false;

    }
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    if (regPos.test(that.data.kucun)) {} else {
      wx.showToast({
        title: '库存格式错误',
        icon: 'none'
      });
      return false;
    }
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    var canshu = {
      msId: msId,
      materialId: that.data.normId,
      materialName: that.data.clName,
      mtiValue: that.data.kucun,
      mtiMonth: that.data.date,
    };
    console.log(canshu);
    req({
      url: app.globalData.globalUrl + '/manage/materialTakeInventory',
      method: 'POST',
      header: {
        'Authorization': "Bearer " + token
      },
      data: canshu,
      dataType: 'json',
    }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.showToast({
          title: '操作成功', // 标题
          icon: 'success', // 图标类型，默认success
          duration: 1500 // 提示窗停留时间，默认1500ms
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500)
      }
    }).catch(err => {
      console.log(err);
    })
    //请求参数：zdName: 站点名称，clTpye: 材料类型，clName: 材料名称，inventoryNumber: 库存数量, tjTime: 盘存时间
    // wx.request({
    //   url: app.globalData.url + '/manage/materialTakeInventory',
    //   data: chuandi,
    //   dataType: 'json',
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json; charset=utf-8',
    //     'Authorization': "Bearer " + token
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       if (backfun == "") {
    //         wx.showToast({
    //           title: '操作成功！', // 标题
    //           icon: 'success', // 图标类型，默认success
    //           duration: 1500 // 提示窗停留时间，默认1500ms
    //         })
    //         setTimeout(function () {
    //           wx.switchTab({
    //             url: "/pages/index/index",
    //             success: function (e) {
    //               let page = getCurrentPages().pop();
    //               if (page == undefined || page == null) return;
    //               page.onLoad();
    //             }
    //           })

    //         }, 1500)


    //       } else {
    //         wx.showToast({
    //           title: '操作成功！', // 标题
    //           icon: 'success', // 图标类型，默认success
    //           duration: 1500 // 提示窗停留时间，默认1500ms
    //         })
    //         setTimeout(function () {
    //           that.onShow();
    //         }, 1500)


    //       }

    //     } else {
    //       wx.showToast({
    //         title: res.data.msg, // 标题
    //         icon: 'none'
    //       })
    //     }
    //   },
    //   fail: function (res) {
    //     wx.showToast({
    //       title: res, // 标题
    //       icon: 'none'
    //     })
    //   }

    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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

    that.bindcailiaoTypeList();
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth()) : date.getMonth());
    that.setData({
      date: Y + "-" + M,
      kucun: '',
      zhandianindex: 0,
      cailiaoTypeindex: 0,
      normindex: 0
    })

  },

  bindcailiaoTypeList: function () {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/manage/material/list?msId=' + msId,
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      var norms = res.data.data
      console.log(norms);
      that.setData({
        normList: norms,
        clName: norms[0].materialName
      })
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   type: "GET",
    //   url: app.globalData.url + '/yuancailiao/getyuancailiaoList',
    //   // async: false,
    //   success: function (res) {
    //     var str = '';
    //     var selectchild = "";
    //     var fristchild = "";
    //     var list = res.data.list;
    //     var cailiaoTypeList=[];
    //     for (var i = 0; i < list.length; i++) {
    //       var item = list[i];
    //       if (item.u_Parent == null) {
    //         var child = item.children;
    //         for (var j = 0; j < child.length; j++) {
    //           var val = child[j];
    //           if (fristchild == "") {
    //             fristchild = val;
    //           }
    //           var cailiaoType = new Object();
    //           cailiaoType.id = val.id;
    //           cailiaoType.name = val.u_Name;
    //           cailiaoType.child = val.children;
    //           cailiaoTypeList.push(cailiaoType);
    //           that.setData({
    //             cailiaoTypeList: cailiaoTypeList,
    //             clTpye: cailiaoTypeList[0].name
    //           })
    //         }
    //       }
    //     }
    //     if (fristchild.children.length == 0) {
    //       var normobj = new Object();
    //       normobj.id = fristchild.id;
    //       normobj.name = fristchild.u_Name;
    //       var norms=[];
    //       norms.push(normobj);
    //       that.setData({
    //         normList:norms,
    //         clName: norms[0].name
    //       })
    //     } else {
    //       var childsle = fristchild.children;
    //       var norms = [];
    //       for (var i = 0; i < childsle.length; i++) {
    //         var normobj = new Object();
    //         normobj.id = childsle[i].id;
    //         normobj.name = childsle[i].u_Name;         
    //         norms.push(normobj);           
    //       }
    //       that.setData({
    //         normList: norms,
    //         clName: norms[0].name
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