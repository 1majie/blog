/*
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-12 06:54:19
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-23 09:18:02
 * @FilePath: \blog_before_vue3_nuxt\server\api\urls.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export default defineSitemapEventHandler(async () => {
  // 通过后台地址获取所有页面
  const pages = await $fetch<{ pages: { slug: string; title: string } }>(
    "http://120.46.209.137/api/base/getTblContentAll"
  );
  // 遍历添加地址到sitemap 目前不支持英文，配置转换后，？后的内容消失了
  let arr = [];
  const p = pages.data.result;
  for (let i = 0; i < p.length; i++) {
    let loc =
      "/maintance?id=" +
      p[i].ID +
      "&type=" +
      p[i].type +
      "&title=" +
      p[i].title;
    arr.push({
      loc: loc,
      lastmod: p[i].UpdatedAt,
      changefreq: "weekly",
      priority: 0.8,
    });
  }
  let menus = ["编程记录", "运维建站", "网络安全", "工具软件", "随笔杂谈"];
  for (let i = 0; i < menus.length; i++) {
    let loc = "/maintance?type=" + menus[i];
    arr.push({
      loc: loc,
      lastmod: p[i].UpdatedAt,
      changefreq: "weekly",
      priority: 0.8,
    });
  }
  return arr;
});
