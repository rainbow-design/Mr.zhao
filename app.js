//app.js
var app = getApp();
var Event = (function () {
  var clientList = {},
    pub,
    sub,
    remove;

  var cached = {
  };

  sub = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    // 使用缓存执行的订阅不用多次调用执行
    cached[key + 'time'] == undefined ? clientList[key].push(fn) : '';
    if (cached[key] instanceof Array) {
      //说明有缓存的 可以执行
      fn.apply(null, cached[key]);
      cached[key + 'time'] = 1;
      // delete cached[key];
    }
  };
  pub = function () {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key];
    if (!fns || fns.length === 0) {
      //初始默认缓存
      cached[key] = Array.prototype.slice.call(arguments, 0);
      return false;
    }

    for (var i = 0, fn; fn = fns[i++];) {
      // 再次发布更新缓存中的 data 参数
      cached[key + 'time'] != undefined ? cached[key] = Array.prototype.slice.call(arguments, 0) : '';
      fn.apply(this, arguments);
    }

  };
  remove = function (key, fn) {
    var fns = clientList[key];
    if (!fns) {
      return false;
    } if (!fn) {
      fns && (fns.length = 0);
    } else {
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l];
        if (_fn === fn) {
          fns.splice(l, 1);
        }
      }
    }
  };
  return {
    pub: pub,
    sub: sub,
    remove: remove,
  }
})();
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    console.log('wx-----------------------------')
    console.log(wx);

    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 注册发布订阅模式
    wx.yue = Event;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  toIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 返回上一页
  returnLastPage() {
    wx.navigateBack({
      delta: 1
    })
  },
  setHeight(callback) {
    const sysInfo = wx.getSystemInfoSync(); // 设备信息
    const winHeight = sysInfo.windowHeight; // 设备高度
    const screenHeight = sysInfo.screenHeight;
    // console.log(screenHeight)
    callback(winHeight);
  },
  globalData: {
    userInfo: null
  }
})