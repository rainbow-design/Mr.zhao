const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPopoutMenu: false,
    submit_success: false,
    contentText: null,
    s_id: "",
    name: "",
    phone: "",
    content: "",
    lifeList: []
  },
  // 选择生活服务
  chooseType(e) {
    this.setData({
      s_id: e.currentTarget.dataset.s_id,
      contentText: e.currentTarget.dataset.text
    });
  },
  // 获取生活服务
  getLife() {
    let that = this;
    util.promiseRequest(api.service_life, {}).then(res => {
      that.setData({
        lifeList: res.data.response_data.lists
      });
    });
  },
  // input值获取
  inputData(e) {
    var key = e.currentTarget.dataset.name;
    console.log(e.detail.value);
    this.setData({
      [key]: e.detail.value
    });
  },
  // 提交
  submitMessage() {
    let that = this;
    if (this.data.s_id === "") {
      wx.showToast({
        title: "请选择服务类型",
        icon: "none",
        duration: 2000
      });
      return;
    }
    var phone = this.data.phone;
    if (!util.checkType(phone, "phone")) {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
        duration: 2000
      });
      return;
    }
    let params = {
      s_id: this.data.s_id,
      name: this.data.name,
      phone: this.data.phone,
      content: this.data.content
    };
    util.promiseRequest(api.add_message, {}).then(res => {
      this.setData({
        submit_success: true
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLife();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  showPopoutMenu() {
    this.setData({
      showPopoutMenu: !this.data.showPopoutMenu
    });
  },
  toIndex() {
    app.toIndex();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
