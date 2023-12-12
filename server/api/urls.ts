/*
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-12 06:54:19
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-12 22:00:30
 * @FilePath: \blog_before_vue3_nuxt\server\api\urls.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export default defineSitemapEventHandler(async () => {
  // fetch data directly in the correct type
  const pages = await $fetch<{ pages: { slug: string; title: string } }>(
    "http://localhost:8888/base/getTblContentAll"
  );
  let arr = [];
  const p = pages.data.result;
  for (let i = 0; i < p.length; i++) {
    let loc = "/maintance?id=" + p[i].ID + "&type=VPS&title=" + p[i].title;
    // map URLS as needed
    arr.push({ 
      loc: loc,
      lastmod:p[i].UpdatedAt,
      changefreq: "weekly",
      priority: 0.8
    });
  }
  return arr;
});
