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
// 四舍五入 格式化数字
// toFix(8440.55,1) => 8440.6
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
        data.access_token === undefined ? data.access_token = wx.getStorageSync("token") : '';
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
                console.log("failed，网络出错")
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
        type: 'gcj02',
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

function getChinaCityList(qqmapSDK, callback) {

    //调用获取城市列表接口
    qqmapSDK.getCityList({
        success: function (res) { //成功后的回调
            callback(res);
            console.log('省份数据：', res.result[0]); //打印省份数据
            console.log('城市数据：', res.result[1]); //打印城市数据
            console.log('区县数据：', res.result[2]); //打印区县数据
        },
        fail: function (error) {
            console.error(error);
        },
        complete: function (res) {
            console.log(res);
        }
    });
}

// 计算当前位置到目标点距离
function calculateDistance(qqmapsdk, lat, lng, data, callback) {
    var _this = this;
    qqmapsdk.calculateDistance({
        from: lat + "," + lng,
        to: data,
        success: function (res) {
            var distanceArr = res.result.elements;
            callback(distanceArr);
        },
        fail: function (res) {
            console.log(res);
        }

    })
}



function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var canApply = !timeout;
            timeout = setTimeout(function () {
                timeout = null; // 在 wait 时间后防抖函数才可以再次被触发
            }, wait)
            if (canApply) func.apply(context, args) // 第一次 !undefined 执行
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }

    }
}

function checkType(str, type) {
    switch (type) {
        case 'empty':
            return (str == null || str == '' || str == undefined || typeof (str) == typeof (undefined));
        case 'email':
            return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        case 'phone':
            return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
        case 'tel':
            return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
        case 'number':
            return /^[0-9]$/.test(str);
        /**
         * 校验邮政编码
         * @param {string} str 字符串
         * @return {bool}
         */
        case 'isZipCode':
            return /^(\d){6}$/.test(str);
        case 'isURL':
            return /^(https|http):\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str);
        case 'english':
            return /^[a-zA-Z]+$/.test(str);
        case 'allChinese':
            return /^[\u4E00-\u9FA5]+$/.test(str);
        case 'hasChinese':
            return /^[\u4E00-\u9FA5]/.test(str);
        case 'lower':
            return /^[a-z]+$/.test(str);
        case 'upper':
            return /^[A-Z]+$/.test(str);
        default:
            return true;
    }
}

function throttle(fn, gapTime = 1500) {
    let _lastTime = null
    // 返回新的函数
    return function () {
        let _nowTime = +new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments) //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
}

function addKey(arr, obj, callback) {
    if (typeof arr === 'object' && !arr.length) {
        var obj_temp = arr;
        var arr = [];
        for (let i in obj_temp) {
            arr.push(obj_temp[i]);
        }
    } else {
        var temp = arr.forEach((v, index, arr) => {
            typeof callback === 'function' ? callback(v, index) : '';
            for (var key in obj) {
                v[key] = obj[key]
            }
        })
    }

}

function filterObjToArr(obj) {
    if (typeof obj === 'object' && !obj.length) {
        var arr = [];
        for (let i in obj) {
            arr.push(obj[i]);
        }
        return arr;
    } else {
        return obj;
    }
}

// 获取视图dom元素信息
function getEle(domStr, callback) {
    const query = wx.createSelectorQuery();
    query.select(domStr).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
        callback(res)
    })
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
    getChinaCityList: getChinaCityList,
    checkType: checkType,
    addKey: addKey,
    toFixed,
    debounce,
    throttle,
    calculateDistance,
    getEle,
    filterObjToArr
}