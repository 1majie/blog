<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-10 15:47:30
 * @FilePath: \blog_before_vue3_nuxt\components\Build.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import utils from '~/utils/util';
import Prism from 'prismjs'
import { ref, nextTick } from 'vue';
const baseUrl = utils.getBaseUrl();
let colorMode = ref({});
let content = ref();
let menus = ref();
let back = ref();
let after = ref();
let id = 1
const route = useRoute()
let url = ref("")
let userName = ref("");
let docMenu = ref([]);
let active = ref(0);
let type = "技术"
let list = ref([]);
// 获取文章id
if (route.query.id) {
  id = route.query.id
  type = route.query.type
}

// 猜你喜欢
const getList = async () => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: count } = await useFetch(baseUrl + '/base/getTblContentList?page=1&pageSize=10&type=' + type)
  list.value = count.value.data.result.list;
}

// 设置浏览量
const setView = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  await useFetch(baseUrl + '/base/UpdateTblContentViewNum?ID=' + id)
}

// 获取文章内容
const getTblContent = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: count } = await useFetch(baseUrl + '/base/getTblContent?ID=' + id)
  content.value = count.value.data.retblContent;
  menus.value = count.value.data.menus;
  back.value = count.value.data.back;
  after.value = count.value.data.after;
  getUserName(count.value.data.retblContent.authorId);
}

// 获取用户名称
const getUserName = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: username } = await useFetch(baseUrl + '/base/GetUserName?id=' + id)
  userName.value = username.value.data.userName;
}

getTblContent(id);
getList();
onMounted(async () => {
  await nextTick()
  setView(id);
  colorMode.value = useColorMode();
  Prism.highlightAll();
  // 获取文章地址
  url = window.location.href;
  window.addEventListener('scroll', onScroll)
  getList();
  window.scrollTo({
        top: 0,
        behavior: 'smooth' // 如果要平滑滚动，请添加这个选项
      });
})
onUpdated(() => {
  // 代码高亮
  Prism.highlightAll(); //修改内容后重新渲染
  initArt()
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
});
// 修改代码复制文字为中文
useHead({
  bodyAttrs: {
    "data-prismjs-copy": "复制",
    "data-prismjs-copy-error": "复制出错",
    "data-prismjs-copy-success": "已复制"
  }
})
// 当路由参数发生变化 重新获取文章内容
watch(() => route.query, (newQuery, oldQuery) => {
  if (newQuery.id !== oldQuery.id) {
    // 当 id 参数发生变化时执行你的逻辑
    id = newQuery.id;
    getTblContent(id);
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // 如果要平滑滚动，请添加这个选项
      });
  }
});

// 获取文章锚点
const initArt = () => {
  let markMenu = []
  setTimeout(() => {
    const articleDom = document.querySelector('.editor-content-view')
    if (articleDom) {
      for (let ele of articleDom.children) {
        let i = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(ele.tagName.toLowerCase())
        if (i > -1 && ele.textContent) {
          ele.setAttribute('id', 'markMenu_' + markMenu.length)
          ele.setAttribute('name', 'markMenu_' + markMenu.length)
          markMenu.push({
            level: i,
            text: ele.textContent,
            id: 'markMenu_' + markMenu.length,
            name: 'markMenu_' + markMenu.length
          })
        }
      }
    }
    //docMenu为目录数据
    docMenu.value = markMenu
  })
}

// 处理滚动事件
const handlerSroll = (e, id) => {
  //由于存在头部的关系,会挡住标题,所以还需计算滚动头部的高度
  const element = document.querySelector(`.page-header`);
  const targetDom = document.querySelector(`#${id}`);
  //测试到火狐浏览器存在锚点定位的问题,使用scrollIntoView的方法
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    e.preventDefault()
    targetDom.scrollIntoView({
      //滚动到指定节点
      block: "start",
      behavior: "auto",
    });
    setTimeout(() => {
      window.scrollBy(0, -element.offsetHeight)
    }, 100)
    return
  }
  window.scrollBy(0, -element.offsetHeight)
}

