<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-08 08:08:40
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
let id = 1
const route = useRoute()
let url = ref("")
let userName = ref("");
if (route.query.id) {
  id = route.query.id
}

const getTblContent = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: count } = await useFetch(baseUrl + '/base/getTblContent?ID=' + id)
  content.value = count.value.data.retblContent;
  getUserName(count.value.data.retblContent.authorId);
}
const getUserName = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: username } = await useFetch(baseUrl + '/base/GetUserName?id=' + id)
  userName.value = username.value.data.userName;
}
getTblContent(id);
onMounted(async () => {
  await nextTick()
  colorMode.value = useColorMode();
  console.log(content.value)
  Prism.highlightAll();
  url = window.location.href;
})
onUpdated(() => {
  Prism.highlightAll(); //修改内容后重新渲染
});
useHead({
  bodyAttrs: {
    "data-prismjs-copy": "复制",
    "data-prismjs-copy-error": "复制出错",
    "data-prismjs-copy-success": "已复制"
  }
})

</script>
<template>
  <div class=" w-full mx-auto mt-20 mb-20">
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
                <li>
                  <h2 class="menu-title">Title</h2>
                  <ul>
                    <li><a>Item 1</a></li>
                    <li><a>Item 2</a></li>
                    <li><a>Item 3</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class=" bg-base-100  p-6" style="width:40%">
              <h1 v-if="content" class="text-3xl font-bold text-center">{{ content.title }}</h1>
              <div v-if="content" class="overflow-x-auto mt-4 mb-4">
                <hr class="mt-4 mb-4 " />
                <div class="container mx-auto">
                  <ul class="flex flex-wrap">
                    <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3">
                      <!-- 列1的内容 -->
                      <div class="">
                        <p>
                          <Icon name="ic:baseline-event-available" size="20" color="black" />发布时间:<span class="ml-2">{{
                            utils.dataFliter(content.createTime) }}</span>
                        </p>
                      </div>
                    </li>
                    <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
                      <!-- 列2的内容 -->
                      <div class=" ">
                        <p>
                          <Icon name="ic:baseline-preview" size="20" color="black" />阅读次数:<span class="ml-2">{{
                            content.viemNum }}</span>
                        </p>
                      </div>
                    </li>
                    <li class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
                      <!-- 列3的内容 -->
                      <div class="">
                        <p>第三列</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <hr class="mt-4 mb-4 " />
              </div>
              <div v-if="content" class="editor-content-view" v-html="content.content">
              </div>
              <hr class="mt-4 mb-4" />
              <div class="h-32 card bg-base-200 rounded-box  space-y-2 p-6">
                <p>
                  <Icon name="ep:user" size="20" color="bg-base-200" class="mr-2" />文章作者: {{ userName }}
                </p>
                <p>
                  <Icon name="ic:baseline-link" size="20" color="bg-base-200" class="mr-2" />文章链接:
                  {{ url }}
                </p>
                <p>
                  <Icon name="ic:baseline-copyright" size="20" color="bg-base-200" class="mr-2" />版权声明: 本博客所有文章除特別声明外，均采用
                  CC BY 4.0 许可协议。转载请注明来源 {{ userName }} !
                </p>
              </div>
            </div>
            <div class=" bg-purple-300" style="width:15%">
              <ul class="menu bg-base-200">
                <li><a>Item 1</a></li>
                <li>
                  <details open>
                    <summary>Parent</summary>
                    <ul>
                      <li><a>Submenu 1</a></li>
                      <li><a>Submenu 2</a></li>
                      <li>
                        <details open>
                          <summary>Parent</summary>
                          <ul>
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </details>
                </li>
                <li><a>Item 3</a></li>
              </ul>
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
              3
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

<style>
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
  background-color: #f1f1f1;
}

.editor-content-view ul,
.editor-content-view ol {
  padding-left: 20px;
}

.editor-content-view ul>li {

}

.editor-content-view ol>li {
  
}

.editor-content-view input[type="checkbox"] {
  margin-right: 5px;
}

.code-toolbar>.toolbar>.toolbar-item {
  margin-right: 10px;
  color: white;
}
</style>

