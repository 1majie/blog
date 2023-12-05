import dayjs from "dayjs"//js引入
export default {
  getBaseUrl() {
    if (process.server) {
      // 这里是服务端代码
      return "http://localhost:8888";
    } else {
      return "/api"
    }

  },
  //format 定义需要显示的格式
  dataFliter(val, format = "YYYY-MM-DD hh:mm:ss") {
    return dayjs(val).format(format);
  }
};
