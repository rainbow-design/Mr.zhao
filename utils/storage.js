const Storage = {
  setItem: function (key, obj) {
    wx.setStorage({
      key: key,
      data: obj
    })
  },
  getItem: function (key) {
    return wx.getStorageSync(key);
  },
  removeItem: function (key) {
    wx.removeStorage({
      key: key
    })
  }
}

module.exports = Storage;