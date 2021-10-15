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
    yclcsList:[
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
    csIndex:0,
    yclggList:[],
    ggIndex:0
  },
  pickerChange (e) {
    let index = e.detail.value
    var formData=this.data.formData;
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
  ggChange(e) {
    console.info(e);
    let index = e.detail.value
    this.setData({
      'llcData.yclgg': this.data.yclggList[index].name,
      'ggIndex': e.detail.value
    })
  },
  csChange(e){
    console.info(e);
    let index = e.detail.value
    this.setData({
      'llcData.yclcs':this.data.yclcsList[index].name,
      'csIndex': e.detail.value
    })
    this.getYclgg(this.data.yclcsList[index].yclgg)
  },
  radioChange (e) {
    console.log(e)
  },
  bindDateChange (e) {
    this.setData({
      date: e.detail.value,
      [`formData.date`]: e.detail.value
    })
  },
  switchTitle (d) {
    console.log(d)
    this.setData({
      titleVal: d.target.dataset.type
    })
  },
  submitForm () {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log(valid, errors)
    })
  },

  // 表格事件-热料仓
  rlcAddItem() {
    let arr = [...this.data.tableList]
    if (this.data.rlcData.rlc && this.data.rlcData.zl && this.data.rlcData.bz) {
      arr.push({ rlc: this.data.rlcData.rlc, zl: this.data.rlcData.zl, bz: this.data.rlcData.bz })
      this.setData({
        'rlcData.rlc': '',
        'rlcData.zl': '',
        'rlcData.bz': '',
        tableList: [...arr]
      })
    }
  },
  rlcDelItem(e) {
    let index = e.currentTarget.dataset.index
    let arr = [...this.data.tableList]
    arr.splice(index, 1)
    this.setData({
      tableList: [...arr]
    })
  },
  rlcInputChange1(e) {
    this.setData({
      'rlcData.rlc': e.detail.value
    })
  },
  rlcInputChange2(e) {
    this.setData({
      'rlcData.zl': e.detail.value
    })
  },
  rlcInputChange3(e) {
    this.setData({
      'rlcData.bz': e.detail.value
    })
  },

  // 表格事件-冷料仓
  llcAddItem() {
    let arr = [...this.data.tableList1]
    if (this.data.llcData.llcgg && this.data.llcData.yclcs && this.data.llcData.yclgg && this.data.llcData.zl) {
      arr.push({
        llcgg: this.data.llcData.llcgg, cs: this.data.llcData.yclcs, gg: this.data.llcData.yclgg,
        zl: this.data.llcData.zl })
      console.log(arr)
      this.setData({
        'llcData.llcgg': '',
        'llcData.yclcs': this.data.yclcsList[0].name,
        'llcData.yclgg': this.data.yclggList[0].name,
        'llcData.zl': '',
        'csIndex':0,
        'ggIndex':0,
        tableList1: [...arr]
      })
    }
  },
  llcDelItem(e) {
    let index = e.currentTarget.dataset.index
    let arr = [...this.data.tableList1]
    arr.splice(index, 1)
    this.setData({
      tableList1: [...arr]
    })
  },
  llcInputChange1(e) {
    this.setData({
      'llcData.llcgg': e.detail.value
    })
  },
  llcInputChange2(e) {
    this.setData({
      'llcData.yclcs': e.detail.value
    })
  },
  llcInputChange3(e) {
    this.setData({
      'llcData.yclgg': e.detail.value
    })
  },
  llcInputChange4(e) {
    this.setData({
      'llcData.zl': e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reload();
    
  },
  getScList() {
    let that=this;
    app.formPost('jipei/getSclist', {}, function (res) {
      //console.log(res)
      res.list.forEach(item=>{
        //console.log(item);
        item.id = item.task_id + ";" + item.task_no + ";" + item.engineer_name + ";" + item.concrete_name;
        item.name = item.task_no+"(" +item.engineer_name+")";
      })
      that.setData({list:res.list});
    })
  },
  getYclList(){
    let that = this;
    app.appGet('/gongyingshang/getSupplierList?pageIndex=1&pageSize=99999&bg_time=&ed_time=', function (res) {
      //console.log(res)
      let index=0;
      for(let i=0;i<res.list.length;i++){
        let item=res.list[i];
        item.name = item.u_Name
        app.formPost('jipei/getYccgg', { id: item.id }, function (re) {
          //console.info(re)
          re.list.forEach(ite => {
            ite.name = ite.u_Name
          })
          item.yclgg = re.list;
          if (index == 0) {
            that.getYclgg(re.list);
          }
          index++;
        })
      }

      let llcData=that.data.llcData;
      console.info(that.data.llcData)
      llcData.yclcs = res.list[0].name;
      that.setData({yclcsList: res.list, 'llcData': llcData});
      console.info(that.data.llcData)
    })
  },
  getYclgg(list){
      let that = this;
      let llcData = that.data.llcData;
    console.info(that.data.llcData)
      llcData.yclgg = list[0].name;
      that.setData({ yclggList: list, llcData });
      console.info(that.data.llcData)
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
  addpb:function(e){
    let that=this;
    that.reload();
    var data = e.detail.value;
    
    let formData = this.data.formData;
    for (let key in formData){
      data[key]=formData[key];
    }
    var table = this.data.tableList;
    var table1 = this.data.tableList1;
    table1.push(this.data.llcData);
    table.push(this.data.rlcData);
    data.llcjson=JSON.stringify(table1);
    data.rlcjson = JSON.stringify(table);
    if (data.jpbh == '' ){
      app.alert('级配编号不能为空');
      return;
    }
    if ( data.gcmc == '') {
      app.alert('工程名称不能为空');
      return;
    }
    if ( data.hhklx == '' ) {
      app.alert('混合科类型不能为空');
      return;
    }
    if (data.cpccwd == '') {
      app.alert('产品出厂温度不能为空');
      return;
    }
    
    app.formPost('jipei/addJipei',data,function(res){
      that.reload();
      app.success(res.data);
    })
  },
  reload(){
    var formData = {};
    formData.addUser = this.data.shr = JSON.parse(wx.getStorageSync('userInfo')).username;
    this.getScList();
    this.getYclList();
    console.info(this.data.yclcs);
    this.setData({
      formData: formData,
      index:0,
      llcData: { },
      rlcData:{},
      tableList: [{ 'rlc': '1#' }, { 'rlc': '2#' }, { 'rlc': '3#' }, { 'rlc': '4#' }, { 'rlc': '5#' }],
      tableList1: [{ 'llcgg': '0-5' }, { 'llcgg': '5-10' }, { 'llcgg': '10-15' }, { 'llcgg': '15-20' }],
      test:''
    })
  },
  vNum(e) {
    let formData=this.data.formData;
    let value = e.detail.value.replace(/\D/g, '')
    let name=e.target.dataset.name;
    formData[name]=value;
    this.setData({
      formData:formData
    })
  }
})