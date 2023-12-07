<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-07 08:38:04
 * @FilePath: \blog_before_vue3_nuxt\components\Build.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import utils from '~/utils/util';

import { ref, nextTick } from 'vue';
const baseUrl = utils.getBaseUrl();
let colorMode = ref({});
let conetent = ref();
let id = 1
const route = useRoute()
if (route.query.id) {
  id = route.query.id
}

const getTblContent = async (id) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  let { data: count } = await useFetch(baseUrl + '/base/getTblContent?ID=' + id)
  conetent.value = count.value.data.retblContent;
}
getTblContent(id);
onMounted(() => {
  colorMode.value = useColorMode();
});
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
            <div class=" bg-base-100  p-2" style="width:40%">
              <h1 v-if="conetent" class="text-3xl font-bold text-center">{{ conetent.title }}</h1>
              <div v-if="conetent" class="overflow-x-auto mt-4 mb-4">
                <table class="table border-t">
                  <tbody>
                    <!-- row 2 -->
                    <tr>
                      <td class="text-left">
                        <Icon name="ep:clock" size="20" color="black" class="mr-2" />{{
                          utils.dataFliter(conetent.createTime) }}
                      </td>
                      <td class="text-center">
                        <Icon name="ep:view" size="20" color="black" class="mr-2" />{{ conetent.viemNum }}
                      </td>
                      <td class="text-right">
                        <Icon name="ep:user" size="20" color="black" class="mr-2" />一码界
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="conetent" class=" space-y-2" v-html="conetent.content">
              </div>
              <div class="bg-base-content/10 mx-1 my-10 h-px"></div>
              <div class="h-32 card bg-base-200 rounded-box  space-y-2 p-1">
                <p>文章作者: blinkfox</p>
                <p>文章链接: https://blinkfox.github.io/2018/11/24/ruan-jian-she-ji/ruan-jian-cheng-xu-she-ji-yuan-ze/</p>
                <p>版权声明: 本博客所有文章除特別声明外，均采用 CC BY 4.0 许可协议。转载请注明来源 blinkfox !</p>
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