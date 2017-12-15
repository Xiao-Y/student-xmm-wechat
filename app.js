var app = getApp();
const URL = require("utils/urlUtil");

//查询数据库中用户信息
var syncOpenIdToServer = function (code) {
  wx.request({
    url: URL.SERVER.home_login,
    data: {
      code: code,
    },
    success: function (res) {
      console.log(res);
      console.log("rd_session: " + res.data);
      var userInfo = res.data;
      getApp().globalData.rd_session = userInfo;
      wx.setStorageSync('rd_session', userInfo);
      getApp().globalData.header.Cookie = 'JSESSIONID=' + userInfo.sessionId;
    }
  });
}

App({
  onLaunch: function () {
    this.checkSession();
    this.getUserInfo();
  },
  //校验用户session
  checkSession: function () {
    var that = this
    wx.checkSession({
      success: function () {
        console.log("checkSession success!");
      },
      fail: function () {
        console.log("checkSession fail!");
        that.wxLogin();
      }
    })
  },
  wxLogin: function (cb) {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          syncOpenIdToServer(res.code);
          console.log('获取用户登录态 code is:' + res.code)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        //获取用户信息
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            wx.setStorageSync('userInfo', res.userInfo);
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        that.globalData.userInfo = userInfo;
        typeof cb == "function" && cb(that.globalData.userInfo);
      } else {
        //调用登录接口
        that.wxLogin(cb);
      }
    }
  },
  getSession: function (cb) {
    if (!this.globalData.rd_session) {
      this.globalData.rd_session = wx.getStorageSync('rd_session')
    }
    console.log('用户session is: ' + this.globalData.rd_session);
    return this.globalData.rd_session;
  },
  getToken: function (cb) {
    if (!this.globalData.token) {
      this.globalData.token = wx.getStorageSync('token')
    }
    console.log('用户token is: ' + this.globalData.token);
    return this.globalData.token;
  },
  globalData: {
    userInfo: null,
    rd_session: "",
    token: "",
    header: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": "" }
  }
})
