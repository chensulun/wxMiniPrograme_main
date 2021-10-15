// pages/sbby/sbby.js

const app = getApp();
const recorderManager = wx.getRecorderManager();
var util = require('../../utils/util.js');
var sbbyInfo = null;//跳转到页面找保养记录以填充页面显示数据
var userInfo =null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxxg: true,
    equipmentId: null,
    allImgSize: 0,//允许图片数
    allVoiceSize: 0,//允许声音数
    allVedioSize: 0,//允许视频数
    site: "",//站点选项
    siteIndex: 0,
    subject: '',
    subjectIndex: 0,
    class: ["日常检", "中保", "大保"],
    classIndex: 0,
    position: '',
    positionIndex: 0,
    project:'',
    standardMaintenance:'',
    checkboxItems_cg: [
      { name: '状态良好', value: '0', checked: true },
      { name: '需要处理', value: '1' },
      { name: '急需维修', value: '2' }
    ],
    files: [],
    onrecord: false,
    record_files: [],
    recordingTimeqwe: 0,//录音计时
    lytip:"点击说话",
    sp_files: [],
    byjlgd:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({//设置设备选项列表
      site: app.globalData.zhandian,
      subject:app.globalData.kemu,
      position:app.globalData.weizhi
    });

    console.log(options)
   
    if (options.maintenanceId != null && options.maintenanceId != '') {//从保养巡检（进度查询）过来时找保养工单记录
      for (var i = 0; i < app.globalData.listByjd.length; i++) {
        if (options.maintenanceId == app.globalData.listByjd[i].maintenanceId) {
          sbbyInfo = app.globalData.listByjd[i];
          this.setData({
            byjlgd: sbbyInfo
          })
          break;
        }
      }
    }else{
      for (var i = 0; i < app.globalData.dbsxResult.bxtz.length; i++) {//从保待办事项或通知过来时找保养工单记录
        if (options.equipmentId == app.globalData.dbsxResult.bxtz[i].maintenanceId) {
          sbbyInfo = app.globalData.dbsxResult.bxtz[i];
          break;
        }
      }
    }

    console.log(sbbyInfo)//找到保养记录后输出

    var siteIndexTemp=0;//确定页面维修站点选项
    for (var i = 0; i < this.data.subject.length; i++) {
      if (this.data.site[i] == sbbyInfo.site) {
        siteIndexTemp = i;
        break;
      }
    };


    var subjectIndexTemp=0;//确定页面维修类别选项
    for (var i = 0; i < this.data.subject.length; i++) {
      if (this.data.subject[i] == sbbyInfo.categoryMaintenance) {
        subjectIndexTemp = i;
        break;
      }
    };

    var positionTemp=0;//确定页面维修位置选项
    for (var i = 0; i < this.data.subject.length; i++) {
      if (this.data.position[i] == sbbyInfo.pointMonitor) {
        positionTemp = i;
        break;
      }
    };

    var classIndexTemp=0;//确定页面维修类型选项
    for (var i = 0; i < this.data.subject.length; i++) {
      if (this.data.class[i] == sbbyInfo.classification) {
        classIndexTemp = i;
        break;
      }
    };

    this.setData({
      equipmentId: sbbyInfo.maintenanceId,
      address: app.globalData.address,
      siteIndex: siteIndexTemp,//设置站点
      classIndex: classIndexTemp,//设置类型
      positionIndex: positionTemp,//设置位置
      subjectIndex: subjectIndexTemp,//设置科目
      project: sbbyInfo.project,
      standardMaintenance: sbbyInfo.standardMaintenance,
      allImgSize: sbbyInfo.numberofimg,//允许图片数
      allVoiceSize: sbbyInfo.numberofvoice,//允许声音数
      allVedioSize: sbbyInfo.numberofvideo,
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

  },
  cancelImg: function (e) {//删除图片
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
    if (that.data.files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10 + "张图片",
        icon: "none",
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
  startRecorder: function () {//开启录音
    var that = this;
    if (that.data.record_files.length == 10) {
      wx.showToast({
        title: "最多上传" + 10+ "个录音",
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
      console.log('。。。开始录音。。。');
      that.setData({
        onrecord: true,
        lytip:"停止录音"
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
        onrecord: false,
        lytip: "点击说话",
        recordingTimeqwe: 0
      })
    });
  },
  formSubmit: function (e) {
    var that = this;

    if (e.detail.value.bychengguo != "急需维修"){
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
    }
    

    userInfo = JSON.parse(wx.getStorageSync('userInfo'));

    var infoMaintenance = e.detail.value;//正常保养时，提交要修改的参数设置
    // console.log('form发生了submit事件，携带数据为：', infoMaintenance);

    infoMaintenance.maintenanceId = this.data.equipmentId
    infoMaintenance.dateFinish = util.formatDate(new Date())
    infoMaintenance.stateMaintenance='已完成'

    var upfiles = (that.data.files.concat(that.data.sp_files)).concat(that.data.record_files)
    
    if(infoMaintenance.bychengguo == "急需维修"){//设置维修参数
      var informationRepairJson={};//急需维修时添加维修参数

      infoMaintenance.dateFinish=null;//急需维修时，没有完成时间，状态依然为保养中
      infoMaintenance.stateMaintenance ='保养中';

      informationRepairJson.subjectRepair = sbbyInfo.categoryMaintenance;//维修科目
      informationRepairJson.positionRepair = sbbyInfo.pointMonitor//维修位置
      informationRepairJson.site = sbbyInfo.site;//维修类别
      informationRepairJson.personRepair = sbbyInfo.inspectingofficer;//维修人
      informationRepairJson.phonenumberRepair = sbbyInfo.phoneInspection;//维修人电话
      informationRepairJson.personresponsible = sbbyInfo.personresponsible;//责任人
      informationRepairJson.phonenumberResponsible = sbbyInfo.phoneResponsible;//责任人号码
      informationRepairJson.wxlaiyuan = "巡检";//维修来源
      informationRepairJson.datePlan = util.formatDate(new Date());
      informationRepairJson.jjwxId = infoMaintenance.maintenanceId;
      informationRepairJson.numberofimg = sbbyInfo.numberofimg;
      informationRepairJson.numberofvoice = sbbyInfo.numberofvoice;
      informationRepairJson.numberofvideo = sbbyInfo.numberofvideo;
     
    }

    wx.request({
      url: app.globalData.url + 'maintenance/submitMatenance',
      data: { userid: userInfo.userid, token: userInfo.token, informationMaintenanceJson: JSON.stringify(infoMaintenance) },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res)
        var successUp = 0; //成功
        var failUp = 0; //失败
        var count = 0; //第几张

        var length = 0; //总数
        if (upfiles.length>0){
          length = upfiles.length; //总数
        }
        if (res.data.cod == "002") {
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, infoMaintenance.bychengguo, informationRepairJson);
        } else if (infoMaintenance.bychengguo == "急需维修") {//是紧急维修，没上传图片
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
            duration: 2000,
          });
          wx.request({
            url: app.globalData.url + 'repair/addTaskOfRepair',
            data: { userid: userInfo.userid, token: userInfo.token, informationRepairJson: JSON.stringify(informationRepairJson) },
            method: 'GET',
            dataType: 'json',
            success: function (res) {
              informationRepairJson.equipmentId = res.data.data.equipmentId
              wx.redirectTo({//跳转到紧急维修
                url: '/pages/jxwx/jxwx?informationRepairJson=' + JSON.stringify(informationRepairJson)
              })
            },
            fail: function (res) {
              console.log(res)
            },
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
          duration: 2000,
        })
      }
    })
   
  },// 采用递归的方式上传多张
  uploadOneByOne: function (upfiles, successUp, failUp, count, length, bycg, informationRepairJson) {
    var that = this;
    wx.showLoading({
      title: '正在上传第' + count + '个',
    })
    wx.uploadFile({
      url: app.globalData.url + "CommonManager/uploadFile",
      filePath: upfiles[count],
      name: "file",//示例，使用顺序给文件命名,
      formData: { wj_path: app.globalData.wjPath, equipmentId: this.data.equipmentId, wxorby: "by" },
      success: function (e) {
        successUp++;//成功+1
      },
      fail: function (e) {
        failUp++;//失败+1
      },
      complete: function (e) {
        count++;//下一张
        if (count == length || length==0) {
          //上传完毕，作一下提示
          console.log('上传成功' + successUp + ',' + '失败' + failUp);
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000,
            complete: function () {
              if (bycg !="急需维修"){
                that.jixuby();
              }else{//上传了图片时的紧急维修
                wx.request({
                  url: app.globalData.url + 'repair/addTaskOfRepair',
                  data: { userid: userInfo.userid, token: userInfo.token, informationRepairJson: JSON.stringify(informationRepairJson) },
                  method: 'GET',
                  dataType: 'json',
                  success: function (res) {
                    informationRepairJson.equipmentId = res.data.data.equipmentId;
                    wx.redirectTo({//跳转到紧急维修
                      url: '/pages/jxwx/jxwx?informationRepairJson=' + JSON.stringify(informationRepairJson)
                    })
                  },
                  fail: function (res) {
                    console.log(res)
                  },
                })
              }
            }
          });
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, bycg, informationRepairJson);
        }
      }
    })
  },
  jixuby:function(){

    wx.request({//获取科目
      url: app.globalData.url + 'CommonManager/getcordBykemu',
      dataType: 'json',
      data:{
        kemu: this.data.subject[this.data.subjectIndex],
        flag:"by",
        username: wx.getStorageSync('realname')
      },
      success: function (re) {
        console.log(re.data)
        if (re.data.data.length>0){//如果有设备可以继续维修
          wx.showModal({
            title: '提示',
            content: '是否继续维修改科目的其他位置?',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/sbby/sbby" + "?equipmentId=" + re.data.data[0].maintenanceId
                })
              } else if (res.cancel) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 5
                  })
                }, 2000)
              }
            }
          })
        }else{
          setTimeout(function () {
            wx.navigateBack({
              delta: 5
            })
          }, 2000)
        }
      },
      fail: function (dbsx_res) {
        setTimeout(function () {
          wx.navigateBack({
            delta: 5
          })
        }, 2000)
      },
    })
  }
})