// pages/my_addShippingAddress/my_addShippingAddress.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressType: '', // 无初始值，不影响结果
    showCitySelect: false,
    nowdata: [],
    name: '',
    phone: '',
    province_name: '', // 省
    city_name: '', // 市
    area_name: '', // 区
    detail_addr: '', // 详细
    type_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var y = this;
    console.dir(options.data)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var y = this;
    wx.yue.sub("editAddress", function(data) {
      console.log(data);
      y.setData({
        nowdata: data.item
      })
    })

    console.log(this.data.nowdata)
  },
  changeInput(e) {
    var name = e.currentTarget.dataset.name;
    var thisData = this.data;
    this.setData({
      [name]: e.detail.value,

    })
  },
  // 选择地址类型
  selectAddressType(e) {
    var data = e.currentTarget.dataset;
    this.setData({
      addressType: Number(data.num)
    })

  },
  selectCity() {
    this.setData({
      showCitySelect: true
    })
  },
  saveAddressToSubmit() {
    var y = this,
      nowdata = y.data.nowdata;
    let name = this.data.name || nowdata.name;
    let phone = this.data.phone || nowdata.phone;
    let detail_addr = this.data.detail_addr || nowdata.detail_addr;
    var AdTypeObj = {
      '0': '住宅',
      '1': '公司',
      '2': '学校'
    }
    var defaultType = nowdata.type_name;
    var type = Object.values(AdTypeObj).findIndex((v) => {
      return v === defaultType
    });
    var is_default = nowdata.is_default;
    var id = nowdata.id;
    const qqmapsdk = new QQMapWX({
      key: `GRBBZ-C6A35-IJLI7-QKHAT-NXZ7S-IQBG6` // 必填
    });
    util.getChinaCityList(qqmapsdk, function(res) {
      console.log(res);
    })
    console.log(type)
    console.log(name)
    console.log(phone)
    console.log(detail_addr)
  },
  deleteAddress() {
    var y = this,
      nowdata = y.data.nowdata;
    var id = nowdata.id;
    util.promiseRequest(api.remove_addr, {
      id: id,
      uid: app.globalData.access_token
    }).then((res) => {
      var data = res.data.response_data.lists;
      if (data == 1) {
        wx.showToast({
          title: '删除地址成功...',
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
          title: '删除失败...',
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})