// 滚动事件
const onScroll = () => {
  const element = document.querySelector(`.page-header`);
  // 获取所有锚点元素
  const titleNavList = document.querySelectorAll('.article h1,.article h2,.article h3,.article h4,.article h5,.article h6')
  // 计算所有锚点元素的 offsetTop + 头部的高度
  const offsetTopList = []
  titleNavList.forEach(item => {
    offsetTopList.push(item.offsetTop - element.offsetHeight)
  })
  // 获取当前文档流的 scrollTop
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // 定义当前所在的目录下标
  let navIndex = 0
  // 比较当前文章滚动的距离scrollTop与各锚点标题的offsetTop ,当scrollTop超过当前元素的scrollTop,则定位到当前标题
  for (let n = 0; n < offsetTopList.length; n++) {
    if (scrollTop >= offsetTopList[n]) {
      navIndex = n
    }
  }
  //当前高亮的目录索引,默认为0
  active.value = navIndex
}

</script>
<template>
  <div class=" w-full mx-auto mt-20 mb-20 font-sans ">
    <!-- 第一层div占屏幕宽度的80% -->
    <div class="w-full ">
      <!-- 第二层4个div每行一个div -->
      <div class="flex flex-col">
        <div class="w-full ">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <!-- 第一行 第一列 -->
            <div class="" style="width:15%">

            </div>
            <!-- 第一行 第二列 -->
            <div class="" style="width:15%">
              <div v-if="menus && menus.length > 0 && content" class="border border-base-300" :class="{
                'bg-base-300': colorMode.value === 'dark',
                'bg-base-100': colorMode.value === 'light',
              }">
                <ul class="bg-base-100 p-2 rounded ">
                  <li v-if="content" v-for="(item, index) in menus" class="mb-4">
                    <h4 class="text-2xl mb-2 border-b border-base-300 pb-2">
                      {{ item.subset }}
                    </h4>
                    <ul>
                      <li v-for="tblContent in item.tblContents" :key="tblContent.ID" class="mb-2">
                        <NuxtLink target="_self"
                          :to="localePath({ name: 'maintance', query: { id: tblContent.ID, type: type } })" class=" ml-4">
                          {{ tblContent.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

            </div>
            <!-- 第一行 第三列 -->
            <div class="bg-base-100 pl-4 pr-4 pb-2" style="width:40%">
              <div v-if="content" class="border rounded border-base-300" :class="{
                'bg-base-300': colorMode.value === 'dark',
                'bg-base-100': colorMode.value === 'light',
              }">
                <!--文章标题 -->
                <NuxtLink :to="url">
                  <h1 v-if="content" class="text-3xl font-bold text-center mt-4">{{ content.title }}</h1>
                </NuxtLink>
                <!--文章发布时间 浏览量 文章类别 -->
                <div v-if="content" class="overflow-x-auto">
                  <hr class="mt-4 mb-4 ml-2 mr-2" />
                  <div class="container mx-auto pl-2 pr-2">
                    <ul class="flex flex-wrap">
                      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3">
                        <!-- 列1的内容 -->
                        <div class="flex items-center">
                          <Icon name="ic:baseline-event-available" size="20" color="black" /><span
                            class="ml-1 font-thin">发布时间:{{
                              utils.dataFliter(content.createTime) }}</span>
                        </div>
                      </li>
                      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
                        <!-- 列2的内容 -->
                        <div class="flex items-center ">
                          <Icon name="ic:baseline-preview" size="20" color="black" /><span class="ml-1 font-thin">阅读次数:{{
                            content.viewNum }}</span>
                        </div>
                      </li>
                      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
                        <!-- 列3的内容 -->
                        <div class="flex items-center">
                          <Icon name="ic:baseline-article" size="20" color="black" /><span class="ml-1 font-thin">文章类别:{{
                            content.type }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <hr class="mt-4 mb-4 mr-2 ml-2" />
                </div>
                <!--文章内容 -->
                <div v-if="content" class="editor-content-view" v-html="content.content">
                </div>
                <hr v-if="content" class="mt-4 mb-4 ml-2 mr-2" />
                <!--文章作者 文章链接 版权声明 -->
                <div v-if="content" class="h-32 card  rounded-box border border-base-200 space-y-2 p-6 ml-2 mr-2 mb-4"
                  :class="{
                    'bg-base-300': colorMode.value === 'dark',
                    'bg-base-100': colorMode.value === 'light',
                  }">
                  <p>
                    <Icon name="ep:user" size="20" class="mr-2" />文章作者: {{ userName }}
                  </p>
                  <p>
                    <Icon name="ic:baseline-link" size="20" class="mr-2" />文章链接:
                    <NuxtLink :to="url">{{ url }}</NuxtLink>
                  </p>
                  <p>
                    <Icon name="ic:baseline-copyright" size="20" class="mr-2" />版权声明:
                    本博客所有文章除特別声明外，均采用
                    CC BY 4.0 许可协议。转载请注明来源 {{ userName }} !
                  </p>
                </div>

                <!--文章标签 -->
                <div class="ml-2 mr-2">
                  <div v-if="content" v-for="(item, index) in content.tagsView " :key="index"
                    class="badge badge-primary badge-lg badge-outline mr-4 mt-4 ">
                    {{ item }}
                  </div>
                </div>

                <!--文章翻页 -->
                <div class="grid gap-8 sm:grid-cols-2 mt-4 mb-4 ml-2 mr-2">
                  <NuxtLink v-if="back && back.ID > 0" target="_self"
                    :to="localePath({ name: 'maintance', query: { id: back.ID } })"
                    class="p-4 border border-base-300  rounded-md transition-all hover:shadow-md">
                    <div class="flex items-center justify-start mb-2">
                      <Icon name="ic:baseline-arrow-back" size="30" color="black" />
                    </div>
                    <h2 class="font-medium line-clamp-2 text-left text-lg mb-1" title="back.title">{{ back.title }}</h2>
                    <p class="text-sm text-left line-clamp-2" title="back.summary">{{ back.summary }}</p>
                  </NuxtLink>
                  <NuxtLink v-if="after && after.ID > 0" target="_self"
                    :to="localePath({ name: 'maintance', query: { id: after.ID } })"
                    class="p-4 border  border-base-300  rounded-md transition-all hover:shadow-md">
                    <div class="flex items-center justify-end mb-2">
                      <Icon name="ic:baseline-arrow-forward" size="30" color="black" />
                    </div>
                    <h2 class="font-bold line-clamp-2 text-lg mb-1 text-right " title="after.title">{{ after.title }}</h2>
                    <p class="text-sm line-clamp-2 text-right" title="after.summary">{{ after.summary }}</p>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- 第一行 第四列 -->

            <div class="" style="width:15%">
              <div class="" :class="{
                'bg-base-300': colorMode.value === 'dark',
                'bg-base-100': colorMode.value === 'light',
              }">
                <!-- 锚点目录 -->
                <div v-if="docMenu.length > 0" class="docs-aside rounded ">
                  <span class="aside-title">目录</span>
                  <div class="aside-body w-full">
                    <ul class="aside-article-catalog">
                      <li v-for="(item, index) in docMenu" :key="item.id" :class="`level_${item.level}`">
                        <a :href="'#' + item.id" :class="{ active: active === index }"
                          @click="handlerSroll($event, item.id, index)">{{ item.text }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- 关于作者-->
              <div class="max-w-md mx-auto  rounded-md shadow-md text-center mt-4" :class="{
                'bg-base-300': colorMode.value === 'dark',
                'bg-base-100': colorMode.value === 'light',
              }">
                <img src="/images/logo.png" alt="一码界" class="w-36 pt-4 mb-1 mx-auto">
                <p class=" mb-4 mx-auto">
                  一码一世界，一叶一菩提。<br />专注研发、专注产品、专注安全。
                </p>
                <!-- 微信公众号 -->
                <img src="/images/wechat.jpg" alt="一码界微信公众号" class=" w-36 h-36 mx-auto">
                <p class=" mb-4 mx-auto">扫码关注微信公众号</p>


                <!-- 抖音 -->
                <div class="flex items-center mt-2">
                  <a href="https://www.douyin.com/user/MS4wLjABAAAA3TqFX9l-CLJJcIIRiYdfrEgUO94bKXrcWWmK29TCVTMubnc1P14lVQmocpQlgLrT?vid=7055900114459708709"
                    target="_blank" class="mx-auto"> <img src="/images/douyin.png" alt="关注一码界抖音"
                      class="w-36 h-36 mx-auto"><br />点击关注抖音</a>
                </div>
                <!-- 哔哩哔哩 -->
                <div class="flex items-center mt-2">
                  <a href="https://space.bilibili.com/364684263?spm_id_from=333.1007.0.0" target="_blank"
                    class=" mx-auto"><img src="/images/bilibli.jpg" alt="关注一码界哔哩哔哩"
                      class="w-36 h-36  mx-auto">点击关注哔哩哔哩</a>
                </div>
                <!-- YouTube -->
                <div class="flex items-center mt-2">
                  <a href="https://www.youtube.com/channel/UCX2H1KciWcAW23FHJGGpMZA" target="_blank"
                    class=" mx-auto mb-4"><img src="/images/youtube.png" alt="订阅一码界Youtube"
                      class="w-36 h-36 mx-auto">点击关注youtube</a>
                </div>
              </div>
            </div>
            <!-- 第一行 第五列 -->
            <div class="" style="width:15%">

            </div>
          </div>
        </div>

        <!--第二行 -->
        <div class="w-full ">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <!--第二行 第一列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第二行 第二列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第二行 第三列 -->
            <div class="" style="width:40%">
              <div class="flex flex-wrap justify-center gap-x-8 gap-y-8 mb-10">
                <!--猜你喜欢 -->
                <div v-for="(item) in list">
                  <div class="card card-compact bg-base-100 shadow-lg top-5 border border-base-300"
                    style="height: 22rem; width:19rem" :class="{
                      'bg-base-300': colorMode.value === 'dark',
                      'bg-base-100': colorMode.value === 'light',
                    }">
                    <div class="mx-auto">
                      <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><img
                          :src="baseUrl + '/' + item.img" class="aspect-video w-full object-cover rounded"
                          :alt="item.title" />
                      </NuxtLink>
                    </div>
                    <div class="mt-2 ml-2">
                      <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })">
                        <h3 class="font-bold" :title="item.title">
                          {{ item.title }}
                        </h3>
                      </NuxtLink>
                    </div>
                    <div class="ml-2 h-20 mb-2">
                      <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><span
                          class="line-clamp-2" :title="item.summary">{{ item.summary }}
                        </span></NuxtLink>
                    </div>
                    <div class="flex items-center mb-2 ml-2 ">
                      <div class="flex items-center ">
                        <Icon name="ic:baseline-event-available" class="font-thin" color="black" />
                        <span class="ml-1 font-thin">{{ utils.dataFliter(item.createTime) }}</span>
                      </div>

                      <div class="flex items-center flex-grow">
                        <Icon name="ic:baseline-preview" class="font-thin ml-4" color="black" />
                        <span class="ml-1 font-thin">{{ item.viewNum }}</span>
                      </div>

                      <div class="flex items-center ml-auto mr-2">
                        <Icon name="ic:baseline-article" class="font-thin" color="black" />
                        <span class="ml-1 font-thin">{{ item.type }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--第二行 第四列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第二行 第五列 -->
            <div class=" " style="width:15%">

            </div>
          </div>
        </div>


        <!--第三行-->
        <div class="w-full ">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <!--第三行 第一列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第三行 第二列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第三行 第三列 -->
            <div class=" " style="width:40%">

            </div>
            <!--第三行 第四列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第三行 第五列 -->
            <div class=" " style="width:15%">

            </div>
          </div>
        </div>

        <!--第四行-->
        <div class="w-full ">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <!--第四行 第一列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第四行 第二列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第四行 第三列 -->
            <div class=" " style="width:40%">

            </div>
            <!--第四行 第四列 -->
            <div class=" " style="width:15%">

            </div>
            <!--第四行 第五列 -->
            <div class=" " style="width:15%">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 左边侧边栏样式 */
/* 标题样式 */
.docs-aside {
  padding: 16px;
}

.aside-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.aside-body {
  margin-top: 8px;
}

.aside-article-catalog {
  list-style: none;
  padding: 0;
}

.aside-article-catalog li {
  margin-bottom: 8px;
}

.aside-article-catalog a {
  text-decoration: none;
  display: block;
  padding: 4px 0;
  transition: color 0.3s;
}

.aside-article-catalog a:hover {
  color: #333;
  /* 设置悬停时的字体颜色 */
}

.aside-article-catalog a.active {
  font-weight: bold;
}

/* 不同标题级别的样式 */
.level_1 {
  font-size: 14px;
  font-weight: bold;
}

.level_2 {
  font-size: 13px;
  font-weight: bold;
  margin-left: 10px;
  /* 通过缩进表示不同级别 */
}

.level_3 {
  font-size: 12px;
  font-weight: bold;
  margin-left: 20px;
}

.level_4 {
  font-size: 12px;
  font-weight: bold;
  margin-left: 30px;
}

.level_5 {
  font-size: 12px;
  font-weight: bold;
  margin-left: 40px;
}

.level_6 {
  font-size: 12px;
  font-weight: bold;
  margin-left: 50px;
}



/* 博客内容样式 */
.editor-content-view {
  overflow-x: auto;
  padding: 1rem;
}

.editor-content-view p,
.editor-content-view li {
  white-space: pre-wrap;
  /* 保留空格 */
}

.editor-content-view h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  /* 保留空格 */
}

