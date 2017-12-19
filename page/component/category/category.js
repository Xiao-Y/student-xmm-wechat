var app = getApp();
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
/**
 * 获取商品列表
 */
var shop = function (that, param) {
  httpUtil.http_get(URL.SERVER.commodity_shop, param, function (res) {
    if (!res.data.error || res.data.length > 0) {
      //返回有数据
      if (res.data.list && res.data.list.length > 0) {
        //当数据长度小于页面大小时或者当前页面号大小于等于总页数据时说明分页数据已经全部加载，没有更多数据
        if (res.data.list.length < that.data.pageSize || res.data.pageNum >= that.data.pages) {
          that.setData({ loadingComplete: false });
        }
        let list = [];
        //如果isEmpeyList是true从data中取出数据，否则先从原来的数据继续添加
        that.data.isEmpeyList ? list = res.data.list : list = that.data.shopList.concat(res.data.list);
        that.setData({
          shopList: list,
          loading: true,//隐藏加载图形
          pages: res.data.pages,//总页数
          pageNum: res.data.pageNum,//当前页面
          pageSize: res.data.pageSize//页面大小
        });
      }
    }
  });
}
Page({
  data: {
    scrollTop: 0,//锚点
    shopList: [],//商品数据
    isEmpeyList: true,   // 用于判断shopList数组是不是空数组，默认true，空的数组
    loading: false, //"上拉加载"的变量，默认false，显示
    loadingComplete: true  //“没有数据”的变量，默认true，隐藏
  },
  onReady: function () {
    shop(this, null);
  },
  bindDownLoad: function () {//  该方法绑定了页面滑动到底部的事件
    var that = this;
    //判断是否上拉加载并且还有数据
    if (that.data.loading && that.data.loadingComplete) {
      console.info("页面滑动到底部...");
      that.setData({
        isEmpeyList: false,  //触发到上拉事件，把isEmpeyList设为为false  
        loading: false
      });
      //总页面数大于当前页面号时不在请求
      if (that.data.pages > that.data.pageNum) {
        var pageNum = that.data.pageNum + 1;//下一页
        var pageSize = that.data.pageSize;//页面大小
        var param = { pageSize: pageSize, pageNo: pageNum };
        shop(that, param);
      } else {
        that.setData({
          loading: true
        });
      }
    }
    console.info(that.data.shopList.length);
  },
  scroll: function (event) {//  该方法绑定了页面滚动时的事件
    // 我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  getCommodityById: function (e) {
    var id = e.currentTarget.dataset.index;
    var url = "../../component/details/details?id=" + id;
    wx.navigateTo({
      url: url,
      complete: function (res) {
        console.log(res)
      }
    })
  }
})