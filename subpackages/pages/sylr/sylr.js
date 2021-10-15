// pages/sylr/sylr.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectIndex:0,
    contentIndex:0,
    deviceIndex: 0,
    paramList:[],
    syNumber:'',
    chuandiobj:'',
    showIndex:1,
    typeNumberIndex:0,
    typeNumbers: [{ name: '', value: '请选择' }, { name: 'ONE', value: '第一组' }, { name: 'TWO', value: '第二组' }, { name: 'THREE', value: '第三组' }, { name: 'FOUR', value: '第四组' }, { name: 'FIVE', value: '第五组' }, { name: 'SIX', value:'第六组'}]

  },
  /**
   * 选择项目
   */
  projectChange:function(e){
    var that = this;
    that.setData({
      projectIndex: e.detail.value,
      selectProject: that.data.projects[e.detail.value]
    })
    that.getContent(that.data.projects[e.detail.value]);
  },
  /**
   * 选择内容
   */
  contentChange:function(e){
    var that = this;
    that.setData({
      contentIndex: e.detail.value,
      selectContent: that.data.contents[e.detail.value]
    })
    that.getData(that.data.contents[e.detail.value]);
  },
  /**
   * 选择分组
   */
  typeNumberChange:function(e){
    var that = this;
    that.setData({
      typeNumberIndex: e.detail.value,
      selectTypeNumber: that.data.typeNumbers[e.detail.value]
    })
    that.getSyData();
  },
  /**
   * 实验参数
   */
  getSyData:function(){
    var that=this;
    var url = that.data.api_url + '/api/data/getSyData';
    var data = {
      syNumber: that.data.syNumber,
      category: that.data.category,
      project: that.data.selectProject,
      content: that.data.selectContent,
    };
    that.ajaxReq(url, 'GET', data, that.getSyDataCallback);
  },
  /**
   * 实验参数 回调
   */
  getSyDataCallback:function(res){
    console.log("已有");
    console.log(res);
    var that = this;
    if (res.data.code == 200) { //等于200时获取返回的数据
      var syData = res.data.data.syData; //获取已录入的参数

      //展示录入了多少组
      if (syData != '' && syData != null && syData != 'null') {
        var count = 0;
        for (var i in syData) {
          count++;
        }
        //展示已录入了多少组数据
       // $('#typeNumberCount').text(count).show();
      }
      var typeNumber = that.data.typeNumbers[that.data.typeNumberIndex].name;
      //展示的具体数据
      var  paramList=that.data.paramList;
      var syDataGroup = syData[typeNumber];
      // console.log(syDataGroup);
      // console.log(paramList);
      if (syDataGroup != '' && syDataGroup != null && syDataGroup != 'null' ) {
        for (var i in syDataGroup) {
          
          for(var m=0;m<paramList.length;m++){
            var item = paramList[m];
            if (item.name != undefined && item.name == 'syData_' + i){
              item.value = syDataGroup[i];
              // console.log(item);
            }else{
              for (var key in item) {
                if (key == 'syData_' + i) {
                  item[key] = syDataGroup[i];
                }
              }
            }
            
          }
        }
       
      } else {
        for (var m = 0; m < paramList.length; m++) {
          var item = paramList[m];
          if (item.name != undefined && item.name.indexOf("syData_")!=-1) {
            item.value = '';
          } else {
            for (var key in item) {
              if (key.indexOf("syData_") != -1){
                item[key] = '';
              }
               
            }
          }

        }
        //$('input[name^="syData_"]').val(''); //清空数据
      }
      that.setData({
        paramList: paramList
      }); 
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    var that=this;
    var category=options.category;
    if(category==undefined){
      var obj=JSON.parse(options.data);
     that.setData({
       chuandiobj:obj,
       syNumber: obj.syNumber
     });
      category = obj.category;
     // console.log(obj);
    }
    //console.log(category);
    var zd = wx.getStorageSync("station");
    var api_url = app.globalData.serverUrl+app.getServerUrl(zd);
    that.setData({
      api_url: api_url,
      category: category
    })
    var url = api_url  + '/api/data/getProject';
    var data = {
      category: category,
    };
    that.ajaxReq(url, 'GET', data, that.getProjectCallback);
    
  },
  //请求数据
  ajaxReq: function (url, methods, data = {}, callback, headers = {}) {
    var that=this;
    wx.request({
      url: url,
      data: data,
      method: methods,
      header: headers,
      success: function (res) {
        if(res.data.code==200){
          callback(res);
        }else{
          wx.showToast({
            title: res.msg, // 标题
            icon: 'none',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }
        
      }
    });
  },
  /**
   * 获取实验项目回调
   */
  getProjectCallback: function (res){
    var that=this;
    var data=res.data.data;
    var projects=[];
    for (var i in data) {
      if (i.indexOf('projectName') !== -1 && data[i] != '' && data[i] != null && data[i] != 'null') {
        var result=data[i].replace(" ","");
        if (result!=''){
          projects.push(data[i]);
          
        }
        
      }
    }
    var selectProject = projects[0];
    if (that.data.chuandiobj != '') {
      for (var i=0;i<projects.length;i++){
        if (that.data.chuandiobj.project==projects[i]){
          that.data.projectIndex=i;
          selectProject = projects[i];
        }
      }
    }
    that.setData({
      projects: projects,
      selectProject: selectProject
    });
    that.getContent(selectProject); //初始化实验内容
    that.clearSyNumber(); //清除实验编号
  },
  /**
   * 获取实验内容
   */
  getContent: function (project){
    var that=this;
    var url = that.data.api_url + '/api/data/getContent';
    var data = {
      project: project,
      category: that.data.category,
    };
    that.ajaxReq(url, 'GET', data, that.getContentCallback);
  },
  /**
   * 获取实验内容回调
   */
  getContentCallback:function(res){
    var that=this;
    var data = res.data.data;
    var contents = [];
    for (var i in data) {
      if (i.indexOf('content') !== -1 && data[i] != '' && data[i] != null && data[i] != 'null') {
        var result = data[i].replace(" ", "");
        if (result != '') {
          contents.push(data[i]);
        }
        
      }
    }
    var selectContent = contents[0];
    if (that.data.chuandiobj != '') {
      for (var i = 0; i < contents.length; i++) {
        if (that.data.chuandiobj.content == contents[i]) {
          that.data.contentIndex = i;
          selectContent = contents[i];
        }
      }
    }
    that.setData({
      contents: contents,
      selectContent: selectContent
    });
    that.getData(selectContent); //初始化实验内容的实验参数
    that.clearSyNumber(); //清除实验编号
    var chuandiobj = that.data.chuandiobj
    if (chuandiobj != '') {
      
      that.setData({
        syNumber: chuandiobj.syNumber,
        ypName: chuandiobj.ypName,
        ypNumber: chuandiobj.ypNumber,
        remark: chuandiobj.remark
      })
    }

  },
  /**
   * 获取实验内容的实验参数
   */
  getData: function (contentName){
    var that=this;
    //+"/" + that.data.selectProject 
    var url = that.data.api_url + '/api/data/getData';
    var data = {
      data: contentName
    };
    //选择不同的录入表格
    switch (contentName) {
      case '坚固性':
        that.setData({
          showIndex:2
        });
        that.data2Html();
        break;
      case '黏附性':
        that.setData({
          showIndex: 3
        });
        that.data3Html();
        break;
      case '聚合物改性沥青离析':
        that.setData({
          showIndex: 4
        });
        that.data4Html();
        break;
      case '粒子电荷':
        that.setData({
          showIndex: 5
        });
        that.data5Html();
        break;
      case '与粗集料的黏附性':
        that.setData({
          showIndex: 6
        });
        that.data6Html();
        break;
      case '破乳速度':
        that.setData({
          showIndex: 7
        });
        that.data7Html();
        break;
      default:
        that.setData({
          showIndex: 1
        });
        that.ajaxReq(url, 'GET', data, that.getDataCallback);
        break;
    }
    return false;
  },
  /**
   * 实验内容的实验参数 回调函数
   */
  getDataCallback: function (res){
    var that=this;
    var data = res.data.data;
    var format_data = Array(); 
    for (var i in data) {
      
      if (i != 'id' && i != 'content' && data[i] != '' && data[i] != null && data[i] != 'null') {
        format_data.push({ 'key_desc': data[i], 'key_name': i, 'value': '' }); //参数键值、参数值
      }
    }
    //console.log(format_data);
    that.data1Html(format_data, 'key_desc', 'key_name', 'value');
  },
  /**
   * 实验内容参数
   */
  data1Html: function (data, key_desc, key_name, key_value){
    var that=this;
    var list=[];
    for (var i in data) {
      list.push({
        desc: data[i][key_desc], 
        name:'syData_' + data[i][key_name],
        value: data[i][key_value]
        });
      // var key = 'syData_' + data[i][key_name];
      // list.push({
      //   key: data[i][key_desc]
      // });
    }
    that.setData({
      paramList: list,
      isShow: false
    });

  },
  data2Html:function(){
    var that = this;
    var list = [];
    var obj1 = {
      '': '2.36 ~ 4.75', 'syData_gj2d4': '', 'syData_ry2d4': '', 'syData_gq2d4': ''
    };
    var obj2={
    '': '4.75 ~ 9.5','syData_gj4d9': '','syData_ry4d9': '','syData_gq4d9': ''
   };
    var obj3={
    '': '9.5 ~ 19', 'syData_gj9d19': '', 'syData_ry9d19': '', 'syData_gq9d19': ''
    };
    var obj4={
    '': '19 ~ 37.5', 'syData_gj19d37': '', 'syData_ry19d37': '', 'syData_gq19d37': ''
   };

   var obj5={
   '': '37.5 ~ 63','syData_gj37d63': '','syData_ry37d63': '', 'syData_gq37d63': ''
   };
   var obj6={
    '': '63 ~ 75', 'syData_gj63d75': '','syData_ry63d75': '','syData_gq63d75': ''
   };
   
    list.push(obj1);
    list.push(obj2);
    list.push(obj3);
    list.push(obj4);
    list.push(obj5);
    list.push(obj6);
    that.setData({
      paramList: list,
      paramTitleList: ['公称粒级（方孔筛，mm）', '各粒级实验前烘干量Mi(g)', '溶液法实验后筛余颗粒的烘干质量mi(g)', '各粒级的分计质量损失百比Qi(%)'],
      isShow:true
    });
  },
  data3Html:function(){
    var that=this;
    var list = [];
    var obj1={
      '': '评定等级-第1粒','syData_sz1': '', 'syData_sq1': ''
    };
    var obj2 = {
      '': '评定等级-第2粒','syData_sz2': '', 'syData_sq2': ''
    };
    var obj3 = {
     '': '评定等级-第3粒','syData_sz3': '', 'syData_sq3': ''
    };
    var obj4 = {
     '': '评定等级-第4粒', 'syData_sz4': '', 'syData_sq4': ''
    };
    var obj5 = {
     '': '评定等级-第5粒','syData_sz5': '','syData_sq5': ''
    };
    var obj6 = {
     '': '剥离面积百分率 分别鉴定', 'syData_szb': '','syData_sqb': ''
    };
    list.push(obj1);
    list.push(obj2);
    list.push(obj3);
    list.push(obj4);
    list.push(obj5);
    list.push(obj6);
    that.setData({
      paramList: list,
      paramTitleList: ['', '水煮法', '水浸发'],
      isShow: true
    });
  },
  data4Html:function(){
    var that = this;
    var list = [];
    var obj1 = {
      '': '软化点实验-单值（顶部）','syData_ss1': '', 'syData_pe1': ''
    };
    var obj2={
      '': '软化点实验-单值（底部）', 'syData_ss2': '', 'syData_pe2': ''
    };
    var obj3={
      '': '均匀的，无结皮和沉淀', 'syData_ss3': '', 'syData_pe3': ''
    };
    var obj4={
      '': '在杯边缘有轻微的聚合物结皮', 'syData_ss4': '', 'syData_pe4': ''
    };
    var obj5={
      '': '在整个表面有薄的聚合物结皮', 'syData_ss5': '', 'syData_pe5': ''
    };
    var obj6={
      '': '在整个表面有厚的聚合物结皮（>0.8mm）', 'syData_ss6': '', 'syData_pe6': ''
    };
    var obj7={
      '': '无表面结皮但容器底部有薄的沉淀', 'syData_ss7': '', 'syData_pe7': ''
    };
    var obj8={
      '': '无表面结皮但容器底部有厚的沉淀（>6mm）', 'syData_ss8': '', 'syData_pe8': ''
    };
    list.push(obj1);
    list.push(obj2);
    list.push(obj3);
    list.push(obj4);
    list.push(obj5);
    list.push(obj6);
    list.push(obj7);
    list.push(obj8);
    that.setData({
      paramList: list,
      paramTitleList: ['', 'SBS/SBR类', 'PE/EVA类'],
      isShow: true
    });
  },
  data5Html:function(){
    var that = this;
    var list = [];
    var obj1 = {
      '': '负极板上吸附有大量沥青微粒，说明沥青微粒带正电荷', '': '阳离子乳化沥青（+）','syData_r1': ''     
    };
    var obj2 = {
     '': '正极板上吸附有大量沥青微粒，说明沥青微粒带负电荷','': '阴离子乳化沥青（-）', 'syData_r2': ''
    };
    list.push(obj1);
    list.push(obj2);
    that.setData({
      paramList: list,
      paramTitleList: ['电极板情况', '微粒子电荷性质', '判断结果'],
      isShow: true
    });
  },
  data6Html:function(){
    var that = this;
    var list = [];
    var obj1 = {
      '': '集料规格(mm)', 'syData_ylz': '', 'syData_yz': ''
    };
    var obj2 = {
      '': '第1粒', 'syData_ylzOne': '', 'syData_yzOne': ''
    };
    var obj3 = {
      '': '第2粒', 'syData_ylzTwo': '', 'syData_yzTwo': ''
    };
    var obj4={
      '': '第3粒', 'syData_ylzThree': '', 'syData_yzThree': ''
    };
    var obj5={
      '': '第4粒', 'syData_ylzFour': '', 'syData_yzFour': ''
    };
    list.push(obj1);
    list.push(obj2);
    list.push(obj3);
    that.setData({
      paramList: list,
      paramTitleList: ['', '阳离子乳化沥青', '阴离子乳化沥青或非离子乳化沥青'],
      isShow: true
    });
  },
  data7Html:function(){
    var that = this;
    var list = [];
    var obj1 = {
      '': '混合料呈松散状态，一部分矿料颗粒未裹覆沥青，沥青分布不够均匀，有些凝聚成固块','': '乳液中的沥青拌和后立即凝聚成团块，不能拌和', '': '快裂RS', 'syData_rs': ''
   
    };
    var obj2 = {
      '': '混合料混合均匀', '': '混合料呈松散状态，沥青分布不均，并可见凝聚的团块', '': '中裂MS', 'syData_ms': ''
    };
    var obj3 = {
      '': '混合料呈糊状，沥青乳液分布均匀', '': '混合料呈糊状，沥青乳液分布均匀', '': '慢裂SS', 'syData_ss': ''
    };
    list.push(obj1);
    list.push(obj2);
    list.push(obj3);
    that.setData({
      paramList: list,
      paramTitleList: ['A组矿料拌和结果', 'B组矿料拌和结果', '破乳速度','试验结果'],
      isShow: true
    });
  },
  /**
   * 清除实验编号
   */
  clearSyNumber:function(){
    var that=this;
    that.setData({
      syNumber:''
    })
  },
  /**
   * 获取实验设备
   */
  getSyName:function(obj){
    var that = this;
    var url = that.data.api_url + '/shebei/getassetsList';
    var data = {
      pageIndex: 1,
      pageSize: 999,
      'name': obj,
    };
    that.ajaxReq(url, 'GET', data, that.getSyNameCallback);
  },
  /**
   * 实验设备回调
   */
  getSyNameCallback:function(){
    var that = this;
    var data = res.data.data;
    var devices = [];
    for (var i in data) {
      devices.push(data[i]['name']);
    }
    that.setData({
      devices: devices
    });
    console.log(devices);
  },
  bindsave3:function(e){
    if (e.detail.target.dataset.type == 1) {
      this.bindsave(e)
    } else if (e.detail.target.dataset.type == 2) {
      this.bindsave2(e)

    }
  },
  /**
   * 预览
   */
  bindsave2:function(e){
    var that = this;
     console.log(e.detail.value);
    try {
      var data_obj = e.detail.value;
      var submit_data = Object();
      var syDataObj = Object();
      var syDataStr = 'syData_';
      var sySbObj = Object();
      var sySbStr = 'sbName';
      for (var i in data_obj) {
        if (i.indexOf(syDataStr) !== -1) {
          var key_name = i.replace(syDataStr, '');
          // console.log("key_name：" + key_name);
          syDataObj[key_name] = data_obj[i];
        } else if (i.indexOf(sySbStr) !== -1) {
          sySbObj[i] = data_obj[i];
        } else {
          submit_data[i] = data_obj[i];
        }
      }
      // var typeNumberObj = Object();
      // typeNumberObj[that.data.typeNumbers[that.data.typeNumberIndex].name] = syDataObj;
      // submit_data['syData'] = typeNumberObj;//实验参数数据
      submit_data['syData'] = syDataObj;;//实验参数数据
      submit_data['sySB'] = sySbObj; //实验设备
      var jyName = wx.getStorageSync("realname"); //获取当前登录的用户的名称
      if (jyName === '') {
        jyName = '测试检验人员';
      }
      submit_data['jyName'] = jyName;
      submit_data['category'] = that.data.category;
      submit_data['project'] = that.data.selectProject;
      submit_data['content'] = that.data.selectContent;
      submit_data['typeNumber'] = that.data.selectTypeNumber;
      //submit_data['typeNumber'] = that.data.selectTypeNumber;
      console.log(submit_data);

      var new_submit_data = Object();
      console.log("实验编号：" + submit_data['syNumber'])
      if (submit_data['syNumber'] == '') {
        //新增记录数据
        for (var i in submit_data) {
          if (i.indexOf('searchSySB') !== -1 || i.indexOf('syNumber') !== -1) {

          } else {
            new_submit_data[i] = submit_data[i];
          }
        }
        //that.putSy(new_submit_data, that.addPutSyCallback); //新增实验记录
      } else { //再次添加数据
        //继续新增记录数据
        for (var i in submit_data) {
          if (i.indexOf('searchSySB') !== -1) {

          } else {
            new_submit_data[i] = submit_data[i];
          }
        }
        //console.log("继续新增记录数据");
        // var url = that.data.api_url + '/api/data/putSy';
        // var data = JSON.stringify(new_submit_data);
        // var headers = {
        //   "Content-Type": "application/json; charset=utf-8",
        // };
        // that.ajaxReq(url, 'post', data, that.addMorePutSyCallback, headers);
        //that.putSy(new_submit_data, that.addMorePutSyCallback); //继续新增实验记录
      }
      var url = that.data.api_url +"/api/data/syYuLanExcel";
      wx.request({
        url: url,
        data: JSON.stringify(new_submit_data),
        method: "POST",
        header: {
          'content-type': 'application/json; charset=utf-8'
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            wx.downloadFile({
              url: that.data.api_url + '/api/data/downloadSyYlFile/$' + res.data.data,
              success: function (res) {
                console.log(res)
                var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
                //this.webview = Path
                wx.openDocument({
                  filePath: Path,
                  fileType: "docx",
                  success: function (res) {
                    console.log('打开文档成功')
                  },
                  fail: function (res) {
                    console.log("fail");
                    console.log(res)
                  },
                  complete: function (res) {
                    console.log("complete");
                    console.log(res)
                  }
                })
              },
              fail: function (res) {
                console.log(res)
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg, // 标题
              icon: 'none',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
          }
        }

      })
    } catch (e) {
      console.log(e.message);
    }
    return false; //禁止刷新页面
  },
  /**
   * 保存
   */
  bindsave:function(e){
    var that=this;
    console.log(e.detail.value);
    try{
      var data_obj = e.detail.value;
      var submit_data = Object();
      var syDataObj = Object();
      var syDataStr = 'syData_';
      var sySbObj = Object();
      var sySbStr = 'sbName';
      for (var i in data_obj) {
        if (i.indexOf(syDataStr) !== -1) {
          var key_name = i.replace(syDataStr, '');
          // console.log("key_name：" + key_name);
          syDataObj[key_name] = data_obj[i];
        } else if (i.indexOf(sySbStr) !== -1) {
          sySbObj[i] = data_obj[i];
        } else {
          submit_data[i] = data_obj[i];
        }
      }
      var typeNumberObj = Object();
      typeNumberObj[that.data.typeNumbers[that.data.typeNumberIndex].name] = syDataObj;
      submit_data['syData'] = typeNumberObj;//实验参数数据
      submit_data['sySB'] = sySbObj; //实验设备
      var jyName = wx.getStorageSync("realname"); //获取当前登录的用户的名称
      if (jyName === '') {
        jyName = '测试检验人员';
      }
      submit_data['jyName'] = jyName;
      submit_data['category'] = that.data.category;
      submit_data['project'] = that.data.selectProject;
      submit_data['content'] = that.data.selectContent;
      submit_data['typeNumber'] = that.data.selectTypeNumber;
      console.log(submit_data);

      var new_submit_data = Object();
      console.log("实验编号：" + submit_data['syNumber'])
      if (submit_data['syNumber']== '') {
        //新增记录数据
        for (var i in submit_data) {
          if (i.indexOf('searchSySB') !== -1 || i.indexOf('syNumber') !== -1) {

          } else {
            new_submit_data[i] = submit_data[i];
          }
        }
         that.putSy(new_submit_data, that.addPutSyCallback); //新增实验记录
      } else { //再次添加数据
        //继续新增记录数据
        for (var i in submit_data) {
          if (i.indexOf('searchSySB') !== -1) {

          } else {
            new_submit_data[i] = submit_data[i];
          }
        }
        console.log("继续新增记录数据");
        // var url = that.data.api_url + '/api/data/putSy';
        // var data = JSON.stringify(new_submit_data);
        // var headers = {
        //   "Content-Type": "application/json; charset=utf-8",
        // };
        // that.ajaxReq(url, 'post', data, that.addMorePutSyCallback, headers);
        that.putSy(new_submit_data, that.addMorePutSyCallback); //继续新增实验记录
      }
    } catch (e) {
      console.log(e.message);
    }
    return false; //禁止刷新页面
  },
  
  /**
   * 新增实验记录
   */
  putSy: function (data, callback){
    var that=this;
    var url = that.data.api_url + '/api/data/putSy';
    data = JSON.stringify(data);
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    that.ajaxReq(url, 'POST', data, callback, headers);
  },
  /**
   * 新增实验回调函数
   */
  addPutSyCallback: function (res){
    var that = this;
    var data = res.data.data;
    if (res.data.code === 200) {
      that.setData({
        syNumber: data.syNumber
      })
      wx.showToast({
        title: '数据新增成功', // 标题
        icon: 'success',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      //console.log("新增实验：" + data.syNumber);
     
    } else {
      wx.showToast({
        title: res.msg, // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
     
    }
  },
  /**
   * 继续新增实验回调函数
   */ 
  addMorePutSyCallback: function (res){
    var that = this;
    console.log("继续新增实验回调函数");
    console.log(res);
    var data = res.data.data;
    if (res.data.code === 200) {
      that.setData({
        syNumber: data.syNumber
      })
     // $('#syNumber').val(data.syNumber);
      //console.log("继续新增实验：" + data.syNumber);
      wx.showToast({
        title: '数据新增成功', // 标题
        icon: 'success',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    } else {
      wx.showToast({
        title: res.msg, // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }
  },
  /**
   * 结束
   */
  bindsave1: function () {
    var that = this;
    var syNumber = that.data.syNumber;
    if (syNumber == '') {
      wx.showToast({
        title: '请先输入有效的实验编号', // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      return false;
    }
    var data = {
      syNumber: syNumber,
    };
    that.finishSy(data, that.finishSyCallback);
  },
  /**
   * 结束实验数据的录入
   */
  finishSy: function (data, callback) {
    var url = that.data.api_url + '/api/data/finishSy';
    data = JSON.stringify(data);
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    that.ajaxReq(url, 'POST', data, callback, headers);
  },
  /**
   * 结束实验数据的录入 回调
   */
  finishSyCallback: function (res) {
    if (res.code === 200) {
      wx.showToast({
        title: '实验结束成功', // 标题
        icon: 'success',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
      wx.navigateTo({
        url: "/pages/sycj/sycj"
      });
    } else {
      wx.showToast({
        title: res.msg, // 标题
        icon: 'none',  // 图标类型，默认success
        duration: 1500  // 提示窗停留时间，默认1500ms
      })
    }
  },
  /**
   * 样品
   */
  sysYp:function(){
    var that = this;
    wx.scanCode({// 只允许从相机扫码
      onlyFromCamera: true,
      success(sys_res) {
        console.log(sys_res);
        var resu = JSON.parse(sys_res.result);
        if (resu.type == 'yp') {
          console.log(app.globalData.url);
          var url = that.data.api_url + '/api/data/getManageInfo';
          var data = {
            toCode: resu.key,
          };
          that.ajaxReq(url, 'GET', data, that.getManageCallback);

        }
      }
    });
  },
  /**
   * 获取样品 回调
   */
  getManageCallback:function(res){
    var that=this;
    var result = res.data.data;
    that.setData({
      ypNumber: result.toCode,
      ypName: result.sampleName
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

  }
})