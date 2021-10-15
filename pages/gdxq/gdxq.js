// pages/sbwx/sbwx.js
const app = getApp();
var util = require('../../utils/util.js');
const recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxxg: false,//是否能修改设置项
    wx_bsls: true,
    wxsmCount: 0,
    wxqkCount: 0,
    ycCount: 0,
    lsjv: false,
    address: "",
    equipmentId: null,
    subject: [],
    subjectIndex: 0,
    site: [],
    siteIndex: 0,
    position: [],
    positionIndex: 0,
    explainRepair: "",
    laiyItems: [
      { name: '巡检' },
      { name: '工单', checked: true },
      { name: '现场' }
    ],
    checkboxItems_leibie: [
      { name: '整体更换', checked: true },
      { name: '更换组件' },
      { name: '维修' }
    ],
    checkboxItems_wxzt: [
      { name: '已完成', checked: true },
      { name: '未完成' },
    ],
    wx_wwc: false,
    personRepair_next: ["张三", "李四", "王二"],
    personRepair_nextIndex: 0,
    files: [],
    onrecord: false,
    record_files: [],
    recordingTimeqwe: 0,//录音计时
    sp_files: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accountInfo = wx.getAccountInfoSync()
    if (accountInfo.miniProgram.appId === 'wx605b2b76ff42b6b5') {
      wx.setNavigationBarTitle({
        title: '拌站精灵'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '数智系统'
      })
    }
    this.setData({//设置设备选项列表
      site: app.globalData.zhandian,
      subject: app.globalData.kemu,
      position: app.globalData.weizhi
    });

    if (options.equipmentId != null) {//判断是否为临时维修

      var sbwxInfo = null;//找维修工单记录
      for (var i = 0; i < app.globalData.dbsxResult.wxtz.length; i++) {
        if (options.equipmentId == app.globalData.dbsxResult.wxtz[i].equipmentId) {
          sbwxInfo = app.globalData.dbsxResult.wxtz[i];
          break;
        }
      }

      var subjectIndexTemp = 0;//确定页面维修科目选项
      for (var i = 0; i < this.data.subject.length; i++) {
        if (this.data.subject[i] == sbwxInfo.subjectRepair) {
          subjectIndexTemp = i;
          break;
        }
      };

      var siteTemp = 0;//确定页面维修站点site选项
      for (var i = 0; i < this.data.subject.length; i++) {
        if (this.data.site[i] == sbwxInfo.site) {
          siteTemp = i;
          break;
        }
      };

      var positionTemp = 0;//确定页面维修位置positionRepair选项
      for (var i = 0; i < this.data.subject.length; i++) {
        if (this.data.position[i] == sbwxInfo.positionRepair) {
          positionTemp = i;
          break;
        }
      };

      var wxlbtem = this.data.checkboxItems_leibie;//确定页面维修类别选项
      for (var i = 0; i < wxlbtem.length; i++) {
        if (wxlbtem[i].name == sbwxInfo.categoryRepair) {
          wxlbtem[i].checked = true;
        } else {
          wxlbtem[i].checked = false
        }
      }

      this.setData({
        wxxg: true,//工单维修设置为不能修改
        equipmentId: sbwxInfo.equipmentId,//设置维修id
        subjectIndex: subjectIndexTemp,//设置科目
        siteIndex: siteTemp,
        positionIndex: positionTemp,
        explainRepair: sbwxInfo.explainRepair,//设置维修说明
        checkboxItems_leibie: wxlbtem,//设置维修类别
      });
    } else {
      this.setData({
        wx_bsls: false,//临时维修
      });
    }
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
      address: app.globalData.address
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

  },
  bindsubjectChange: function (e) {
    console.log('维修科目 发生选择改变，携带值为', e.detail.value);
    this.setData({
      subjectIndex: e.detail.value
    })
  },
  bindSiteChange: function (e) {
    this.setData({
      siteIndex: e.detail.value
    })
  },
  bindPositionChange: function (e) {
    this.setData({
      positionIndex: e.detail.value
    })
  },
  laiyCheckboxChange: function (e) {
    console.log('来源 发生change事件，携带value值为：', e.detail.value);
  },
  wxlbCheckboxChange: function (e) {
    console.log('维修类别 发生change事件，携带value值为：', e.detail.value);
  },
  ztCheckboxChange: function (e) {
    console.log('状态 发生change事件，携带value值为：', e.detail.value);
    if (e.detail.value == "未完成") {
      this.setData({
        wx_wwc: true
      })
    } else {
      this.setData({
        wx_wwc: false
      })
    }
  },
  next_personRepairChoose: function (e) {
    console.log('维修人员 发生选择改变，携带值为', e.detail.value);
    this.setData({
      personRepair_nextIndex: e.detail.value
    })

  },
  chooseImage: function (e) {//选择图片
    var that = this;
    if (that.data.files.length == 4) {
      wx.showToast({
        title: "最多上传4张图片",
        icon: "loading",
        duration: 2000
      });
      return;
    }
    wx.chooseImage({
      count: 4,//最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });

        console.log(that.data.files)

      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  //选择视频
  chooseVideo: function () {
    var that = this
    if (that.data.sp_files.length == 4) {
      wx.showToast({
        title: "最多上传4个视频",
        icon: "loading",
        duration: 2000
      });
      return;
    }
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      maxDuration: 30,
      success: function (res) {
        var sp_pathTemp = [];
        sp_pathTemp[0] = res.tempFilePath
        that.setData({
          sp_files: that.data.sp_files.concat(sp_pathTemp)
        });
      }
    })
  },
  startRecorder: function (e) {//开启录音
    var that = this;
    if (that.data.record_files.length == 3) {
      wx.showToast({
        title: "最多上传3个语音",
        icon: "loading",
        duration: 2000
      });
      return;
    }

    if (that.data.onrecord) {
      that.shutRecording();
      return;
    }
    recorderManager.start({
      duration: 30000,
      format: 'mp3'
    })
    recorderManager.onStart(() => {
      console.log('。。。开始录音。。。');
      that.setData({
        onrecord: true
      })
    });
    //将计时器赋值给setInter
    that.data.recordingTimeqwe = 0;
    this.data.setInter = setInterval(
      function () {
        var time = that.data.recordingTimeqwe + 1;
        that.setData({
          recordingTimeqwe: time
        })
      }
      , 1000);

  },
  shutRecording: function () {//停止录音
    var that = this;

    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath);
      clearInterval(that.data.setInter);

      var recorderpathTemp = [];
      recorderpathTemp[0] = res.tempFilePath;
      that.setData({
        record_files: that.data.record_files.concat(recorderpathTemp),
        onrecord: false
      })
    });
  },
  formSubmit: function (e) {
    var that = this;
    var userInfo = JSON.parse(wx.getStorageSync('userInfo'));

    var infoRepair = e.detail.value;//提交参数设置
    infoRepair.inspectingofficer = wx.getStorageSync('username')
    infoRepair.subjectRepair = that.data.subject[infoRepair.subjectRepair];
    infoRepair.site = that.data.site[infoRepair.site];
    infoRepair.positionRepair = that.data.position[infoRepair.positionRepair];
    infoRepair.dateFinish = util.formatDate(new Date());
    if (infoRepair.equipmentId != null && infoRepair.equipmentId != '' && infoRepair.stateRepair == "未完成") {//工单未完成情况
      infoRepair.nextrepair = that.data.personRepair_next[infoRepair.nextrepair];
    } else {
      if (app.globalData.address.indexOf("九龙坡") >= 0) {
        console.log('在')
      }
    }

    var upfiles = (that.data.files.concat(that.data.sp_files)).concat(that.data.record_files);
    if (upfiles.length < 1) {
      wx.showToast({
        icon: 'none',
        title: "请上传现场影像",
        duration: 2000,
      })
    } else {
      wx.request({
        url: app.globalData.url + 'repair/submitRepair',
        data: { userid: userInfo.userid, token: userInfo.token, informationRepairJson: JSON.stringify(infoRepair) },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log(res)
          var successUp = 0; //成功
          var failUp = 0; //失败
          var count = 0; //第几张
          var length = upfiles.length; //总数
          if (res.data.cod == "002") {
            that.uploadOneByOne(upfiles, successUp, failUp, count, length, res.data.data.equipmentId);
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 2000,
            })
          }

        },
        fail: function (res) {
          wx.showToast({
            icon: 'none',
            title: '上传失败',
            duration: 2000,
          })
        },
      })
    }

  },
  toYl: function () {
    app.globalData.imgfile = this.data.files;
    app.globalData.radiofile = this.data.record_files;
    app.globalData.videofile = this.data.sp_files;
    wx.navigateTo({
      url: '/pages/wxyl/wxyl'
    })
  },// 采用递归的方式上传多张
  uploadOneByOne: function (upfiles, successUp, failUp, count, length, equipmentId) {
    var that = this;
    wx.showLoading({
      icon: 'none',
      title: '正在上传第' + count + '个',
    })
    wx.uploadFile({
      url: app.globalData.url + "CommonManager/uploadFile",
      filePath: upfiles[count],
      name: "file",//示例，使用顺序给文件命名,
      formData: { wj_path: app.globalData.wjPath, equipmentId: equipmentId, wxorby: "wx" },
      success: function (e) {
        console.log("wenjiancd" + length)
        successUp++;//成功+1
      },
      fail: function (e) {
        failUp++;//失败+1
      },
      complete: function (e) {
        count++;//下一张
        if (count == length) {
          //上传完毕，作一下提示
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
            complete: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 5
                })
              }, 2000)
            }
          });
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, equipmentId);
        }
      }
    })
  },
  inputWxsm: function (e) {
    var len = e.detail.value.length;
    this.setData({
      wxsmCount: len
    })
  },
  inputWxqk: function (e) {
    var len = e.detail.value.length;
    this.setData({
      wxqkCount: len
    })
  },
  inputWxyc: function (e) {
    var len = e.detail.value.length;
    this.setData({
      ycCount: len
    })
  },
  showlsjv: function () {

    if (this.data.lsjv) {
      this.setData({
        lsjv: false
      })
    } else {
      this.setData({
        lsjv: true
      })
    }

  }
})
