var app = getApp();

App({
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
    token: ""
  }
})
