// pages/my_memberInfo.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initData: [],
    nickname: '',
    phone: '',
    sex: '',
    birthday: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var y = this;
    wx.yue.sub("userInfo", function (data) {
      y.setData({
        initData: data
      })
      console.log(data);
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
  changeInput(e) {
    var name = e.currentTarget.dataset.name;
    var thisData = this.data;
    this.setData({
      [name]: e.detail.value,

    })
  },
  selectSex(e) {
    // 男，女
    var sex = e.currentTarget.dataset.sex;

    this.setData({
      sex: sex == '男' ? '0' : '1',
      'initData.sex_name': sex

    })
  },
  saveUserInfo() {
    var y = this;
    var thisData = this.data;
    var getBirthday = function (str) {
      return str.split(' ')[0]
    }
    let nickname = this.data.nickname || thisData.initData.nickname;
    let sex = this.data.sex || thisData.initData.sex;
    let mobile = thisData.mobile;
    let birthday = this.data.birthday || getBirthday(thisData.initData.birthday);

    util.promiseRequest(api.add_user_info, {
      access_token: app.globalData.access_token,
      nickname: nickname,
      sex: sex,
      birthday: birthday
    }).then(res => {
      var data = res.data.response_data.lists;
      if (data == 1) {
        wx.showToast({
          title: '更新成功...',
          icon: 'none',
          duration: 1000,
          complete: function () {
            setTimeout(() => {
              app.returnLastPage();
            }, 1000)
          }
        })
      } else {
        wx.showToast({
          title: '重置失败...',
          icon: 'none',
          duration: 1000,
          complete: function () {
            setTimeout(() => {
              app.returnLastPage();
            }, 1000)
          }
        })
      }

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

  }
})