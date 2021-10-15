// pages/xzrwd/xzrwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleVal: 'basic',
    formData: {},
    rules: [
      {
        name: 'name',
        rules: { required: true, message: '工程名称必填' },
      },
      {
        name: 'name1',
        rules: { required: true, message: '客户名称必填' },
      }
    ],
    date: '2016-09-01',
    list: [
    ],
    mblist:[],
    mbindex:0,
    yclcsList: [
    ],
    tableList: [],
    tableList1: [],
    rlcData: {
      rlc: '',
      zl: '',
      bz: '',
    }, // 热料仓添加数据
    llcData: {
      llcgg: '',
      yclcs: '',
      yclgg: '',
      zl: ''
    }, // 冷料仓添加数据
    listVal: '',
    index: 0,
    yclggList: [[]],
    auditstate:0,
    bgczname:'重量',
    pbgmc: "工程名称"
  },
  mbChange(e){
    let index = e.detail.value
    let that=this;
    let cs =this.data.yclcsList;
    let gg=this.data.yclggList
    if(index!=0){
      let jpId=this.data.mblist[index].jpId;
      app.formPost('jipei/getModel', { jpId: jpId }, function (res) {
        let llc=res.data.llcpb;
        let rlc=res.data.rlcpb;
        llc.forEach(item=>{
          item.csIndex=0;
          item.ggIndex=0;
          for(let i=0;i<cs.length;i++){
            if(item.yclcs==cs[i].name){
              item.csIndex=i;
              for(let j=0;j<gg[i].length;j++){
                if(gg[i][j].name==item.yclgg){
                  item.ggIndex=j;
                }
              }
            }
          } 
        })
        res.data.zt=0;
        res.data.hhklx=that.data.formData.hhklx;
        res.data.task_id = that.data.formData.task_id;
        res.data.rwbh = that.data.formData.rwbh;
        res.data.gcmc = that.data.formData.gcmc;
        console.info(that)
        that.setData({
          formData:res.data,
          tableList:rlc,
          tableList1:llc,
          mbindex:index
        });
        console.info(that.data);
      })
    }
  },
  pickerChange(e) {
    let index = e.detail.value
    var formData = this.data.formData;
    formData.task_id = this.data.list[index].task_id;
    formData.rwbh = this.data.list[index].task_no;
    formData.gcmc = this.data.list[index].engineer_name;
    formData.hhklx = this.data.list[index].concrete_name;
    console.info(formData);
    this.setData({
      formData: formData,
      index: index
    })
  },
  getMbList(){
    let that = this;
    app.formPost('jipei/getList', {zt:1}, function (res) {
       console.info(res);
        let l=[{jpbh:'请选择'}]
        res.list.forEach(item=>{
          item.jpbh=item.jpbh+"("+item.gcmc+")"
          l.push(item);
        })
        that.setData({mblist:l});
    })
  },
  getScList() {
    let that = this;
    app.formPost('jipei/getSclist', {}, function (res) {
      //console.log(res)
      res.list.forEach(item => {
        //console.log(item);
        item.id = item.task_id + ";" + item.task_no + ";" + item.engineer_name + ";" + item.concrete_name;
        item.name = item.engineer_name + "(" + item.concrete_name + ")";
      })
      var formData = that.data.formData;
      
      if(res.list.length>0){
        formData.task_id = res.list[0].task_id;
        formData.rwbh = res.list[0].task_no;
        formData.gcmc = res.list[0].engineer_name;
        formData.hhklx = res.list[0].concrete_name;
      }
      console.info(formData)
      that.setData({ 'list': res.list, 'formData':formData});
    })
  },
  getYclList() {
    let that = this;
    if (wx.getAccountInfoSync().miniProgram.appId == 'wx2242bdf7b68a52dd') {
      this.getYclList2();
      return;
    }
    app.appGet('/gongyingshang/getSupplierList?pageIndex=1&pageSize=99999&bg_time=&ed_time=', function (res) {
      //console.log(res)
      let arr = [{ 'name': '请选择' }]
      let arr2 = [[{ 'name': '请选择' }]];
      res.list.forEach(item => {
        item.name = item.u_Name
        app.formPost('jipei/getYccgg', { id: item.id }, function (re) {
          let ar = [{ 'name': '请选择' }]
          re.list.forEach(ite => {
            ite.name = ite.u_Name
            ar.push(ite);
          })
          arr2.push(ar);
          that.setData({ yclggList: arr2 });
        })
       
        arr.push(item);
      })
     
      that.setData({ yclcsList: arr});
    })
  },
  getYclList2() {
    var that=this;
    app.formPost('jipei/getYccgg', {}, function (re) {
      let ar = [{ 'name': '请选择' }]
      re.list.forEach(ite => {
        ite.name = ite.u_Name
        ar.push(ite);
      })
      app.appGet('/gongyingshang/getSupplierList?pageIndex=1&pageSize=99999&bg_time=&ed_time=', function (res) {
        //console.log(res)
        let arr = [{ 'name': '请选择' }]
        let arr2 = [ar];
        res.list.forEach(item => {
          item.name = item.u_Name
          arr.push(item);
          arr2.push(ar);
          //console.info(arr2);
          that.setData({ yclggList: arr2 });
        })
        that.setData({ yclcsList: arr });
       
      })
    })
  },
  ggChange(e) {
    let i=e.target.dataset.index;
    let index = e.detail.value
    let arr = this.data.tableList1;
    console.info(arr[i]);
    arr[i].yclgg = this.data.yclggList[arr[i].csIndex][index].name;
    arr[i].ggIndex=index;
    this.setData({
      'tableList1': arr
    })
  },
  csChange(e) {
    let i = e.target.dataset.index;
    let index = e.detail.value
    let arr = this.data.tableList1;
    console.info(this.data.yclcsList[index])
    arr[i].yclcs = this.data.yclcsList[index].name;
    arr[i].csIndex = index;
    if (wx.getAccountInfoSync().miniProgram.appId != 'wx2242bdf7b68a52dd'){
      arr[i].ggIndex = 0;
    }
    arr[i].yclId = this.data.yclcsList[index].id;
    this.setData({
      'tableList1':arr
    })
  },
  radioChange(e) {
    console.log(e)
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  switchTitle(d) {
    console.log(d)
    this.setData({
      titleVal: d.target.dataset.type
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log(valid, errors)
    })
  },
  llcAdd() {
    let arr = [...this.data.tableList1]
    arr.push({ csIndex:0,ggIndex:0})
    this.setData({
      tableList1: [...arr],
    })
  },

  rlcAdd(){
    let arr = [...this.data.tableList]
    arr.push({ })
    this.setData({
      tableList: [...arr]
    })
  },
  rlcDelItem(e) {
    let index = e.currentTarget.dataset.index
    let arr = [...this.data.tableList]
    arr.splice(index, 1)
    this.setData({
      tableList: [...arr]
    })
  },
  llcDelItem(e) {
    let index = e.currentTarget.dataset.index
    let arr = [...this.data.tableList1]
    arr.splice(index, 1)
    this.setData({
      tableList1: [...arr]
    })
  },
  rlcInputChange1(e) {
    let arr = [...this.data.tableList]
    arr[e.target.dataset.index].rlc = e.detail.value
    this.setData({
      tableList: [...arr]
    })
  },
  rlcInputChange2(e) {
    let value = this.validateNumber(e.detail.value);
    let arr = [...this.data.tableList]
    arr[e.target.dataset.index].zl = value
    this.setData({
      tableList: [...arr]
    })
  },
  rlcInputChange3(e) {
    let arr = [...this.data.tableList]
    arr[e.target.dataset.index].bz = e.detail.value
    this.setData({
      tableList: [...arr]
    })
  },
  validateNumber(val) {
    val = val.replace(/^(\-)*(\d+)\.(\d{6}).*$/, '$1$2.$3')
    val = val.replace(/[\u4e00-\u9fa5]+/g, ""); //清除汉字
    val = val.replace(/[^\d.]/g, ""); //清楚非数字和小数点
    val = val.replace(/^\./g, ""); //验证第一个字符是数字而不是  
    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只保留第一个小数点, 清除多余的
    return val;
  },
  llcInputChange1(e) {
    let arr = [...this.data.tableList1]
    arr[e.target.dataset.index].llcgg = e.detail.value
    this.setData({
      tableList1: [...arr]
    })
  },
  llcInputChange4(e) {
    let value = this.validateNumber(e.detail.value);
    let arr = [...this.data.tableList1]
    arr[e.target.dataset.index].zl = value
    this.setData({
      tableList1: [...arr]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reload();
    const accountInfo = wx.getAccountInfoSync();
    if (accountInfo.miniProgram.appId === 'wx2242bdf7b68a52dd') {
      this.setData({
        auditstate:1,
        bgczname:'重量/比例',
        pbgmc:"任务名称"
      })
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
  addpb: function (e) {
    const accountInfo = wx.getAccountInfoSync();
    
    let that = this;
    var data = e.detail.value;
    let formData = this.data.formData;
    for (let key in formData) {
      data[key] = formData[key];
    }
    var table = this.data.tableList;
    var table1 = this.data.tableList1;
    data.llcjson = JSON.stringify(table1);
    data.rlcjson = JSON.stringify(table);
    if (data.gcmc == '') {
      app.alert('工程名称不能为空');
      return;
    }
    if (data.hhklx == '') {
      app.alert('混合科类型不能为空');
      return;
    }
    if (data.cpccwd == '') {
      app.alert('产品出厂温度不能为空');
      return;
    }
    var cs=false;
    var gg=false;
    table1.forEach(item => {
      if(!item.yclcs||item.yclcs=='请选择'){
        cs=true;
      }
      if (!item.yclgg|| item.yclgg == '请选择') {
        gg = true;
      }
    })
    if (accountInfo.miniProgram.appId !== 'wx2242bdf7b68a52dd') {
       if(cs){
          app.alert('请选择冷料仓配比厂商');
          return;
      }
    }
   
    if(gg){
      app.alert('请选择冷料仓配比规格');
      return;
    }
    console.info(data);
    delete data.llcpb
    delete data.rlcpb
    app.formPost('jipei/addJipei', data, function (res) {
      that.reload();
      app.success(res.data);
    })
  },
  reload() {
    var formData = {};
    formData.addUser = this.data.shr = JSON.parse(wx.getStorageSync('userInfo')).username;
    this.getScList();
    this.getYclList();
    this.getMbList();
    //console.info(this.data.yclcs);
    this.setData({
      formData: formData,
      index: 0,
      llcData: {},
      rlcData: {},
      tableList: [{ 'rlc': '1#' }, { 'rlc': '2#' }, { 'rlc': '3#' }, { 'rlc': '4#' }, { 'rlc': '5#' }],
      tableList1: [{ 'llcgg': '0-5', 'csIndex': 0, 'ggIndex': 0 },
        { 'llcgg': '5-10', 'csIndex': 0, 'ggIndex': 0 },
        { 'llcgg': '10-15', 'csIndex': 0, 'ggIndex': 0 }, 
        { 'llcgg': '15-20', 'csIndex': 0, 'ggIndex': 0 }],
      test: ''
    })

    const accountInfo = wx.getAccountInfoSync();
    if (accountInfo.miniProgram.appId === 'wx2242bdf7b68a52dd') {
      this.setData({
        tableList: [{ 'rlc': '仓1' }, { 'rlc': '仓2' }, { 'rlc': '仓3' }, { 'rlc': '仓4' }, { 'rlc': '仓5' },
          { 'rlc': '仓6' }, { 'rlc': '仓7' }, { 'rlc': '仓8' }, { 'rlc': '新粉1' }, { 'rlc': '新粉2' },
          { 'rlc': '回收料' }, { 'rlc': '回收粉' }, { 'rlc': '油石比' }, { 'rlc': '添加剂' }]
      })
    }
  },
  vNum(e) {
    let formData = this.data.formData;
    let value = e.detail.value.replace(/\D/g, '')
    let name = e.target.dataset.name;
    formData[name] = value;
    this.setData({
      formData: formData
    })
  }
})