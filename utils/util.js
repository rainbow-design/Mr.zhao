const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// console.log((new Date(dateStr)).formate("yyyy-MM-dd"))
Date.prototype.formate = function (format) {
  const o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "h+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds()
    // millisecond
  };

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  }
  return format;
};

function parseCtime(str) {
  var temp = str;
  if (typeof temp === "string") {
    temp = Number(str) * 1000;
  }
  return new Date(temp).formate("yyyy-MM-dd");
}

function toFixed(number, fractionDigits) {
  var times = Math.pow(10, fractionDigits);
  var roundNum = Math.round(number * times) / times;
  return roundNum.toFixed(fractionDigits);
}

function parseDistance(number) {
  var distance = number / 1000;
  return toFixed(distance, 1);
}

function sendRequest(path, data, callback) {
  wx.request({
    url: path,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: "POST",
    success: (res) => {
      // wx.showLoading({
      //   title: '加载中',
      // })
      callback(res);
    },
    complete: () => {
      // wx.hideLoading();
    },
    fail: (res) => {
      console.log(res)
    }
  })
}

function promiseRequest(url, data = {}) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        if (res.statusCode == 200) {
          // wx.showLoading({
          //   title: '加载中',
          // })
          resolve(res);
        } else {
          reject(res.errMsg);
        }

      },
      complete: () => {
        // wx.hideLoading();
      },
      fail: (err) => {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function getDataCommon(url, paramObj, callbackFn) {
  promiseRequest(url, paramObj)
    .then(res => {
      var data = res.data.response_data.lists;
      callbackFn(data);
    })
    .catch(error => {
      console.log(error)
    })
}

function toast(content) {
  wx.showToast({
    title: content,
    icon: 'none'
  })
}

function printDetail(name, data, callback) {
  console.log(name + '--------------');
  console.dir(data);
  callback(data);
}

function getLocation(callback) {
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      callback(latitude, longitude)
    },
    fail(error) {
      throw new Error("获取位置信息失败...")
    }
  })
}

function getCityInfo(lat, lng, mapKey, callback) {
  // 逆位置解析
  // https://lbs.qq.com/webservice_v1/guide-gcoder.html
  wx.request({
    url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${mapKey}`,
    success: res => {
      callback(res.data.result);
    }
  })
}
// 根据 stick 排序，同时对每个数据处理
function sortByStick(arr, otherChoose) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    item.stick === "1" ? newArr.push(item) && arr.splice(i, 1) && i-- : "";
    typeof otherChoose === 'function' ? otherChoose(item) : '';
  }
  return newArr.concat(arr)
}

function getChinaCityList(qqmapSDK, callback) {
  //调用获取城市列表接口
  qqmapSDK.getCityList({
    success: function (res) {//成功后的回调
      callback(res);
      // console.log('省份数据：', res.result[0]); //打印省份数据
      // console.log('城市数据：', res.result[1]); //打印城市数据
      // console.log('区县数据：', res.result[2]); //打印区县数据
    },
    fail: function (error) {
      console.error(error);
    },
    complete: function (res) {
      console.log(res);
    }
  });
}
module.exports = {
  sendRequest: sendRequest,
  promiseRequest: promiseRequest,
  getDataCommon: getDataCommon,
  formatTime: formatTime,
  parseDistance: parseDistance,
  toast: toast,
  parseCtime: parseCtime,
  log: printDetail,
  getLocation: getLocation,
  getCityInfo: getCityInfo,
  sortByStick: sortByStick,
  getChinaCityList: getChinaCityList
}