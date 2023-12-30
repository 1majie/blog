<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-31 06:58:52
 * @FilePath: \blog_before_vue3_nuxt\components\Build.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import utils from '~/utils/util';
import Prism from 'prismjs'
import { ref, nextTick } from 'vue';
//支持markdown
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
let scrollElement = ref();
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
let type = "";
let list = ref([]);
let isOpen = ref(false);
let isPayOpen = ref(false);
let loadingStatus = true;
let payEnable = import.meta.env.VITE_PAY_ENABLE
let personEnable = import.meta.env.VITE_PERSONAL_ENABLE
let mdTheme = 'light'
// 获取文章id
if (route.query.id) {
  id = route.query.id
  type = route.query.type
}

// 推荐博文
const getList = async () => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: count } = await useFetch(baseUrl + '/base/getTblContentList?page=1&pageSize=9&type=' + type)
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
  await getUserName(count.value.data.retblContent.authorId);

  //根据文章内容动态设置 seo 标签内容
  useHead({
    title: `${content.value.title}` + "_" + `${content.value.type}` + "_",
    meta: [
      { property: 'og:title', content: `${content.value.title}` },
      { name: "keywords", content: `${content.value.tagsView}` },
      { name: "description", content: `${content.value.summary}` },
      { name: "author", content: `${userName.value}` }
    ]
  })
  loadingStatus = false
}

// 获取用户名称
const getUserName = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: username } = await useFetch(baseUrl + '/base/GetUserName?id=' + id)
  userName.value = username.value.data.userName;
}


getList();
onMounted(async () => {
  await nextTick()
  getTblContent(id);
  setView(id);
  colorMode.value = useColorMode();
  if (colorMode.value == 'light') {
    mdTheme = 'light'
  }
  if (colorMode.value == 'dark') {
    mdTheme = 'dark'
  }
  Prism.highlightAll();
  // 获取文章地址
  url = window.location.href;
  window.addEventListener('scroll', onScroll)
  getList();
  window.scrollTo({
    top: 10,
    behavior: 'smooth' // 如果要平滑滚动，请添加这个选项
  });

})
onUpdated(() => {
  // 代码高亮
  if (content.value.editType != "md") {
    Prism.highlightAll(); //修改内容后重新渲染
  }
  initArt()
});


onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  scrollElement.value = document.documentElement;
});
// 修改代码复制文字为中文
useHead({
  bodyAttrs: {
    "data-prismjs-copy": "复制",
    "data-prismjs-copy-error": "复制出错",
    "data-prismjs-copy-success": "已复制"
  },
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
    let articleDom = document.querySelector('.editor-content-view')
    if (articleDom === undefined || articleDom === null) {
      articleDom = document.querySelector('.md-editor-preview')
    }

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
  // let element = document.querySelector(`.page-header`);
  let element = document.querySelector('.editor-content-view')
  if (element === undefined || element === null) {
    element = document.querySelector('.md-editor-preview')
  }
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
      window.scrollTo(0, -element.offsetHeight)
    }, 100)
    return
  }
  window.scrollTo(0, -element.offsetHeight)
}