.editor-content-view h1 {
  font-size: 18px;
  /* 保留空格 */
}

.editor-content-view h2 {
  font-size: 17px;
  /* 保留空格 */
}

.editor-content-view h3 {
  font-size: 16px;
  /* 保留空格 */
}

.editor-content-view h4 {
  font-size: 15px;
  /* 保留空格 */
}

.editor-content-view h5 {
  font-size: 14px;
  /* 保留空格 */
}

.editor-content-view h6 {
  font-size: 13px;
  /* 保留空格 */
}

.editor-content-view blockquote {
  border-left: 8px solid #d0e5f2;
  padding: 10px 10px;
  margin: 10px 0;
  background-color: #f1f1f1;
}

.editor-content-view code {
  padding: 3px;
  border-radius: 3px;
}

.editor-content-view pre>code {
  display: block;
  padding: 10px;
}

.editor-content-view table {
  border-collapse: collapse;
}

.editor-content-view td,
.editor-content-view th {
  border: 1px solid #ccc;
  min-width: 50px;
  height: 20px;
}

.editor-content-view th {
  background-color: #eee;
}


.editor-content-view ol {
  padding-left: 20px;
}

.editor-content-view ul {
  padding-left: 20px;
}

.editor-content-view ul>li {
  list-style-type: disc;
}

.editor-content-view ol>li {
  list-style-type: decimal;
}

.editor-content-view input[type="checkbox"] {
  margin-right: 5px;
}

.code-toolbar>.toolbar>.toolbar-item {
  margin-right: 10px;
  color: white;
}
</style>

