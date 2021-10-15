// pages/sbbynew/sbbynew.js
const app = getApp();
var util = require('../../utils/util.js');
var dateTimePicker = require('../../utils/dateTimePicker.js');
const recorderManager = wx.getRecorderManager();
var sbbyInfo = null;//跳转到页面找保养记录以填充页面显示数据

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:"",
    wxxg:true,//是否能修改设置项
    address:"",
    wxsmCount:0,
    wxqkCount:0,
    ycCount:0,
    allImgSize:0,//允许图片数
    allVoiceSize:0,//允许声音数
    allVedioSize:0,//允许视频数
    sblb:"",
    sblbIndex: 0,
    shebei: "",
    shebeiIndex: 0,
    sbcl: "",
    sbclIndex:0,
    repair_explain:"",
    dateTimeArray: null,
    dateTime: null,
    checkboxItems_leibie: ["日常检","更换组件","中保","大保"],
    classIndex: 0,
    wx_wwc:false,
    files: [],
    pfiles: [],
    onrecord:false,
    record_files:[],
    precord_files:[],
    lytip:"点击说话",
    recordingTimeqwe: 0,//录音计时
    sp_files:[],
    psp_files:[],
    partsList: [{
      pid: 0, // 供应商产品
      pname: '请选择',
      pnumber: '', // 签订量
      id: '' //供应商id
    }],
    plist:"",
    byjlgd:null
  },
  changeDateTimeColumn(e){
    console.log(e)
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
     dateTimeArray: dateArr,
     dateTime: arr
    });
  },
  addItem() {
    let arr = [...this.data.partsList]
    arr.push({
      pid: 0,
      pname: '请选择',
      pnumber: '',
      id: ''
    })
    this.setData({
      partsList: [...arr]
    })
  },
  delItem(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.partsList]
    arr.splice(index, 1)
    this.setData({
      partsList: [...arr]
    })
  },
  pickerChange(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.partsList]
    arr[index].pid = this.data.list[e.detail.value].id
    arr[index].pname = this.data.list[e.detail.value].name
    console.log(arr)
    this.setData({
      partsList: [...arr]
    })
  },
  formInputChange(e) {
    console.log(e)
    let index = e.target.dataset.index
    let arr = [...this.data.partsList]
    arr[index].pnumber = e.detail.value
    this.setData({
      partsList: [...arr]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.maintenanceId != null && options.maintenanceId != '') {//从保养巡检（进度查询）过来时找保养工单记录
      for (var i = 0; i < app.globalData.listByjd.length; i++) {
        if (options.maintenanceId == app.globalData.listByjd[i].id) {
          sbbyInfo = app.globalData.listByjd[i];
          this.setData({
            byjlgd: sbbyInfo
          })
          break;
        }
      }
    }
    this.setData({
      mid:sbbyInfo.id
    })
    var that = this;
    // wx.getStorageSync("station")
    wx.request({ //获取科目
      // url: this.globalData.url + 'shebei/getKemu',
      url: app.globalData.url + 'zichan/getAssetsTypeListByName',
      dataType: 'get',
      data: {
        zhandianName: wx.getStorageSync("station")
      },
      success: function (res) {
        var tmplb = [];
        var list=JSON.parse(res.data);
        for (var i = 0; i < list.length; i++) {
          var st={
            id:list[i].id,
            typename:list[i].typename
          };
          tmplb.push(st)
        }
        that.setData({
          sblb: tmplb,
        });
        var sblbTemp=0;//确定页面维修位置选项
        for (var i = 0; i < that.data.sblb.length; i++) {
          if (that.data.sblb[i].id == sbbyInfo.assets_typeid) {
            sblbTemp = i;
            that.setData({
              sblbIndex: sblbTemp
            })
            break;
          }
        };
        wx.request({//通过科目获取位置
          url: app.globalData.url + 'zichan/getassetsListByatid',
          data:{
            assetstype_id: that.data.sblb[that.data.sblbIndex].id,
            zhandianName:wx.getStorageSync("station")
          },
          dataType: 'json',
          success: function (weizhi) {
            console.log( weizhi)
            for (var i = 0; i < weizhi.data.length; i++) {
              var tmpAssets = [];
              var tmpcl = [];
              that.setData({
                sbcl:null
              })
              var sb={
                id:weizhi.data[i].id,
                assetsname:weizhi.data[i].assetsname
              };
              tmpAssets.push(sb)
              var ids = weizhi.data[i].assetscl_id.split(',');
              var names = weizhi.data[i].assetsclname.split(',');
              for (var x = 0; x < ids.length; x++) {
                var clarr = {
                  id: ids[x],
                  name: names[x]
                }
              tmpcl.push(clarr)
              }
            }
    
            that.setData({
              shebei: tmpAssets,
              sbcl:tmpcl
            })
            var shebeiTemp=0;//确定页面维修类型选项
            for (var i = 0; i < that.data.shebei.length; i++) {
              if (that.data.shebei[i].id == sbbyInfo.assets_id) {
                shebeiTemp = i;
                that.setData({
                  shebeiIndex: shebeiTemp
                })
                break;
              }
            };
            console.log( that.data.sbcl)
            console.log( sbbyInfo.assets_clid+"sss")
            var sbclTemp=0;//确定页面维修位置选项
            for (var i = 0; i < that.data.sbcl.length; i++) {
              if (that.data.sbcl[i].id == sbbyInfo.assets_clid) {
                sbclTemp = i;
                that.setData({
                  sbclIndex: sbclTemp
                })
                break;
              }
            };
          },
          fail: function (dbsx_res) {
            wx.showToast({
              title: '服务故障，稍后重试',
              icon: 'none',
              duration: 5000
            })
            return
          },
        })

      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
      },
    })
    
    var classIndexTemp=0;//确定页面维修类型选项
    for (var i = 0; i < this.data.checkboxItems_leibie.length; i++) {
      if (this.data.checkboxItems_leibie[i] == sbbyInfo.maintain_type) {
        classIndexTemp = i;
        this.setData({
          classIndex: classIndexTemp
        })
        break;
      }
    };

    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray
    }); 
    this.bindparts();

    this.setData({
      address: app.globalData.address
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
  changeDateTime(e){
    console.log(e)
    this.setData({
      dateTime: e.detail.value,

    });
  },
  bindsblbChange:function(e){
    var selectindex=0;
    if(e==null){
      selectindex=0;
    }
    else {
      selectindex=e.detail.value;
    }
    console.log('维修类别 发生选择改变，携带值为', this.data.sblb[selectindex].id);
    var that = this;
    this.setData({
      sblbIndex: selectindex
    })
    var tmpcl = [];
    wx.request({//通过设备类型获取设备
      url: app.globalData.url + 'zichan/getassetsListByatid',
      data:{
        assetstype_id: that.data.sblb[selectindex].id,
        zhandianName:wx.getStorageSync("station")
      },
      dataType: 'json',
      success: function (weizhi) {
        var tmpAssets = [];
        for (var i = 0; i < weizhi.data.length; i++) {
          var sb={
            id:weizhi.data[i].id,
            assetsname:weizhi.data[i].assetsname
          };
          tmpAssets.push(sb);
          var ids = weizhi.data[i].assetscl_id.split(',');
          var names = weizhi.data[i].assetsclname.split(',');
          for (var x = 0; x < ids.length; x++) {
            var clarr = {
              id: ids[x],
              name: names[x]
            }
          tmpcl.push(clarr)
          }
        }

        that.setData({
          shebei: tmpAssets,
          sbcl:tmpcl
        })
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
        return
      },
    })
  },
  bindshebeiChange: function (e) {
    var selectindex=0;
    if(e==null){
      selectindex=0;
    }
    else {
      selectindex=e.detail.value;
    }
    console.log('维修设备 发生选择改变，携带值为', this.data.shebei[selectindex].id);

    var that = this;
    this.setData({
      shebeiIndex: selectindex
    })
    wx.request({//通过设备获取设备构件
      url: app.globalData.url + 'zichan/getassetsclListBysbid',
      data:{
        id: that.data.shebei[selectindex].id
      },
      dataType: 'json',
      success: function (weizhi) {
        for (var i = 0; i < weizhi.data.length; i++) {
          var clarray = [];
          var ids = weizhi.data[i].assetscl_id.split(',');
          var names = weizhi.data[i].assetsclname.split(',');
          for (var x = 0; x < ids.length; x++) {
            var clarr = {
              id: ids[x],
              name: names[x]
            }
          tmpcl.push(clarr)
        }
      }
        that.setData({
          sbcl: tmpcl
        })
      },
      fail: function (dbsx_res) {
        wx.showToast({
          title: '服务故障，稍后重试',
          icon: 'none',
          duration: 5000
        })
        return
      },
    })
  },
  bindsbclChange:function(e){
    var selectindex=0;
    if(e==null){
      selectindex=0;
    }
    else {
      selectindex=e.detail.value;
    }
    this.setData({
      sbclIndex: selectindex
    })
  },
  bindparts: function (res) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/shebeirepair/getpartsList',
      dataType: 'json',
      method: "get",
      data:{
        pageIndex: 1,
        pageSize: 999,
        partsname: "",
        zhandian_id:wx.getStorageSync('station_id')
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 0) {
          var dt = res.data.list;
          var list_array = [];
          for (var i = 0; i < dt.length; i++) {
            var model = {
              id: dt[i].id,
              name: dt[i].partsname
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
  laiyCheckboxChange: function (e) {
    console.log('来源 发生change事件，携带value值为：', e.detail.value);
  },
  wxlbCheckboxChange: function (e) {
    console.log('维修类别 发生change事件，携带value值为：', e.detail.value);
  },
  ztCheckboxChange:function(e){
    console.log('状态 发生change事件，携带value值为：', e.detail.value);
    if (e.detail.value == "未完成") {
      this.setData({
        wx_wwc: true
      })
    }else{
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
  cancelImg:function(e){//删除图片
    for (var i = 0; i < this.data.files.length;i++){
      if (this.data.files[i] == e.target.dataset.imgurl){
        this.data.files.splice(i,1);
        this.data.pfiles.splice(i,1);
        break;
        }
      }
    this.setData({
      files: this.data.files,
      pfiles: this.data.pfiles
    });
  },
  cancelYuyin: function (e) {//删除语音
    for (var i = 0; i < this.data.record_files.length; i++) {
      if (this.data.record_files[i] == e.target.dataset.yuyinurl) {
        this.data.record_files.splice(i, 1);
        this.data.precord_files.splice(i, 1);
        break;
      }
    }
    this.setData({
      record_files: this.data.record_files,
      precord_files: this.data.precord_files
    });
  },
  cancelshiping: function (e) {//删除视频
    for (var i = 0; i < this.data.sp_files.length; i++) {
      if (this.data.sp_files[i] == e.target.dataset.shipurl) {
        this.data.sp_files.splice(i, 1);
        this.data.psp_files.splice(i, 1);
        break;
      }
    }
    this.setData({
      sp_files: this.data.sp_files,
      psp_files: this.data.psp_files
    });
  },
  //上传服务器
  upImgs: function (imgurl, index,ptype) {
    console.log(imgurl);
    var that = this;
    wx.uploadFile({
      url: app.globalData.url + 'upload/file',//
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res) {

        //console.log(JSON.parse(res.data).data); //接口返回网络路径
        var data = JSON.parse(res.data).data;
        //console.log(data['filePath']); //接口返回网络路径
          //that.data.filePaths.push(data['filePath'])
          // that.setData({
          //   filePaths: that.data.filePaths
          // })
          console.log(data['filePath'])
          if(ptype=='图片'){
            that.setData({
              pfiles: that.data.pfiles.concat(data['filePath'])
            });
          }
          if(ptype=='语音'){
            that.setData({
              precord_files: that.data.precord_files.concat(data['filePath'])
            });
            that.data.precord_files.concat()
          }
          if(ptype=='视频'){
            that.setData({
              psp_files: that.data.psp_files.concat(data['filePath'])
            });
          }
          
      },fail:function(re){
        console.log("上传失败");
      },complete:function (params) {
        console.log(params);
      }
    })
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
        that.upImgs(res.tempFilePaths[0], 0,'图片') 

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
    console.log(11111);
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      maxDuration:30,
      success: function (res) {
        that.setData({
          sp_files: that.data.sp_files.concat(res.tempFilePath)
        });
        console.log(res.tempFilePath);
        that.upImgs(res.tempFilePath, 0,'视频') 
      },fail:function(res){
        console.log(res);
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

      that.setData({
        record_files: that.data.record_files.concat(res.tempFilePath),
        onrecord: false,
        lytip:"点击说话",
        recordingTimeqwe:0
      })
      that.upImgs(res.tempFilePath, 0,'语音') 
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

    let site_supply = this.data.dateTimeArray[0][this.data.dateTime[0]]+'-'+this.data.dateTimeArray[1][this.data.dateTime[1]]+'-'+this.data.dateTimeArray[2][this.data.dateTime[2]]+' '+this.data.dateTimeArray[3][this.data.dateTime[3]]+':'+this.data.dateTimeArray[4][this.data.dateTime[4]]+':'+this.data.dateTimeArray[5][this.data.dateTime[5]];
    var partsid = "";
    var parts_details = "";
    var parts_values = "";
    for (var i = 0; i < this.data.partsList.length; i++) {
      if (this.data.partsList[i].pid !=0&&this.data.partsList[i].pnumber!=0) {
        partsid += this.data.partsList[i].pid + ",";
				parts_values += this.data.partsList[i].pid + ":" + this.data.partsList[i].pnumber + ",";
				parts_details += this.data.partsList[i].pname + ":" + this.data.partsList[i].pnumber + ",";
      }
    }
    var listval = new Array();
    let a=0;
    for (var i = 0; i < this.data.pfiles.length; i++) {
        if (this.data.pfiles[i].value != "") {
          listval[a] = {
            pic_url: this.data.pfiles[i],
            pic_type: "保养",
            file_type: "图片",
            id: "",
            repair_id: "",
          };
          a++;
        }
    }
    for (var i = 0; i < this.data.precord_files.length; i++) {
        if (this.data.precord_files[i].value != "") {
          listval[a] = {
            pic_url: this.data.precord_files[i],
            pic_type: "保养",
            file_type: "文件",
            id: "",
            repair_id: "",
          };
          a++;
        }
    }
    for (var i = 0; i < this.data.psp_files.length; i++) {
        if (this.data.psp_files[i].value != "") {
          listval[a] = {
            pic_url: this.data.psp_files[i],
            pic_type: "保养",
            file_type: "文件",
            id: "",
            repair_id: "",
          };
          a++;
        }
    }
    console.log(listval);
    var infoRepair = that.data.byjlgd;//提交 需要转换和可能会修改到的参数设置
    infoRepair.maintain_situation=e.detail.value.maintain_situation;
    infoRepair.partsid=partsid;
    infoRepair.parts_values=parts_values;
    infoRepair.parts_details=parts_details;
    infoRepair.finish_time=site_supply;
    infoRepair.maintain_state="已保养";
    infoRepair.list=listval;


    var upfiles = (that.data.files.concat(that.data.sp_files)).concat(that.data.record_files);
    var pupfiles = (that.data.pfiles.concat(that.data.psp_files)).concat(that.data.precord_files);
    console.log(upfiles);
    console.log(pupfiles);
    wx.request({
      url: app.globalData.url + 'shebeirepair/addShebeiMaintain',
      data: JSON.stringify(infoRepair),
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res)
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

      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
          duration: 2000,
        })
      },
    })
    

  },// 采用递归的方式上传多张
  uploadOneByOne: function (upfiles, successUp, failUp, count, length, equipmentId){
    var that = this;
    wx.showLoading({
      icon:'none',
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
            complete:function(){
            }
          });  
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(upfiles, successUp, failUp, count, length, equipmentId);
        }
      }
    })
  },
  inputWxsm:function(e){
    var len = e.detail.value.length;
    this.setData({
      wxsmCount: len
    })
  },
  inputWxqk:function(e){
    var len = e.detail.value.length;
    this.setData({
      wxqkCount: len
    })
  },
  inputWxyc:function(e){
    var len = e.detail.value.length;
    this.setData({
      ycCount: len
    })
  },
  showlsjv:function(){

    if(this.data.lsjv){
      this.setData({
        lsjv: false
      })
    }else{
      this.setData({
        lsjv: true
      })
    }
  },
  jixuwx: function () {//是否继续维修

    wx.request({//获取科目
      url: app.globalData.url + 'CommonManager/getcordBykemu',
      dataType: 'json',
      data: {
        kemu: this.data.subject[this.data.subjectIndex],
        flag: "wx",
        username: wx.getStorageSync('realname')
      },
      success: function (re) {
        console.log(re.data)
        if (re.data.data.length > 0) {//如果有设备可以继续维修
          wx.showModal({
            title: '提示',
            content: '是否继续维修该科目的其他位置?',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/sbwx/sbwx" + "?equipmentId=" + re.data.data[0].equipmentId
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
        } else {
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
