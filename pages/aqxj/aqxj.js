// pages/sbwx/sbwx.js
const app = getApp();
var util = require('../../utils/util.js');
const recorderManager = wx.getRecorderManager();

Page({

  /** 
   * 页面的初始数据
   */
  data: {
    sidRemark: null,
    wxxg: false, //是否能修改设置项
    address: "",
    allImgSize: 0, //允许图片数
    allVoiceSize: 0, //允许声音数
    allVedioSize: 0, //允许视频数
    aqxj_id: 1,
    aqxj_lx_id: 1,
    position: "",
    positionIndex: 0,
    xjqk: "",
    files: [],
    onrecord: false,
    record_files: [],
    lytip: "点击说话",
    recordingTimeqwe: 0, //录音计时
    sp_files: [],
    imgData: [],
    audioData: [],
    videoData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var chuandi = JSON.parse(options.data);
    that.setData({
      chuandi: chuandi
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
  inputWxsm(e) {
    this.data.sidRemark = e.detail.value
  },
  cancelImg: function (e) { //删除图片
    for (var i = 0; i < this.data.files.length; i++) {
      if (this.data.files[i] == e.target.dataset.imgurl) {
        this.data.files.splice(i, 1);
        break;
      }
    }
    this.setData({
      files: this.data.files
    });
  },
  cancelYuyin: function (e) { //删除语音
    for (var i = 0; i < this.data.record_files.length; i++) {
      if (this.data.record_files[i] == e.target.dataset.yuyinurl) {
        this.data.record_files.splice(i, 1);
        break;
      }
    }
    this.setData({
      record_files: this.data.record_files
    });
  },
  cancelshiping: function (e) { //删除视频
    for (var i = 0; i < this.data.sp_files.length; i++) {
      if (this.data.sp_files[i] == e.target.dataset.shipurl) {
        this.data.sp_files.splice(i, 1);
        break;
      }
    }
    this.setData({
      sp_files: this.data.sp_files
    });
  },
  chooseImage: function (e) { //选择图片
    var that = this;
    if (that.data.files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "张图片",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.chooseImage({
      count: 1, //最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  chooseVideo: function () { //选择视频
    var that = this
    if (that.data.sp_files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "个视频",
        icon: "none",
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
  startRecorder: function (e) { //开启录音
    var that = this;
    if (that.data.record_files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "个录音",
        icon: "none",
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
      that.setData({
        onrecord: true,
        lytip: "停止录音"
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
      }, 1000);
  },
  shutRecording: function () { //停止录音
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      clearInterval(that.data.setInter);
      var recorderpathTemp = [];
      recorderpathTemp[0] = res.tempFilePath;
      that.setData({
        record_files: that.data.record_files.concat(recorderpathTemp),
        onrecord: false,
        lytip: "点击说话",
        recordingTimeqwe: 0
      })
    });
  },

  uploadOneByOnePic: function (upfiles) {
    var that = this;
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync("token");
      for (var i = 0; i < upfiles.length; i++) {
        wx.uploadFile({
          url: app.globalData.globalUrl + "/common/upload",
          filePath: upfiles[i],
          name: "file", //示例，使用顺序给文件命名,
          header: {
            "content-type": "multipart/form-data",
            'Authorization': "Bearer " + token
          },
          success: function (res) {
            // console.log(res);
            var code = JSON.parse(res.data).code;
            var obj = {}
            obj.fileName = JSON.parse(res.data).fileName;
            obj.url = app.globalData.globalUrl + '/' + JSON.parse(res.data).fileName;
            that.data.imgData.push(obj)
            that.setData({
              imgData: that.data.imgData
            })
            console.log(that.data.imgData);
            setTimeout(() => {
              resolve(res)
            }, 2000);
          },
          fail: function (e) {
            console.log(e);
            reject(e)
          },
        })
      }
    })

  },
  uploadOneByOneVid: function (upfiles) {
    var that = this;
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync("token");
      for (var i = 0; i < upfiles.length; i++) {
        wx.uploadFile({
          url: app.globalData.globalUrl + "/common/upload",
          filePath: upfiles[i],
          name: "file", //示例，使用顺序给文件命名,
          header: {
            "content-type": "multipart/form-data",
            'Authorization': "Bearer " + token
          },
          success: function (res) {
            // console.log(res);
            var code = JSON.parse(res.data).code;
            var obj = {}
            obj.fileName = JSON.parse(res.data).fileName;
            obj.url = app.globalData.globalUrl + '/' + JSON.parse(res.data).fileName;
            that.data.videoData.push(obj)
            that.setData({
              videoData: that.data.videoData
            })
            console.log(that.data.videoData);
            setTimeout(() => {
              resolve(res)
            }, 2000);
          },
          fail: function (e) {
            console.log(e);
            reject(e)
          },
        })
      }
    })
  },
  uploadOneByOneAud: function (upfiles) {
    var that = this;
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync("token");
      for (var i = 0; i < upfiles.length; i++) {
        wx.uploadFile({
          url: app.globalData.globalUrl + "/common/upload",
          filePath: upfiles[i],
          name: "file", //示例，使用顺序给文件命名,
          header: {
            "content-type": "multipart/form-data",
            'Authorization': "Bearer " + token
          },
          success: function (res) {
            // console.log(res);
            var code = JSON.parse(res.data).code;
            var obj = {}
            obj.fileName = JSON.parse(res.data).fileName;
            obj.url = app.globalData.globalUrl + '/' + JSON.parse(res.data).fileName;
            that.data.audioData.push(obj)
            that.setData({
              audioData: that.data.audioData
            })
            console.log(that.data.audioData);
            setTimeout(() => {
              resolve(res)
            }, 2000);
          },
          fail: function (e) {
            console.log(e);
            reject(e)
          },
        })
      }
    })
  },

  formSubmit: function (e) {
    var that = this;
    var items = {};
    if (that.data.files.length > 0) {
      items.pic = that.uploadOneByOnePic(that.data.files);
    }
    if (that.data.sp_files.length > 0) {
      items.vid = that.uploadOneByOneVid(that.data.sp_files);
    }
    if (that.data.record_files.length > 0) {
      items.aud = that.uploadOneByOneAud(that.data.record_files);
    }

    Promise.all([items]).then(function (res) {
      console.log(res);
      setTimeout(() => {
        console.log(that.data.imgData);
        console.log(that.data.audioData);
        console.log(that.data.videoData);
        that.submitting(e)
      }, 2000);
    }).catch(function (err) {
      console.log(err);
    });


  },
  submitting(e) {
    var that = this;
    var xjqk = e.detail.value.xjqk; //提交 需要转换和可能会修改到的参数设置
    if (xjqk == null || xjqk == "") {
      wx.showToast({
        icon: 'none',
        title: '异常上报信息必填',
        duration: 2000,
      })
      return false;
    } else {
      var token = wx.getStorageSync("token");
      var msId = wx.getStorageSync("station_id");
      var data = {
        sidId: that.data.chuandi.sidId,
        status: 2,
        sidRemark: that.data.sidRemark,
        imgData: JSON.stringify(that.data.imgData),
        audioData: JSON.stringify(that.data.audioData),
        videoData: JSON.stringify(that.data.videoData)
      }
      console.log(data);
      wx.request({
        url: app.globalData.globalUrl + '/manage/securityInspectionDetails',
        method: 'put',
        header: {
          'Authorization': "Bearer " + token
        },
        data: data,
        dataType: 'json',
        success: function (res) {
          console.log(res);
          that.setData({
            nextmodel: res.data.data,
            nextcode: res.data.code
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 3000,
            complete: function () {
              // wx.navigateBack({
              //   delta: 100,
              // })
            }
          });
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
  }
})