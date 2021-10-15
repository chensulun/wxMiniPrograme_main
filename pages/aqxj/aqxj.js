// pages/sbwx/sbwx.js
const app = getApp();
var util = require('../../utils/util.js');
const recorderManager = wx.getRecorderManager();

Page({

  /** 
   * 页面的初始数据
   */
  data: {
    wxxg:false,//是否能修改设置项
    address:"",
    allImgSize:0,//允许图片数
    allVoiceSize:0,//允许声音数
    allVedioSize:0,//允许视频数
    aqxj_id:1,
    aqxj_lx_id:1,
    position: "",
    positionIndex:0,
    xjqk:"",
    files: [],
    onrecord:false,
    record_files:[],
    lytip:"点击说话",
    recordingTimeqwe: 0,//录音计时
    sp_files:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var chuandi = JSON.parse(options.data);
    console.log(chuandi);
    that.setData({
      aqxj_id: chuandi.aqxj_id,
      aqxj_lx_id: chuandi.aqxj_lx_id,
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
  cancelImg:function(e){//删除图片
    for (var i = 0; i < this.data.files.length;i++){
      if (this.data.files[i] == e.target.dataset.imgurl){
        this.data.files.splice(i,1);
        break;
        }
      }
    this.setData({
      files: this.data.files
    });
  },
  cancelYuyin: function (e) {//删除语音
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
  cancelshiping: function (e) {//删除视频
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
  chooseImage: function (e) {//选择图片
    var that = this;
    if (that.data.files.length == 10){
      wx.showToast({
        title: "最多上传" +10+"张图片",
        icon:"none",
        duration:2000
      });
      return;
    }
    wx.chooseImage({
      count: 1,//最多可以选择的图片张数
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
    if (that.data.sp_files.length==10) {
      wx.showToast({
        title: "最多上传" + 10+"个视频",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      maxDuration:30,
      success: function (res) {
        var sp_pathTemp = [];
        sp_pathTemp[0] = res.tempFilePath
        that.setData({
          sp_files: that.data.sp_files.concat(sp_pathTemp)
        });
      }
    })
  },
  startRecorder:function(e){//开启录音
    var that=this;

    if (that.data.record_files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "个录音",
        icon: "none",
        duration: 2000
      });
      return;
    }
  
    if (that.data.onrecord){
      that.shutRecording();
      return;
    }
    recorderManager.start({
      duration:30000,
      format: 'mp3'
    })
    recorderManager.onStart(() => {
      console.log('。。。开始录音。。。');
      that.setData({
        onrecord:true,
        lytip:"停止录音"
      })
    });
    //将计时器赋值给setInter
    that.data.recordingTimeqwe=0;
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

      var recorderpathTemp=[];
      recorderpathTemp[0] = res.tempFilePath;
      that.setData({
        record_files: that.data.record_files.concat(recorderpathTemp),
        onrecord: false,
        lytip:"点击说话",
        recordingTimeqwe:0
      })
    });
  },
  formSubmit: function (e) {
    var that = this;
    if (that.data.files.length < this.data.allImgSize) {
      wx.showToast({
        title: "需要最少上传" + this.data.allImgSize + "张图片",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (that.data.sp_files.length < this.data.allVedioSize) {
      wx.showToast({
        title: "需要最少上传" + this.data.allVedioSize + "个视频",
        icon: "none",
        duration: 2000
      });
      return;
    }

    if (that.data.record_files.length < this.data.allVoiceSize) {
      wx.showToast({
        title: "需要最少上传" + this.data.allVoiceSize + "个录音",
        icon: "none",
        duration: 2000
      });
      return;
    }


    var userInfo = JSON.parse(wx.getStorageSync('userInfo'));

    var xjqk = e.detail.value.xjqk;//提交 需要转换和可能会修改到的参数设置
    if(xjqk==null || xjqk==""){
      wx.showToast({
        icon: 'none',
        title: '异常上报信息必填',
        duration: 2000,
      })
      return false;
    }else{
      var upfiles = (that.data.files.concat(that.data.sp_files)).concat(that.data.record_files);
      console.log(upfiles);
      wx.request({
        url: app.globalData.url + 'wxaqxj/updateXjqk',
        data: { aqxj_id: that.data.aqxj_id, aqxj_lx_id: that.data.aqxj_lx_id, xjqk: xjqk},
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log(res);
          that.setData({
            nextmodel:res.data.data,
            nextcode:res.data.code
          })

          var successUp = 0; //成功
          var failUp = 0; //失败
          var count = 0; //第几张
          var length = upfiles.length; //总数
          if ( upfiles.length > 0) {
            that.uploadOneByOne(upfiles, successUp, failUp, count, length, that.data.aqxj_lx_id);
          } else if ( upfiles.length == 0) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                that.jixuwx();
              }
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 2000,
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 5
              })
            }, 2000)
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
    

  },// 采用递归的方式上传多张
  uploadOneByOne: function (upfiles, successUp, failUp, count, length, aqxj_lx_id){
    var that = this;
    wx.showLoading({
      icon:'none',
      title: '正在上传第' + count + '个',
    })
    wx.uploadFile({
      url: app.globalData.url + "wxaqxj/uploadFile", 
      filePath: upfiles[count],
      name: "file",//示例，使用顺序给文件命名,
      formData: { wj_path: "D:\\web\\前端\\cj_upWenjian", aqxj_lx_id: aqxj_lx_id, wxorby: "wx" },
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
            complete:function(){
              console.log();
              that.jixuwx();
            }
          });  
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, aqxj_lx_id);
        }
      }
    })
  },
  jixuwx:function(){
    var that=this;
    var nextmodel=that.data.nextmodel;
    var nextcode = that.data.nextcode;
    console.log(nextcode);
    //完成
    if (nextcode==-100){
      console.log(that.data.chuandi)
      if (that.data.chuandi.xj_type == "dyxj" && app.globalData.xjlaiyuan == 1) {
        wx.switchTab({
          url: "/pages/index/index",
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      } else {
        wx.navigateTo({
          url: "/pages/dbsx/dbsx?dbsx=true"
        })
      }
    }
    //下一个
    else{
      var data = JSON.stringify(nextmodel);
      wx.navigateTo({
        url: "/pages/aqxj2/aqxj2?data=" + data
      })
     
    }
  }
})
