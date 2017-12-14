var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");

var getCommodityNewList = function (that) {
  httpUtil.http_get(URL.SERVER.home_getCommodityNewList, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      // var data = JSON.parse(res.data.data);
      that.setData({
        NewList: res.data,
        hidden: true
      });
    }
  });
}

var getCommodityHotList = function (that) {
  httpUtil.http_get(URL.SERVER.home_getCommodityHotList, null, function (res) {
    if (!res.data.error || res.data.length > 0) {
      // var data = JSON.parse(res.data.data);
      that.setData({
        HotList: res.data,
        hidden: true
      });
    }
  });
}

Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  onLoad: function (options) {
    getCommodityNewList(this);
    getCommodityHotList(this);
  }, 
  onPullDownRefresh: function () {
    getCommodityNewList(this);
    getCommodityHotList(this);
  }, 
  getCommodityById :function(e){
    var id = this.data.NewList[e.currentTarget.dataset.index].id;
    var url = "../component/details/details?id=" + id;
    //tipsUtil.showConfirm(id);
    wx.navigateTo({
      url: url,
      complete: function (res) {
        console.log(res)
      }
    })
  }
})