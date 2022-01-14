// pages/rwpc/rwpc.js
import req from '../../../utils/request';
const app = getApp();
var dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qd_start_time: 0,
    timeModalShow: false,
    bdate: '',
    nav_css1: 'weui-bar__item_on',
    nav_css2: '',
    nav_dbsx: true,
    index: 0,
    bg_time: '开始时间',
    ed_time: '结束时间',
    list: ['时间状态', '状态1', '状态2'],
    list1: ['不限审核', '已审核', '审核中'],
    list_data: [],
    list_ypcdata: [],
    zhandianlist: [],
    zhandianindex: 0,
    rwcount: 0,
    rwwccount: 0,
    rwnumber: 0,
    rwwcnumber: 0,
    selectilall: false,
    zhandianjlindex: 0,
    selectArray: [{
      "id": "20",
      "text": "20KM"
    }, {
      "id": "30",
      "text": "30KM"
    }, {
      "id": "40",
      "text": "40KM"
    }, {
      "id": "50",
      "text": "50KM"
    }, {
      "id": "60",
      "text": "60KM"
    }, {
      "id": "70",
      "text": "70KM"
    }, {
      "id": "80",
      "text": "80KM"
    }, {
      "id": "90",
      "text": "90KM"
    }, {
      "id": "100",
      "text": "100KM"
    }, ],
    total: 0,
    pageSize: 10,
    pageNum: 1,
    AllNum: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nav_css1: '',
      nav_css2: 'weui-bar__item_on',
      nav_dbsx: true
    })
    var that = this;
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    this.setData({
      qd_start_time: obj.dateTime,
      bdate: obj.dateTimeArray
    });
    that.bindUserzdList();
    that.getAllNum()
  },
  aaa: function (res) {
    let that = this;
    console.log(that.data.list_data[res.target.dataset.index].taskSupplyTime);
    this.setData({
      timeModalShow: true,
      that_index: res.target.dataset.index,
    })
    //   console.log(123);
    //   let val=this.data.list_data[res.target.dataset.index].outTime;
    //    this.data.list_data[res.target.dataset.index].outTime='1234';
    // var that=this;
    //   this.setData({
    //     list_data:that.data.list_data
    //   })
    //   console.log(val);
    // console.log(res.target.dataset.index);
  },
  DateStartChange(e) {
    var that = this;
    console.log(123)
    console.log(that.data.list_data[that.data.that_index].outTime)
    this.setData({
      qd_start_time: that.data.list_data[that.data.that_index].outTime,

    });
    var arr = this.data.qd_start_time,
      dateArr = this.data.bdate;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      bdate: dateArr,
      qd_start_time: arr
    })
  },
  changeDateTimeColumn(e) {
    console.log(456)
    var arr = this.data.qd_start_time,
      dateArr = this.data.bdate;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      bdate: dateArr,
      qd_start_time: arr
    });
  },
  cancel() {
    this.setData({
      timeModalShow: false
    })
  },
  comfirm() {
    var that = this;
    that.setData({
      timeModalShow: false
    })
    // let val=this.data.list_data[res.target.dataset.index].outTime;
    let site_supply = this.data.bdate[0][this.data.qd_start_time[0]] + '-' + this.data.bdate[1][this.data.qd_start_time[1]] + '-' + this.data.bdate[2][this.data.qd_start_time[2]] + ' ' + this.data.bdate[3][this.data.qd_start_time[3]] + ':' + this.data.bdate[4][this.data.qd_start_time[4]] + ':' + this.data.bdate[5][this.data.qd_start_time[5]];
    this.data.list_data[this.data.that_index].taskSupplyTime = site_supply;
    var that = this;
    this.setData({
      list_data: that.data.list_data
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
  onShow: function () {},
  //绑定未排程列表
  bindData: function () {
    var that = this;
    var bg_time1 = '';
    var ed_time1 = '';
    that.setData({
      list_data: [],
    })
    wx.request({
      url: app.globalData.url + '/plan/getTaskList',
      data: {
        zd_id: that.data.zhandianlist[that.data.zhandianindex].station_id,
        distance: that.data.selectArray[that.data.zhandianjlindex].id
      },
      dataType: 'json',
      method: "get",
      success: function (res) {
        console.log(res.data);
        that.setData({
          list_data: res.data.data
        })
      }
    })
  },
  //绑定排程列表
  bindYPCData: function () {
    var that = this;
    var pageNum = that.data.pageNum;
    var pagesize = that.data.pageSize;
    if (pageNum == 1) {
      that.setData({
        list_ypcdata: [],
      });
    }
    var bg_time1 = '';
    var ed_time1 = '';
    // that.setData({
    //   list_ypcdata: [],
    // })
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/manage/task/list?msId=' + msId + '&params%5bunStatus%5d=' + 0 + '&pageNum=' + pageNum + '&pageSize=' + pagesize,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        if (that.data.list_ypcdata.length !== 0) {
          that.data.list_ypcdata = that.data.list_ypcdata.concat(res.data.rows)
        } else {
          that.data.list_ypcdata = res.data.rows
        }
        that.setData({
          list_ypcdata: that.data.list_ypcdata,
          total: res.data.total,
        })

      }
    }).catch(err => {
      console.log(err);
    })
    // wx.request({
    //   url: app.globalData.url+'/taskwechat/getYPCTaskList',
    //   data:{
    //     zhandian_id:that.data.zhandianlist[that.data.zhandianindex].station_id
    //   },
    //   dataType: 'json',
    //   method:"get",
    //   success:function(res){
    //     console.log(res.data);
    //     if(res.data.code==0){
    //       that.setData({
    //         list_ypcdata:res.data.list
    //       })
    //     }
    //   }
    // })
  },
  zhandianpickerChange(e) {
    var that = this;
    that.setData({
      zhandianindex: e.detail.value,
    })
    that.bindData();
    that.bindYPCData();
  },
  zhandianjlChange(e) {
    var that = this;
    that.setData({
      zhandianjlindex: e.detail.value,
    })
    that.bindData();
    that.bindYPCData();
    console.log(that.data.zhandianjlindex)
  },
  bindUserzdList() {
    var that = this;
    var userinfo = wx.getStorageSync("userInfo");

    if (userinfo) {
      var userinfoJson = JSON.parse(userinfo);
      wx.request({
        type: "GET",
        url: app.globalData.url + '/zhandian/getRoleZhandian',
        data: {
          role_id: userinfoJson.role_id
        },
        // async: false,
        success: function (res) {
          if (res.data.code == 0) {
            var html = '';
            var zhandianlist1 = [];
            console.log(!wx.getStorageSync("station"));
            for (var i = 0; i < res.data.list.length; i++) {

              if (i == 0 && (wx.getStorageSync("station") == null || !wx.getStorageSync("station"))) {
                console.log("111111111111111111111")
                wx.setStorageSync("station", res.data.list[i].zdname);
                wx.setStorageSync("station_id", res.data.list[i].idzhandian);
                that.setData({
                  zd_name: res.data.list[i].zdname
                })
              }
              var zhandian = new Object();
              zhandian.station = res.data.list[i].zdname;
              zhandian.station_id = res.data.list[i].idzhandian;
              zhandianlist1.push(zhandian);
            }
            for (var i = 0; i < zhandianlist1.length; i++) {
              if (zhandianlist1[i].station_id == wx.getStorageSync("station_id")) {
                that.setData({
                  zhandianindex: i
                })
              }
            }

            that.setData({
              zhandianlist: zhandianlist1
            })
            that.bindData();
            that.bindrwcountandnumber();

          }
        }
      });
    }
  },
  bindrwcountandnumber: function () {
    var that = this;
    that.setData({
      rwcount: 0,
      rwwccount: 0,
      rwnumber: 0,
      rwwcnumber: 0,
    })
    wx.request({
      url: app.globalData.url + '/taskwechat/getrwcountandnumber',
      data: {
        zhandian_id: that.data.zhandianlist[that.data.zhandianindex].station_id
      },
      dataType: 'json',
      method: "get",
      success: function (res) {
        console.log(res);
        that.setData({
          rwcount: res.data.rwcount,
          rwwccount: res.data.rwwccount,
          rwnumber: res.data.rwnumber,
          rwwcnumber: res.data.rwwcnumber,
        })
      }
    })

  },
  navchange: function (res) {
    var that = this;
    //console.info(res);
    if (res.target.dataset.nav == 'nav1') {
      this.setData({
        nav_css1: 'weui-bar__item_on',
        nav_css2: '',
        nav_dbsx: false
      })
      that.bindYPCData();
    } else {
      this.setData({
        nav_css1: '',
        nav_css2: 'weui-bar__item_on',
        nav_dbsx: true
      })
    }
    console.log(that.data.nav_dbsx);
    //console.info(this.data);
  },
  //单选
  select: function (e) {
    let selectValue = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index;
    let list = this.data.list_data
    let newli = 'list_data[' + index + '].checked';
    this.setData({
      [newli]: !this.data.list_data[index].checked
    })
    let num = 0;
    for (var i = 0; i < this.data.list_data.length; i++) {
      if (this.data.list_data[i].checked) {
        num++;
      }
    }
    if (num == this.data.list_data.length) {
      this.setData({
        selectilall: true
      })
    } else {
      this.setData({
        selectilall: false
      })
    }
  },
  //全选，取消全选
  selectAll: function (e) {
    let list = this.data.list_data;
    let selectilall = this.data.selectilall;
    if (selectilall == false) {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list_data[' + i + '].checked';
        this.setData({
          [newli]: true,
          selectilall: true
        })
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        let newli = 'list_data[' + i + '].checked';
        this.setData({
          [newli]: false,
          selectilall: false
        })
      }
    }
  },
  binddelete: function (e) {
    var index = e.currentTarget.dataset.index;
    let list = this.data.list_data;
    list.splice(list.findIndex(index => index === index), 1);
    this.setData({
      list_data: list,
    })
  },
  clickpc: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认排程?',
      success: function (res) {
        console.log(res.confirm)
        if (res.confirm) {
          var index = e.currentTarget.dataset.index;
          let list = that.data.list_data;
          var json = new Array();
          json[0] = {
            id: list[index].id,
            outTime: list[index].outTime,
            project_id: list[index].project_id,
            project_no: list[index].project_no,
            project_name: list[index].project_name,
            status: 'YPC',
            user_id: JSON.parse(wx.getStorageSync('userInfo')).userid,
            zd_id: that.data.zhandianlist[that.data.zhandianindex].station_id,
            status_id: 0,
          };
          wx.request({
            url: app.globalData.url + 'plan/getUpdatePlan',
            data: JSON.stringify(json),
            method: "POST",
            header: {
              'content-type': 'application/json;utf-8'
            },
            success: function (res) {
              if (res.data.code == 0) {
                // 回调函数
                wx.showToast({
                  title: '排程成功！',
                  icon: 'none',
                  duration: 1500,
                  success: function () {

                    setTimeout(function () {
                      wx.navigateTo({
                        url: '../rwpc/rwpc'
                      })
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                });
              }

            }
          })
        }
      }
    })

  },
  selectplan: function (e) {
    wx.navigateTo({
      url: '/subpackages/pages/rwpcselect/rwpcselect',
    })
  },
  allpc: function (e) {
    var msId = wx.getStorageSync("station_id");
    var that = this;
    var list = that.data.list_data;
    console.log(list);
    var obj = {};
    var quantity = 0;
    var addQuantity = 0;
    var taskIds = [];
    var taskPlanProjectIds = [];
    var taskPlanProjectName = [];
    var taskPlanProductionType = [];
    for (var i = 0; i < list.length; i++) {
      console.log(typeof (list[i].taskPlannedQuantity));
      if (typeof (list[i].taskPlannedQuantity) == "number") {
        quantity += list[i].taskPlannedQuantity;
      }
      if (typeof (list[i].taskAddQuantity) == "number") {
        addQuantity += list[i].taskAddQuantity;
      }
      taskIds.push(list[i].taskId);
      taskPlanProjectIds.push(list[i].projectId);
      taskPlanProjectName.push(list[i].projectName);
      taskPlanProductionType.push(list[i].taskProductionType);
    }
    obj = {
      taskIds: Array.from(new Set(taskIds)).join(','),
      taskPlanProjectIds: Array.from(new Set(taskPlanProjectIds)).join(','),
      taskPlanProjectName: Array.from(new Set(taskPlanProjectName)).join(','),
      taskPlanProductionType: Array.from(new Set(taskPlanProductionType)).join(','),
      taskPlanQuantity: quantity,
      taskPlanAddQuantity: addQuantity,
      taskData: JSON.stringify(list),
      msId: msId
    };
    console.log(obj);
    var token = wx.getStorageSync("token");

    if (list.length > 0) {
      req({
        url: app.globalData.globalUrl + '/manage/taskPlan',
        method: 'POST',
        header: {
          'Authorization': "Bearer " + token
        },
        data: obj
      }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            list: []
          })
          wx.showToast({
            title: '排程成功！',
            icon: 'none',
            duration: 1500,
            success: function () {
              setTimeout(function () {
                // that.onLoad();
                wx.navigateTo({
                  url: '../rwpc/rwpc'
                })
              }, 1500)
            }
          })
        }

      }).catch(err => {
        console.log(err);
      })
      // wx.request({
      //   url: app.globalData.url + 'plan/getUpdatePlan',
      //   data: JSON.stringify(json),
      //   method: "POST",
      //   header: {
      //     'content-type': 'application/json;utf-8'
      //   },
      //   success: function (res) {
      //     if (res.data.code == 0) {
      //       wx.showToast({
      //         title: '排程成功！',
      //         icon: 'none',
      //         duration: 1500,
      //         success: function () {

      //           setTimeout(function () {
      //             wx.navigateTo({
      //               url: '../rwpc/rwpc'
      //             })
      //           }, 1500)
      //         }
      //       })
      //     } else {
      //       wx.showToast({
      //         title: res.data.msg,
      //         icon: 'none'
      //       });
      //     }

      //   }
      // })
      // } else {
      //   wx.showToast({
      //     title: '请先选择排程任务！',
      //     icon: 'none',
      //     duration: 1500
      //   })
      // }
    }
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
    console.log("上拉");
    var that = this;
    that.data.pageNum++;
    if (that.data.list_ypcdata.length >= that.data.total) {
      return;
    } else {
      that.bindYPCData();
    }
    console.log(that.data.pageNum);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getAllNum() {
    var that = this;
    var token = wx.getStorageSync("token");
    var msId = wx.getStorageSync("station_id");
    req({
      url: app.globalData.globalUrl + '/production/scheduling/count/110',
      header: {
        'Authorization': "Bearer " + token
      },
    }).then(res => {
      console.log(res);
      var obj = {}
      obj.taskCount = res.data.data.taskCount
      obj.startCount = res.data.data.startCount
      obj.shipCount = res.data.data.shipCount
      obj.planCount = res.data.data.planCount
      that.data.AllNum = obj
      that.setData({
        AllNum: that.data.AllNum 
      })
    }).catch(err => {
      console.log(err);
    })
  }
})