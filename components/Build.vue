<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-09 21:56:16
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
let pageSize = 10
let page = 1
let total = 0;
let type = "技术"
let list = ref([]);
// 获取文章id
if (route.query.id) {
  id = route.query.id
  type = route.query.type
}

// 猜你喜欢
const getList = async (page, type) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  if (total > 0 && page > total / pageSize) {
    page = total / pageSize;
  }
  if (page < 1) {
    page = 1;
  }
  let { data: count } = await useFetch(baseUrl + '/base/getTblContentList?page=' + page + '&pageSize=' + pageSize + '&type=' + type)
  list.value = count.value.data.list;
  total = count.value.data.total;
}
getList(page, type);
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

onMounted(async () => {
  await nextTick()
  setView(id);
  colorMode.value = useColorMode();
  Prism.highlightAll();
  // 获取文章地址
  url = window.location.href;
  window.addEventListener('scroll', onScroll)
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
    <div class="w-full bg-gray-300">
      <!-- 第二层4个div每行一个div -->
      <div class="flex flex-col">
        <div class="w-full bg-yellow-300">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <div class=" bg-red-300" style="width:15%">
              1
            </div>
            <div class=" bg-green-300" style="width:15%">
              <ul class="menu bg-base-200">
                <li v-if="content" v-for="item in menus">
                  <h2 class="menu-title">{{ item.subset }}</h2>
                  <ul v-for="tblContent in item.tblContents">
                    <li>
                      <NuxtLink target="_self" :to="localePath({ name: 'maintance', query: { id: tblContent.ID } })">{{
                        tblContent.title }}</NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class=" bg-base-100 pl-4 pr-4 pb-2" style="width:40%">

              <NuxtLink :to="url">
                <img v-if="content" :src="baseUrl + '/' + content.img" class="aspect-video w-full object-cover rounded"
                  :alt="content.title" />
                <h1 v-if="content" class="text-3xl font-bold text-center mt-4">{{ content.title }}</h1>
              </NuxtLink>
              <div v-if="content" class="overflow-x-auto">
                <hr class="mt-4 mb-4 " />
                <div class="container mx-auto">
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
                <hr class="mt-4 mb-4 " />
              </div>
              <div v-if="content" class="editor-content-view" v-html="content.content">
              </div>
              <hr v-if="content" class="mt-4 mb-4" />
              <div v-if="content" class="h-32 card bg-base-200 rounded-box  space-y-2 p-6">
                <p>
                  <Icon name="ep:user" size="20" color="bg-base-200" class="mr-2" />文章作者: {{ userName }}
                </p>
                <p>
                  <Icon name="ic:baseline-link" size="20" color="bg-base-200" class="mr-2" />文章链接:
                  <NuxtLink :to="url">{{ url }}</NuxtLink>
                </p>
                <p>
                  <Icon name="ic:baseline-copyright" size="20" color="bg-base-200" class="mr-2" />版权声明: 本博客所有文章除特別声明外，均采用
                  CC BY 4.0 许可协议。转载请注明来源 {{ userName }} !
                </p>
              </div>
              <div v-if="content" v-for="(item, index) in content.tagsView " :key="index"
                class="badge badge-primary badge-md badge-outline mr-4 mt-4">
                {{ item }}
              </div>
              <div class="grid gap-8 sm:grid-cols-2 mt-2">
                <NuxtLink v-if="back && back.ID > 0" target="_self"
                  :to="localePath({ name: 'maintance', query: { id: back.ID } })">
                  <div>
                    <Icon name="ic:baseline-arrow-back" size="30" color="black" />
                  </div>
                  <p class="font-medium text-[15px] mb-1">{{ back.title }}</p>
                  <p class="text-sm font-normalline-clamp-2">{{ back.summary }}</p>
                </NuxtLink>
                <NuxtLink v-if="after && after.ID > 0" target="_self"
                  :to="localePath({ name: 'maintance', query: { id: after.ID } })">
                  <div>
                    <Icon name="ic:baseline-arrow-forward" size="30" color="black" />
                  </div>
                  <p class="font-medium text-[15px] mb-1">{{ after.title }}</p>
                  <p class="text-sm font-normal line-clamp-2">{{ after.summary }}</p>
                </NuxtLink>

              </div>
            </div>
            <div class=" bg-purple-300" style="width:15%">
              <div v-if="docMenu.length > 0" class="docs-aside">
                <span class="aside-title">目录</span>
                <div class="aside-body">
                  <ul class="aside-article-catalog">
                    <li v-for="(item, index) in docMenu" :key="item.id" :class="`level_${item.level}`">
                      <a :href="'#' + item.id" :class="{ active: active === index }"
                        @click="handlerSroll($event, item.id, index)">{{ item.text }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class=" bg-pink-300" style="width:15%">
              5
            </div>
          </div>
        </div>

        <div class="w-full bg-purple-500">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <div class=" bg-red-500" style="width:15%">
              1
            </div>
            <div class=" bg-green-500" style="width:15%">
              2
            </div>
            <div class=" bg-blue-500" style="width:40%">
              3
            </div>
            <div class=" bg-purple-500" style="width:15%">
              4
            </div>
            <div class=" bg-pink-500" style="width:15%">
              5
            </div>
          </div>
        </div>

        <div class="w-full bg-green-700">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <div class=" bg-red-700" style="width:15%">
              1
            </div>
            <div class=" bg-green-700" style="width:15%">
              2
            </div>
            <div class=" bg-blue-700" style="width:40%">
              <div class="flex flex-wrap justify-center gap-x-8 gap-y-8">
      <div v-for="(item) in list">
        <div class="card card-compact bg-base-100 shadow-lg top-5 border border-base-300"
          style="height: 24rem; width:26rem" :class="{
            'bg-base-300': colorMode.value === 'dark',
            'bg-base-100': colorMode.value === 'light',
          }">
          <div class="mx-auto">
            <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><img
                :src="baseUrl + '/' + item.img" class="aspect-video w-full object-cover rounded" :alt="item.title" />
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
            <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><span class="line-clamp-2"
                :title="item.summary">{{ item.summary }}
              </span></NuxtLink>
          </div>
          <div class="flex items-center mb-2 ml-2 ">
            <!-- 列1的内容 -->
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
            <div class=" bg-purple-700" style="width:15%">
              4
            </div>
            <div class=" bg-pink-700" style="width:15%">
              5
            </div>
          </div>
        </div>

        <div class="w-full bg-blue-500">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex">
            <div class=" bg-red-500" style="width:15%">
              1
            </div>
            <div class=" bg-green-500" style="width:15%">
              2
            </div>
            <div class=" bg-blue-500" style="width:40%">
              3
            </div>
            <div class=" bg-purple-500" style="width:15%">
              4
            </div>
            <div class=" bg-pink-500" style="width:15%">
              5
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scss>
/* 左边侧边栏样式 */
.docs-aside {
  display: flex;
  flex-direction: column;
  bottom: 0;
  z-index: 100;
  width: 165px;
}

.docs-aside .aside-title {
  border-bottom: 1px solid #d5dbe7;
  font-size: 12px;
  color: #999999;
  line-height: 20px;
  padding: 10px 0;
}

.docs-aside .aside-body {
  flex: 1 1 100%;
  padding: 10px 0;
  overflow-y: auto;
}

.docs-aside .aside-article-catalog {
  list-style: none;
  padding: 0;
  margin: 0;
}

.docs-aside .aside-article-catalog>li>a {
  display: block;
  font-size: 14px;
  line-height: 20px;
  padding: 5px 0;
  color: #818991;
}

.docs-aside .aside-article-catalog>li>a:hover,
.docs-aside .aside-article-catalog>li>a.active {
  color: #1672FA;
}


/* 博客内容样式 */
.editor-content-view {
  overflow-x: auto;
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

