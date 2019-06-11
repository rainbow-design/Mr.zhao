// pages/my_evaluation/my_evaluation.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../api/index.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    SJ_star: [0, 1, 2, 3, 4],
    PS_star: [0, 1, 2, 3, 4],
    normal: "../../assets/icon/star.png",
    stared: "../../assets/icon/star_act.png",
    Ps_num: 0,
    SJ_num: 0,
    text: "",
    order_no: 1,
    staff_id: 1,
    thumb: []
  },
  photo(e) {
    let that = this;
    let thumb = this.data.thumb;
    let num = 4 - thumb.length;
    wx.chooseImage({
      count: num,
      success(res) {
        let img = res.tempFilePaths;
        for (let i = 0; i < img.length; i++) {
          console.log(img[i]);
          wx.uploadFile({
            url: api.upload_image,
            filePath: img[i],
            name: "image",
            success(res) {
              if (thumb.length < 4) {
                thumb.push(JSON.parse(res.data).response_data.file_name_url);
                console.log(thumb);
                that.setData({
                  thumb: thumb
                });
              } else {
                wx.showToast({
                  title: "最多添加4张图片",
                  icon: "none",
                  duration: 2000
                });
              }
            }
          });
        }
      }
    });
  },
  // 删除图片
  deleteIMG(e) {
    let index = e.currentTarget.dataset.index;
    let thumb = this.data.thumb;
    thumb.splice(index, 1);
    this.setData({
      thumb: thumb
    });
  },
  submit() {
    let params = {
      order_no: this.data.order_no,
      content: this.data.text,
      staff_id: this.data.staff_id,
      staff_star: this.data.Ps_num,
      order_star: this.data.SJ_num,
      order_img: this.data.thumb.join(",")
    };
    if (
      this.data.Ps_num == 0 ||
      this.data.SJ_num == 0 ||
      this.data.text.length == 0
    ) {
      wx.showToast({
        title: "请填写完整",
        icon: "none",
        duration: 2000
      });
    } else {
      util.promiseRequest(api.comment, params).then(res => {
        if (res.data.error_msg) {
          wx.showToast({
            title: res.data.error_msg,
            icon: "none",
            duration: 2000
          });
          return;
        }
        wx.showToast({
          title: "评论成功",
          icon: "none",
          duration: 2000
        });
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_no: options.orderId,
      staff_id: options.staffId
    });
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  textareaInp(e) {
    this.setData({
      text: e.detail.value
    });
  },
  ps_start(e) {
    var data = e.currentTarget.dataset;
    console.log(data.key);
    this.setData({
      Ps_num: data.key + 1
    });
  },
  sj_start(e) {
    var data = e.currentTarget.dataset;
    console.log(data.key);
    this.setData({
      SJ_num: data.key + 1
    });
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