// 滚动事件
const onScroll = () => {
  // const element = document.querySelector(`.page-header`);
  let element = document.querySelector('.editor-content-view')
  if (element === undefined || element === null) {
    element = document.querySelector('.md-editor-preview')
  }
  // 获取所有锚点元素md-editor-preview
  let titleNavList = document.querySelectorAll('.article h1,.article h2,.article h3,.article h4,.article h5,.article h6')

  if (titleNavList.length == 0) {
    titleNavList = document.querySelectorAll('.md-editor-preview h1,.md-editor-preview h2,.md-editor-preview h3,.md-editor-preview h4,.md-editor-preview h5,.md-editor-preview h6')
  }
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
  <div v-if="!content && loadingStatus" class="w-full mx-auto pt-20 h-screen flex items-center justify-center">
    <span class="loading loading-spinner text-info loading-lg"></span>
  </div>

  <div v-if="content" class="w-full mx-auto">
    <!-- 第一层div占屏幕宽度的80% -->
    <div class="w-full pt-4 mb-20">
      <!-- 第二层4个div每行一个div -->
      <div class="flex flex-col">
        <div class="w-full">
          <!-- 第三层：5个div，每个div占一列宽度为10% 10% 60% 10% 10% -->
          <div class="flex flex-wrap">
            <!-- 第一行 第一列 -->
            <div class="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">
              <!-- 未更改的部分 -->
            </div>
            <!-- 第一行 第二列 -->
            <div class="w-full sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6 hidden md:block">
              <div v-if="menus && menus.length > 0 && content" class="">
                <ul class="bg-base-100 p-4 rounded-md shadow-lg" :class="{
                  'bg-black text-white': colorMode.value === 'dark',
                  'bg-white': colorMode.value === 'light',
                }">
                  <li v-if="content" v-for="(item, index) in menus" class="mb-4">
                    <h4 class="mb-2 border-b border-base-300 pb-2">
                      {{ item.subset }}
                    </h4>
                    <ul>
                      <li v-for="tblContent in item.tblContents" :key="tblContent.ID" class="mb-2">
                        <NuxtLink target="_self"
                          :to="localePath({ name: 'maintance', query: { id: tblContent.ID, type: type } })"
                          class="text-sm hover:text-blue-500 ">
                          {{ tblContent.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 第一行 第三列 -->
            <div class="w-full sm:w-3/6 md:w-3/6 lg:w-3/6 xl:w-3/6  pl-4 pr-4 pb-2">
              <div v-if="content" class="rounded-md shadow-lg p-0 md:p-8" :class="{
                'bg-black text-white': colorMode.value === 'dark',
                'bg-white': colorMode.value === 'light',
              }">
                <!-- 文章标题 -->
                <NuxtLink :to="url">
                  <h1 v-if="content" class="text-3xl font-bold text-center mt-4">{{ content.title }}</h1>
                </NuxtLink>
                <!-- 文章发布时间 浏览量 文章类别 -->
                <div v-if="content" class="overflow-x-auto">
                  <hr class="mt-4 mb-4 ml-2 mr-2" />
                  <div class="container mx-auto pl-2 pr-2">
                    <ul class="flex flex-wrap">
                      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3">
                        <div class="flex items-center">
                          <Icon name="ic:baseline-event-available" size="20" color="black" /><span
                            class="ml-1 font-thin">发布时间:{{ utils.dataFliter(content.createTime) }}</span>
                        </div>
                      </li>
                      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
                        <div class="flex items-center ">
                          <Icon name="ic:baseline-preview" size="20" color="black" /><span class="ml-1 font-thin">阅读次数:{{
                            content.viewNum }}</span>
                        </div>
                      </li>
                      <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
                        <div class="flex items-center">
                          <Icon name="ic:baseline-article" size="20" color="black" /><span class="ml-1 font-thin">文章类别:{{
                            content.type }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <hr class="mt-4 mb-4 mr-2 ml-2" />
                </div>

                <!-- 文章内容 -->
                <div v-if="content && content.editType === 'md'">
                  <MdPreview v-if="content" :modelValue="content.content" :theme="mdTheme" />
                  <MdCatalog :scrollElement="scrollElement" />
                </div>
                <div v-if="content && content.editType === 'basic'">
                  <div class="editor-content-view" v-html="content.content">
                  </div>
                </div>
                <div v-if="content && payEnable == 'true'" class="flex justify-center items-center mt-4">
                  <button @click="isPayOpen = true"
                    class="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                    赞赏
                  </button>
                  <div v-show="isPayOpen" @click.away="isPayOpen = false"
                    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <img src="/images/alipay.jpg" alt="支付宝支付" class="object-contain" style="width: 35rem;height: 35rem;">
                    <img src="/images/weipay.jpg" alt="微信支付" class="object-contain" style="width: 35rem;height: 35rem;">
                  </div>
                </div>
                <hr v-if="content" class="mt-4 mb-4 ml-2 mr-2" />
                <!-- 文章作者 文章链接 版权声明 -->
                <div v-if="content" class=" card  rounded-box border border-base-200 space-y-2 p-6 ml-2 mr-2 mb-4" :class="{
                  'bg-black text-white': colorMode.value === 'dark',
                  'bg-white': colorMode.value === 'light',
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
                    本博客所有文章除特別声明外，均采用 CC BY 4.0 许可协议。转载请注明来源 {{ userName }} !
                  </p>
                </div>
                <!-- 文章标签 -->
                <div class="ml-2 mr-2">
                  <div v-if="content" v-for="(item, index) in content.tagsView " :key="index"
                    class="badge text-blue-500 badge-lg badge-outline mr-4 mt-4">
                    {{ item }}
                  </div>
                </div>

                <!-- 文章翻页 -->
                <div class="grid gap-8 sm:grid-cols-2 mt-4 mb-4 ml-2 mr-2">
                  <NuxtLink v-if="back && back.ID > 0" target="_self"
                    :to="localePath({ name: 'maintance', query: { id: back.ID } })"
                    class="p-8 border   rounded-md transition-all hover:text-blue-500" :class="{
                      'border-base-100': colorMode.value === 'dark',
                      'border-base-300': colorMode.value === 'light',
                    }">
                    <div class="flex items-center justify-start mb-2">
                      <Icon name="ic:baseline-arrow-back" size="30" class="hover:text-blue-500" />
                    </div>
                    <h2 class="font-medium line-clamp-2 text-left text-lg mb-1" title="back.title">
                      {{ back.title }}</h2>
                    <p class="text-sm text-left line-clamp-2" title="back.summary">{{ back.summary }}</p>
                  </NuxtLink>
                  <NuxtLink v-if="after && after.ID > 0" target="_self"
                    :to="localePath({ name: 'maintance', query: { id: after.ID } })"
                    class="p-8 border   rounded-md transition-all hover:text-blue-500" :class="{
                      'border-base-100': colorMode.value === 'dark',
                      'border-base-300': colorMode.value === 'light',
                    }">
                    <div class="flex items-center justify-end mb-2">
                      <Icon name="ic:baseline-arrow-forward" size="30" class="hover:text-blue-500" />
                    </div>
                    <h2 class="font-bold line-clamp-2 text-lg mb-1 text-right " title="after.title">
                      {{ after.title }}</h2>
                    <p class="text-sm line-clamp-2 text-right" title="after.summary">{{ after.summary }}</p>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- 第一行 第四列 -->
            <div class="w-full sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6 hidden md:block">
              <div class="" :class="{
                'bg-black text-white': colorMode.value === 'dark',
                'bg-white': colorMode.value === 'light',
              }">
                <div v-if="docMenu.length > 0" class="rounded-md shadow-lg p-4" :class="{
                  'border-base-100': colorMode.value === 'dark',
                  'border-base-300': colorMode.value === 'light',
                }">
                  <!-- 锚点目录 -->
                  <div class="docs-aside rounded ">
                    <span class="aside-title">目录</span>
                    <hr>
                    <div class="aside-body w-full">
                      <ul class="aside-article-catalog">
                        <li v-for="(item, index) in docMenu" :key="item.id" :class="`level_${item.level}`">
                          <a :href="'#' + item.id" :class="{ active: active === index }">{{ item.text }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 关于作者-->
              <div v-if="content && personEnable == 'true'" class="max-w-md mx-auto  rounded-md shadow-md text-center p-8"
                :class="{
                  'bg-black text-white': colorMode.value === 'dark',
                  'bg-white': colorMode.value === 'light',
                  'mt-4': docMenu.length > 0,
                }">
                <img :src="colorMode.value === 'dark' ? '/images/logo-white.png' : '/images/logo.png'" alt="一码界"
                  class=" h-20 w-20 mb-2 mx-auto">
                <p class="mt-2 mb-2 mx-auto">
                  一码一世界，一叶一菩提。
                </p>
                <div class="grid grid-cols-2 mt-4">
                  <div class="flex items-center">
                    <!-- 微信公众号 -->
                    <a @click="isOpen = true" class="mx-auto" href="#" title="关注微信公众号">
                      <svg class=" w-14 h-14 mx-auto" title="关注微信公众号" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 111.36600000000001 90">
                        <linearGradient id="a" x1="50.056%" x2="50.056%" y1="94.15%" y2=".437%">
                          <stop offset="0" stop-color="#05cd66" />
                          <stop offset="1" stop-color="#61f380" />
                          <stop offset="1" stop-color="#9eee69" />
                        </linearGradient>
                        <linearGradient id="b" x1="50.089%" x2="50.089%" y1="93.535%" y2="-.036%">
                          <stop offset="0" stop-color="#e4e6e6" />
                          <stop offset="1" stop-color="#f0f0f0" />
                        </linearGradient>
                        <g fill="none" fill-rule="evenodd">
                          <path
                            d="M0 33.466c0 10.04 5.474 19.213 13.933 25.286.746.496 1.12 1.24 1.12 2.231 0 .248-.125.62-.125.868-.622 2.479-1.742 6.57-1.866 6.693-.124.372-.249.62-.249.992 0 .744.622 1.363 1.369 1.363.248 0 .497-.124.746-.248l8.832-5.082c.622-.371 1.369-.62 2.115-.62.374 0 .871 0 1.244.125 4.106 1.24 8.584 1.859 13.187 1.859 22.267 0 40.306-14.998 40.306-33.467S62.573 0 40.306 0C18.038 0 0 14.998 0 33.466"
                            fill="url(#a)" />
                          <path
                            d="M77.86 86.628c3.847 0 7.57-.5 10.92-1.498.249-.125.621-.125.993-.125.62 0 1.241.25 1.738.5l7.322 4.245c.248.125.372.25.62.25.62 0 1.117-.5 1.117-1.124 0-.25-.124-.5-.124-.874 0-.125-.993-3.497-1.49-5.62-.123-.25-.123-.5-.123-.749 0-.75.372-1.374.993-1.873 7.073-5.12 11.54-12.738 11.54-21.23 0-15.485-15.015-28.098-33.506-28.098S44.353 42.92 44.353 58.53c0 15.485 15.016 28.098 33.507 28.098z"
                            fill="url(#b)" />
                          <path
                            d="M32.05 22.662c0 2.891-2.288 5.18-5.18 5.18s-5.18-2.289-5.18-5.18 2.29-5.18 5.18-5.18 5.18 2.289 5.18 5.18M58.92 22.662c0 2.891-2.288 5.18-5.179 5.18s-5.18-2.289-5.18-5.18 2.289-5.18 5.18-5.18 5.18 2.289 5.18 5.18"
                            fill="#168743" />
                          <g fill="#919191">
                            <path
                              d="M84.82 49.856c0 2.518 2.015 4.532 4.533 4.532s4.532-2.014 4.532-4.532-2.014-4.532-4.532-4.532-4.533 2.014-4.533 4.532M62.482 49.856c0 2.518 2.014 4.532 4.532 4.532s4.533-2.014 4.533-4.532-2.015-4.532-4.533-4.532-4.532 2.014-4.532 4.532" />
                          </g>
                        </g>
                      </svg>
                    </a>

                    <!-- 微信公众号图片模态框 -->
                    <div v-show="isOpen" @click.away="isOpen = false"
                      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <img src="/images/wechat.jpg" alt="Modal Image" class="max-w-full max-h-full">
                    </div>
                  </div>

                  <!-- 抖音 -->
                  <div class="flex items-center">
                    <a href="https://www.douyin.com/user/MS4wLjABAAAA3TqFX9l-CLJJcIIRiYdfrEgUO94bKXrcWWmK29TCVTMubnc1P14lVQmocpQlgLrT?vid=7055900114459708709"
                      target="_blank" class="mx-auto" title="关注抖音">
                      <svg class="w-14 h-14 mx-auto" title="关注抖音"
                        viewBox="-58.35000000000002 -186.70564362582354 2548.289756960746 2538.849821747569"
                        xmlns="http://www.w3.org/2000/svg">
                        <g fill="#25f4ee">
                          <path
                            d="M779.38 890.55v-88.12a650.81 650.81 0 0 0-92.45-7.94c-299.8-.64-565.22 193.64-655.25 479.6S47.92 1871.34 294 2042.56a684.7 684.7 0 0 1 485.36-1152z" />
                          <path
                            d="M796 1888.72c167.62-.23 305.4-132.28 312.74-299.74V94.62h273A512.17 512.17 0 0 1 1373.8 0h-373.41v1492.92c-6.21 168.31-144.32 301.63-312.74 301.9a317.76 317.76 0 0 1-144.45-36.11A313.48 313.48 0 0 0 796 1888.72zM1891.66 601.64v-83.06a509.85 509.85 0 0 1-282.4-85.22 517.79 517.79 0 0 0 282.4 168.28z" />
                        </g>
                        <path
                          d="M1609.26 433.36a514.19 514.19 0 0 1-127.84-339.47h-99.68a517.16 517.16 0 0 0 227.52 339.47zM686.93 1167.9a313.46 313.46 0 0 0-144.46 590.81A312.75 312.75 0 0 1 796 1262.51a329.69 329.69 0 0 1 92.44 14.49V897.05a654.77 654.77 0 0 0-92.44-7.22h-16.62v288.9a321.13 321.13 0 0 0-92.45-10.83z"
                          fill="#fe2c55" />
                        <path
                          d="M1891.66 601.64v288.91a886.23 886.23 0 0 1-517.86-168.29v759.1c-.8 378.78-308.09 685.43-686.87 685.43A679.65 679.65 0 0 1 294 2042.56 685.43 685.43 0 0 0 1481.42 1576V819.05A887.71 887.71 0 0 0 2000 985.17v-372a529.59 529.59 0 0 1-108.34-11.53z"
                          fill="#fe2c55" />
                        <path
                          d="M1373.8 1481.36v-759.1a886.11 886.11 0 0 0 518.58 166.12v-288.9a517.87 517.87 0 0 1-283.12-166.12 517.16 517.16 0 0 1-227.52-339.47h-273V1589a313.46 313.46 0 0 1-567 171.17 313.46 313.46 0 0 1 144.46-590.83 321.35 321.35 0 0 1 92.45 14.45V894.88A684.71 684.71 0 0 0 293.29 2050.5a679.65 679.65 0 0 0 393.64 116.29c378.78 0 686.07-306.65 686.87-685.43z" />
                      </svg>
                    </a>
                  </div>
                  <!-- 哔哩哔哩 -->
                  <div class="flex items-center">
                    <a href="https://space.bilibili.com/364684263?spm_id_from=333.1007.0.0" target="_blank" title="关注哔哩哔哩"
                      class=" mx-auto">
                      <svg class="w-14 h-14  mx-auto" viewBox="-.64 -4.64 2187.5 1004.88" title="关注哔哩哔哩"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="m2030.61 892.82c-9.77 0-18.55 0-26.37-.98-16.6-.97-33.2-1.95-49.8-1.95-10.74 0-10.74 0-11.72-10.74l-15.63-177.74-15.62-147.46-10.74-90.82-9.77-79.1-17.58-123.05c-5.86-43.94-12.69-86.91-21.48-130.86-.98-6.83-.98-7.81 6.84-8.79 30.27-5.86 61.52-8.79 92.77-8.79h10.74c4.88.98 7.81 3.91 8.79 9.77l3.91 67.38 27.34 364.26 13.67 166.99 8.79 95.71zm-1197.27-780.28h17.58c8.79 0 10.74 2.93 10.74 11.72l7.82 118.17 17.58 245.11 10.74 127.93 7.81 98.64 15.63 169.92c0 7.81-.98 8.79-8.79 8.79l-70.32-2.93c-4.88.98-7.81-1.95-7.81-6.84l-2.93-34.18c-2.93-29.29-5.86-58.59-7.81-88.86l-15.63-154.3-16.6-139.65-11.72-98.63-12.69-89.85c-5.86-40.04-12.7-81.05-19.53-121.09l-4.89-27.34c-.97-4.89 0-6.84 4.89-7.82 27.34-4.88 53.71-9.76 85.93-8.79zm982.43 393.56c24.41 0 27.34.98 31.25 24.41 4.88 29.3 8.79 58.6 11.72 87.89l10.74 94.73 20.51 201.17c.97 4.89 0 6.84-4.89 6.84l-76.17 8.79c-7.81.97-9.77 0-10.74-7.81l-43.95-224.61-27.34-149.42-3.91-20.51c-.97-3.9.98-6.83 4.89-7.81 30.27-6.83 59.57-11.72 87.89-13.67zm-1110.36 0c26.37-.98 29.3 1.95 32.23 26.37 6.84 40.04 11.72 79.1 15.63 119.14l12.69 117.18 7.81 79.11 6.84 63.47c0 8.79-.98 10.75-8.79 11.72l-72.26 6.84c-7.82.97-9.77 0-10.75-7.81l-59.57-306.65-15.62-86.91c-.98-4.88.97-7.81 5.86-8.79 30.27-6.83 58.59-11.72 85.93-13.67zm373.05 302.73v125c.98 5.86-1.95 8.79-7.81 7.82h-23.44c-16.6 0-33.2.97-49.8 1.95-8.79.98-9.77.98-10.75-9.77l-15.62-175.78-7.81-86.91-11.72-132.81c-.98-10.75.98-12.7 9.76-13.68 27.35-2.93 54.69-2.93 82.04-1.95l20.5 2.93c7.82 2.93 8.79 3.91 8.79 11.72l2.93 52.73.98 58.6c.98 53.71 1.95 106.44 1.95 160.15zm1108.4 5.86v120.12c0 4.88-1.95 7.81-6.84 6.84h-35.15c-13.67 0-27.35.97-40.04 1.95-7.81.98-8.79 0-9.77-8.79l-20.5-228.52-10.75-113.28-3.9-57.61c-.98-7.82.97-9.77 8.79-9.77 32.22-3.91 65.43-4.88 97.65-.98 12.7.98 14.65 4.89 15.63 17.58l2.93 129.88zm-399.41-516.6c9.76 0 18.55.98 25.39 1.95 4.88.98 6.83 2.93 7.81 7.82l12.69 135.74c2.93 11.72.98 13.67-10.74 13.67l-33.2 1.95c-6.84.98-9.77 1.96-9.77-8.78l-13.67-110.36-3.9-31.25c-.98-5.86.97-8.79 6.83-9.76zm-1106.45 0c7.81 0 15.63.98 22.46 1.95 3.91.98 5.86 2.93 6.84 7.82l3.9 34.18 9.77 106.44c.98 7.81.98 8.79-6.84 8.79l-38.08 1.95c-7.81.98-8.79 0-9.77-7.81l-8.79-78.12-7.81-65.43c-.98-4.89.98-7.82 5.86-7.82 6.84-.97 14.65-1.95 22.46-1.95zm389.65 97.66v67.38c.98 10.74-.98 10.74-9.77 10.74-12.69 0-24.41-.97-36.13-1.95-7.81-.98-8.79-.98-7.81-8.79l-2.93-83.01c0-18.55 0-37.11-.98-55.66-.97-8.79 0-9.77 8.79-9.77 13.67 0 27.34.98 41.02 2.93 7.81 0 7.81 1.96 7.81 9.77zm1109.37.97v67.39c0 8.79-.97 9.76-9.76 9.76l-37.11-1.95c-5.86-.98-8.79-3.91-7.81-8.79l-2.93-139.65c0-7.81.97-8.79 8.79-8.79 12.69 0 24.41.98 36.13 1.96 14.65.97 12.69 3.9 12.69 14.64zm-1529.29 52.74c.97 11.72 0 13.67-11.72 14.65l-23.44 5.86c-7.81 2.93-8.79.97-9.76-5.86l-24.42-137.7c-2.93-8.79-.98-10.74 7.81-11.72l34.18-5.86c7.82-.97 9.77-.97 9.77 6.84 2.93 16.6 5.86 33.2 7.81 49.8l9.77 78.13zm1039.06-133.79c14.65-2.93 30.27-4.88 45.9-6.84 4.88-.97 6.83 1.96 7.81 6.84l7.81 53.71c3.91 26.37 6.84 52.73 7.82 79.1v7.81c.97 3.91-.98 6.84-4.89 7.82l-31.25 6.83c-4.88.98-6.83-.97-7.81-5.86l-25.39-145.5zm-693.36 105.47c0 15.62-.98 30.27-1.95 43.94 0 4.89-1.96 6.84-6.84 7.82l-30.27 2.93c-4.88.97-6.84-1.96-6.84-6.84-1.95-14.65-2.93-28.32-3.9-42.97-1.96-26.37-3.91-53.71-4.89-81.05l-1.95-19.53c-.98-3.91.98-5.86 4.88-5.86l40.04-2.93c6.84 0 8.79.97 8.79 8.79zm1107.42-15.63c.98 18.56.98 38.09 0 56.64.98 8.79-.97 10.75-9.76 10.75l-27.35 2.93c-4.88.97-7.81-1.96-7.81-6.84-.98-24.41-2.93-49.8-4.88-74.22l-3.91-68.36c-.98-4.88.98-6.83 4.88-6.83l39.07-2.93c6.83 0 7.81.97 7.81 8.79 1.95 26.36 2.93 53.71 1.95 80.07zm-1491.21 333.01c15.63 18.56 18.56 39.06 11.72 61.52-5.86 21.49-16.6 40.04-32.23 55.67-25.39 26.37-54.68 47.85-86.91 64.45-55.66 29.3-113.28 49.81-174.81 60.55-43.94 8.79-87.89 14.65-131.83 17.58-13.67.97-27.34.97-41.02.97h-29.29c-7.82 0-9.77-1.95-10.75-9.76l-6.83-94.73-18.56-186.52-20.5-177.74-11.72-94.72-12.7-90.82c-6.83-49.81-15.62-99.61-24.41-149.42-6.84-40.04-13.67-80.08-22.46-120.11-.98-4.89 0-8.79 4.88-9.77l135.74-56.64c8.79-3.91 16.6-6.84 25.39-8.79 5.86-.98 8.79.98 7.81 6.84 0 15.62 0 31.25-.97 47.85l-.98 12.69c-.97 56.64-.97 113.28 0 170.9.98 49.81 3.91 100.59 6.84 150.39 4.88 78.13 12.69 156.25 20.51 233.4 0 7.81.97 7.81 9.76 6.84 16.6-2.93 32.23-3.91 48.83-3.91 51.76 0 103.51 5.86 153.32 18.55 43.94 10.75 85.94 25.4 127.93 43.95 20.51 9.77 39.06 21.48 56.64 35.16 6.84 4.88 11.72 9.76 16.6 15.62zm1100.59-8.79c20.51 16.6 27.34 39.06 21.48 65.43-4.88 21.49-14.65 40.04-29.3 56.64-23.43 26.37-50.78 46.88-81.05 63.48-58.59 32.23-121.09 54.69-187.5 66.41-36.13 6.83-72.27 12.69-108.4 15.62-20.51 1.95-42.97 2.93-65.43 1.95h-26.37c-5.85.98-8.78-1.95-8.78-7.81-1.96-27.34-3.91-54.69-6.84-82.03l-15.63-166.99-16.6-145.51-20.5-164.06c-2.93-28.32-6.84-57.62-11.72-85.94l-17.58-109.38c-7.81-51.75-17.58-103.51-28.32-155.27l-.98-6.83c-1.95-4.89 0-8.79 4.88-9.77 47.86-19.53 94.73-41.02 142.58-59.57 12.7-4.88 28.32-10.74 27.35.98-3.91 36.13-2.93 72.26-3.91 107.42-.98 29.29-.98 58.59.98 86.91v22.46c0 35.16.97 70.32 3.9 104.49 1.96 45.9 4.89 92.78 8.79 138.68l8.79 98.63c.98 18.55 2.93 36.13 5.86 54.69 0 10.74 1.95 9.76 10.74 8.79 17.58-2.93 35.16-3.91 52.74-3.91 61.52.98 121.09 10.74 179.68 27.34 40.04 10.75 78.13 25.39 115.24 44.93 16.6 8.78 31.25 19.53 45.9 32.22zm-1412.11 171.88c14.65-8.79 40.04-26.37 75.19-53.71 35.16-28.32 56.64-46.88 65.43-56.64-52.73-23.44-107.42-43.95-164.06-62.5zm1247.07-105.47c2.93-2.93 1.95-4.88-.98-6.84l-23.44-9.76c-41.01-17.58-82.03-33.21-124.02-46.88l-5.86-1.95c-1.95-.98-3.9 0-6.83.98l23.43 168.94c2.93 0 4.89-.98 5.86-1.95 38.09-27.35 76.17-55.67 114.26-85.94z"
                          fill="#07a3d7" />
                      </svg>
                    </a>
                  </div>
                  <!-- YouTube -->
                  <div class="flex items-center">
                    <a href="https://www.youtube.com/channel/UCX2H1KciWcAW23FHJGGpMZA" target="_blank" title="订阅YouTube"
                      class=" mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" title="订阅YouTube" class="w-14 h-14 mx-auto"
                        viewBox="0 0 500.612 208.352">
                        <path
                          d="M83.743 168.876c-4.007-1.375-6.746-3.24-10.09-6.863-7.024-7.611-7.41-9.883-7.41-43.682 0-32.567.5-35.634 7.044-43.281 9.175-10.718 30.39-10.401 39.45.589 6.017 7.3 6.506 10.55 6.506 43.192 0 25.834-.224 30.14-1.8 34.66-2.416 6.922-9.535 13.619-16.758 15.764-6.812 2.023-10.167 1.949-16.942-.38zm12.455-15.666c4.09-1.57 4.545-5.006 4.545-34.282 0-18.682-.376-28.828-1.13-30.482-2.53-5.554-11.21-5.554-13.74 0-.754 1.654-1.13 11.8-1.13 30.482 0 32.665.417 34.56 7.668 34.825 1.193.043 2.897-.202 3.787-.543zm44.427 15.118c-1.44-.782-3.466-3.128-4.5-5.21-1.745-3.512-1.903-7.104-2.179-49.537l-.297-45.75h19.094v41.877c0 35.843.214 42.057 1.487 43.112 2.216 1.839 5.816.493 9.887-3.697l3.626-3.733V67.832h19v101h-19v-10.17l-4.75 4.217c-2.612 2.319-6.198 4.832-7.968 5.585-4.126 1.753-11.043 1.687-14.4-.136zM24.73 141.08l-.015-27.75-12.357-39.5L.001 34.33l10.04-.287c5.877-.168 10.293.124 10.651.704.337.545 3.524 12.035 7.082 25.533 3.56 13.498 6.698 24.544 6.977 24.546.28.002 2.902-9.108 5.828-20.246 2.927-11.137 5.992-22.612 6.813-25.5l1.493-5.25h10.536c8.584 0 10.438.258 10.003 1.39-.293.764-5.967 18.745-12.607 39.957l-12.073 38.567v55.086h-20l-.014-27.75z"
                          fill="#010101" />
                        <path
                          d="M284.873 207.783c-48.855-1.631-62.084-5.108-71.078-18.688-3.634-5.486-7.713-17.764-9.012-27.128-4.56-32.866-3.44-101.4 2.041-125.021 4.964-21.391 16.637-31.87 37.931-34.053C265.673.748 320.203-.42 373.243.14c57.262.604 84.221 1.829 93.975 4.27 19.08 4.773 28.336 18.828 31.563 47.92.61 5.5 1.36 24.702 1.666 42.67 1.234 72.535-4.223 95.61-25.02 105.799-7.853 3.848-12.99 4.732-35.185 6.057-24.106 1.438-122.48 2.025-155.369.927zm24.034-39.536c1.686-.873 5.038-3.404 7.45-5.63l4.386-4.04v10.254h19v-100h-19V145.095l-4.368 4.367c-4.688 4.689-6.584 5.274-9.06 2.798-1.378-1.378-1.572-6.626-1.572-42.5V68.83h-19v43.319c0 47.787.393 51.568 5.768 55.58 3.403 2.539 11.964 2.809 16.396.518zm91.45-.323c1.745-1.064 4.163-4.03 5.5-6.746 2.346-4.764 2.393-5.42 2.722-37.828.36-35.532-.212-41.948-4.386-49.15-2.319-4.002-7.849-7.37-12.104-7.37-4.098 0-9.97 2.757-14.447 6.782l-4.898 4.403V34.83h-18v134h18v-9.232l4.105 3.709c2.258 2.039 5.521 4.324 7.25 5.076 4.643 2.022 12.557 1.798 16.258-.46zm-23.864-16.312l-3.75-2.174v-61.33l4.438-2.354c3.601-1.91 4.968-2.167 7.25-1.366 4.931 1.732 5.462 5.552 5.12 36.78l-.308 27.838-2.806 2.412c-3.435 2.954-5.123 2.987-9.944.194zm84.25 16.135c9.664-4.381 14.016-11.79 14.777-25.158l.5-8.758h-19.278v5.936c0 7.27-1.127 10.446-4.487 12.648-3.787 2.48-8.494.904-10.76-3.605-1.369-2.721-1.75-6.037-1.75-15.23l-.003-11.75h36v-14.683c0-18.48-1.445-24.37-7.676-31.3-5.506-6.123-11.405-8.561-20.324-8.397-7.393.135-12.333 1.978-17.522 6.534-8.48 7.447-9.766 14.082-9.259 47.847.33 21.939.693 27.284 2.117 31.057 2.432 6.442 6.825 11.347 12.858 14.354 6.8 3.386 17.95 3.614 24.807.505zm-21-68.45c0-12.438 3.191-16.682 11.221-14.918 4.031.886 5.78 5.398 5.78 14.919v7.532h-17v-7.532zm-172 12.034v-57.5h22v-19h-63v19h21v115h20v-57.5z"
                          fill="#d02726" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- 第一行 第五列 -->
            <div class="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">
            </div>
          </div>

          <!-- 第二行 -->
          <div class="flex flex-wrap">
            <!-- 第二行 第一列 -->
            <div class="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">
              <!-- 未更改的部分 -->
            </div>
            <!-- 第二行 第二列 -->
            <div class="w-full sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6 hidden md:block">
            </div>
            <!-- 第二行 第三列 -->
            <div class="w-full sm:w-3/6 md:w-3/6 lg:w-3/6 xl:w-3/6 pl-4 pr-4 pb-2">
              <div v-if="list.length > 0" class="font-bold text-left p-2 md:p-6 rounded-md shadow-lg" :class="{
                'bg-black text-white': colorMode.value === 'dark',
                'bg-white': colorMode.value === 'light',
              }">推荐文章</div>
              <div class="flex flex-wrap justify-center gap-x-2 gap-y-2  md:gap-x-8 md:gap-y-8 mt-2 mb-2">

                <!--推荐博文 -->
                <div v-for="(item) in list">
                  <div class="card card-compact  shadow-lg p-1 border border-base-300" style="height: 23rem; width:24rem"
                    :class="{
                      'bg-black text-white': colorMode.value === 'dark',
                      'bg-white': colorMode.value === 'light',
                    }">
                    <div class="mx-auto">
                      <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><img
                          :src="baseUrl + '/' + item.img" class="aspect-video w-full object-cover rounded"
                          :alt="item.title" />
                      </NuxtLink>
                    </div>
                    <div class="mt-2 h-16 ml-2">
                      <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })">
                        <h3 class="font-bold line-clamp-2 text-base hover:text-blue-500" :title="item.title">
                          {{ item.title }}
                        </h3>
                      </NuxtLink>
                    </div>
                    <div class="ml-2 h-16 mb-2">
                      <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><span
                          class="line-clamp-3 text-sm hover:text-blue-500" :title="item.summary">{{ item.summary }}
                        </span></NuxtLink>
                    </div>
                    <div class="flex items-center mb-2 ml-2 ">
                      <div class="flex items-center ">
                        <Icon name="ic:baseline-event-available" class="font-thin" color="black" />
                        <span class="ml-1 font-thin text-sm">{{ utils.dataFliter(item.createTime) }}</span>
                      </div>

                      <div class="flex items-center">
                        <Icon name="ic:baseline-preview" class="font-thin ml-4" color="black" />
                        <span class="ml-1 font-thin text-sm">{{ item.viewNum }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 第二行 第四列 -->
            <div class="w-full sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6 hidden md:block">

            </div>
            <!-- 第二行 第五列 -->
            <div class="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">
            </div>

          </div>

          <!-- 第三行 -->
          <div class="flex flex-wrap">
            <!-- 第三行 第一列 -->
            <div class="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">
              <!-- 未更改的部分 -->
            </div>
            <!-- 第三行 第二列 -->
            <div class="w-full sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6 hidden md:block">

            </div>
            <!-- 第三行 第三列 -->
            <div class="w-full sm:w-3/6 md:w-3/6 lg:w-3/6 xl:w-3/6 pl-4 pr-4 pb-2">
              <!-- 只在客户端运行时加载组件评论组件 -->
              <client-only>
                <Artalk v-if="content && content.allowComment == '允许'"
                  class=" relative overflow-hidden p-6 rounded-md shadow-lg" :class="{
                    'bg-black text-white': colorMode.value === 'dark',
                    'bg-white': colorMode.value === 'light',
                  }"></Artalk>
              </client-only>
            </div>
            <!-- 第三行 第四列 -->
            <div class="w-full sm:w-1/6 md:w-1/6 lg:w-1/6 xl:w-1/6 hidden md:block">

            </div>
            <!-- 第三行 第五列 -->
            <div class="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 xl:w-1/12">
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 右边锚点侧边栏样式 */
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
  transition: color 0.3s;
}

.aside-article-catalog a:hover {
  color: #3B82F6;
  /* 设置悬停时的字体颜色 */
}

/* 不同标题级别的样式 */
.level_1 {
  font-size: 14px;
}

.level_2 {
  font-size: 13px;
  margin-left: 10px;
  /* 通过缩进表示不同级别 */
}

.level_3 {
  font-size: 12px;
  margin-left: 20px;
}

.level_4 {
  font-size: 12px;
  margin-left: 30px;
}

.level_5 {
  font-size: 12px;
  margin-left: 40px;
}

.level_6 {
  font-size: 12px;
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

