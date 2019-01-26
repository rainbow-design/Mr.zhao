// pages/my.js
const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const mock = require("../../mock/mock.js");
Page({
  data: {
    noCartData: false,
    cartList: [],
    totalPrice: 0,
    isCheckAll: false,
    startX: '', // 初始手指接触位置,
    delBtnWidth: 120
  },
  changeCart(id, num) {
    let params = {
      goods_id: id,
      type: 1,
      num: num
    }
    util.promiseRequest(api.cart_add, params).then((res) => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },
  toJieSuan() {
    wx.navigateTo({
      url: `../shoppingCart_confirm/shoppingCart_confirm`
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.showCartList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  // 开始滑动事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
      // console.log(e.touches[0].clientX)
    }
  },
  touchM: function (e) {
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      var index = e.currentTarget.dataset.index;
      var list = that.data.cartList;
      list[index].txtStyle = txtStyle;
      this.setData({
        cartList: list
      });
    }
  },
  touchE: function (e) {
    // console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0px";
      var index = e.currentTarget.dataset.index;
      var list = that.data.cartList;
      list[index].txtStyle = txtStyle;
      that.setData({
        cartList: list
      });
    }
  },
  delItem(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.cartList;
    list.splice(index, 1);
    this.setData({
      cartList: list
    })
  },

  showCartList() {
    var y = this;
    util.promiseRequest(api.cart_list, {
      access_token: app.globalData.access_token
    })
      .then(res => {
        var data = res.data.response_data.lists;
        if (data === "" || data.length === 0) {
          y.setData({
            noCartData: true
          })
        } else {
          util.addKey(data, {
            "y_isCheck": false
          })
          console.log(data)
          y.setData({
            cartList: data,
            noCartData: false,
          })
          y.getTotalPrice(data);
        }
      })
    // 切换mock
    // setTimeout(() => {

    //   util.addKey(mock.cartList, {
    //     "y_isCheck": false
    //   })
    //   console.log(mock.cartList)
    //   y.setData({
    //     cartList: mock.cartList,
    //     noCartData: false,
    //   })
    //   y.getTotalPrice(mock.cartList);
    // }, 300)
  },
  getTotalPrice(data) {
    var data = data || this.data.cartList;
    let cost = 0;
    data.forEach(item => {
      item.y_isCheck ? cost += item.price * item.num : '';
    });

    cost = util.toFixed(Number(cost), 1);

    this.setData({
      totalPrice: cost
    })

  },
  checkGoods(e) {
    var data = e.currentTarget.dataset;
    var cartList = this.data.cartList;
    var index = data.index;
    this.setData({
      [`cartList[${index}].y_isCheck`]: !cartList[`${index}`].y_isCheck
    })
    var checkedLength = function (data) {
      var length = 0;
      data.forEach(v => {
        v.y_isCheck === true ? length += 1 : '';
      })
      return length;
    }

    var nowSelectedNum = checkedLength(this.data.cartList);
    // console.log("当前选中个数:" + nowSelectedNum)
    if (nowSelectedNum === cartList.length) {
      this.setData({
        isCheckAll: true
      })
    } else {
      this.setData({
        isCheckAll: false
      })
    }
    // 计算总价
    this.getTotalPrice();
  },
  checkAll() {
    var y = this;
    var isCheckAll = y.data.isCheckAll;
    this.setData({
      isCheckAll: !isCheckAll
    })
    var cartList = this.data.cartList;
    cartList.forEach(v => {
      v.y_isCheck = !isCheckAll
    })

    y.setData({
      cartList: cartList
    })
    // 计算总价
    this.getTotalPrice();

  },
  // 加
  numAdd(e) {
    let data = e.currentTarget.dataset,
      cartList = this.data.cartList;
    let index = data.index;
    let num = data.num;

    this.setData({
      [`cartList[${index}].num`]: cartList[`${index}`].num + 1
    })
    // 计算总价
    this.getTotalPrice();
    this.changeCart(e.currentTarget.dataset.id, Number(num) + 1);
  },
  // 减
  minusNum(e) {
    let data = e.currentTarget.dataset,
      cartList = this.data.cartList;
    let index = data.index,
      num = data.num;
    let newNum = cartList[`${index}`].num > 1 ? cartList[`${index}`].num - 1 : 1;
    this.setData({
      [`cartList[${index}].num`]: newNum
    })
    // 计算总价
    this.getTotalPrice();
    this.changeCart(e.currentTarget.dataset.id, newNum);
  }
})