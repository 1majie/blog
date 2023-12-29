/*
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-23 12:06:29
 * @FilePath: \blog_before_vue3_nuxt\utils\util.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dayjs from "dayjs"//js引入
export default {
  getBaseUrl() {
    if (process.server) {
      // 这里是服务端代码
      return import.meta.env.SERVER_URL;
    } else {
      return "/api"
    }
  },
  //format 定义需要显示的格式
  dataFliter(val, format = "YYYY-MM-DD hh:mm:ss") {
    return dayjs(val).format(format);
  }
};
