const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
const tipsUtil = require("../../../utils/tipsUtil");

var getCommodityById = function (that, param) {
  httpUtil.http_get(URL.SERVER.home_getCommodityById, param, function (res) {
    if (!res.data.error || res.data.length > 0) {
      that.setData({
        goods: res.data,
        hidden: true
      });
    }
  });
}



Page({
  onLoad: function (options) {
    var id = options.id;
    //tipsUtil.showConfirm(id);
    var param = {"id":id};
    getCommodityById(this, param);
  },
  data:{
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },
  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
})