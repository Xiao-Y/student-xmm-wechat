var app = getApp();
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
/**
 * 获取最新商品
 */
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
Page({
  onLoad: function (options) {
    getCommodityNewList(this);
  },
  // bindscrolltolower: function () {
  //   getCommodityNewList(this);
  // },
  onPullDownRefresh: function () {
    getCommodityNewList(this);
  }
})