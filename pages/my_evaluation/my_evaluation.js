// pages/my_evaluation/my_evaluation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SJ_star: [0, 1, 2, 3, 4],
    PS_star: [0, 1, 2, 3, 4],
    normal: '../../assets/icon/star.png',
    stared: '../../assets/icon/star_act.png',
    Ps_num: 0,
    SJ_num: 0,
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  textareaInp(e) {
    this.setData({
      text: event.detail.value
    })
  },
  ps_start(e) {
    var data = e.currentTarget.dataset;
    console.log(data.key);
    this.setData({
      Ps_num: data.key + 1
    })
  },
  sj_start(e) {
    var data = e.currentTarget.dataset;
    console.log(data.key);
    this.setData({
      SJ_num: data.key + 1
    })
  },
  submitMsg() {
    console.log('配送评价:' + this.data.Ps_num)
    console.log('商家评价:' + this.data.SJ_num)
    console.log('详细评价' + this.data.text)
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