var config = "debug";

var base_server_debug = "http://127.0.0.1:8099/student-web/";
var base_server_prod = "https://www.juxianjia.net/";
var base_server = base_server_debug;
if (config != "debug") {
  base_server = base_server_prod;
}

var SERVER = {
  home_getCommodityNewList: base_server + "mb/home/getCommodityNewList",
  home_getCommodityHotList: base_server + "mb/home/getCommodityHotList",
  home_getCommodityById: base_server + "mb/home/getCommodityById"
}

module.exports = {
  SERVER: SERVER,
}