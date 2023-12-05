<script setup>
import utils from '~/utils/util';

import { ref, nextTick } from 'vue';
const baseUrl = utils.getBaseUrl();
let colorMode = ref({});
let conetent = ref({});
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
  <div class="flex flex-col h-screen">
    <!-- 第一行 -->
    <div class="flex items-center justify-between bg-base-100 mt-24">
      <div class=" text-right flex-none w-2/6"></div>
      <div class=" rounded p-4" :class="{
        'bg-base-300': colorMode.value === 'dark',
        'bg-base-100': colorMode.value === 'light',
      }">
        <h1 class="text-3xl font-bold text-center">{{ conetent.title }}</h1>
        <div class="overflow-x-auto mt-4 mb-4">
          <table class="table border-t">
            <tbody>
              <!-- row 2 -->
              <tr>
                <td class="text-left">
                  <Icon name="ep:clock" size="26" color="black" class="mr-2" />{{ utils.dataFliter(conetent.createTime) }}
                </td>
                <td class="text-center">
                  <Icon name="ep:view" size="26" color="black" class="mr-2" />{{ conetent.viemNum }}
                </td>
                <td class="text-right">
                  <Icon name="ep:user" size="26" color="black" class="mr-2" />一码界
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="conetent.content" class=" space-y-2" v-html="conetent.content">
        </div>
        <div class="overflow-x-auto mt-4 mb-4">
          <table class="table border-t">
            <tbody>
              <!-- row 2 -->
              <tr>
                <td class="text-left">
                  <Icon name="ep:clock" size="26" color="black" class="mr-2" />{{ utils.dataFliter(conetent.createTime) }}
                </td>
                <td class="text-center">
                  <Icon name="ep:view" size="26" color="black" class="mr-2" />{{ conetent.viemNum }}
                </td>
                <td class="text-right">
                  <Icon name="ep:user" size="26" color="black" class="mr-2" />一码界
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class=" text-left flex-none w-2/6"></div>

    </div>

    <!-- 第二行 -->
    <div class="flex items-center justify-between bg-base-100  pb-20">
      <div class=" text-right flex-none w-2/6"></div>
      <div class=" font-ligh  rounded p-4" :class="{
        'bg-base-300': colorMode.value === 'dark',
        'bg-base-100': colorMode.value === 'light',
      }">
        <p>本博客上的原创作品采用 知识共享署名 4.0 国际许可协议（CC BY 4.0） 进行许可。</p>
        <p>在转载或使用本博客上的原创作品时，您需要遵循以下署名要求：</p>
        <p>署名方式： 在使用作品的可见位置提供明确的署名，包括作者的姓名（一码界）。</p>
        <p>链接方式： 提供指向原始作品的链接，以便读者能够获取更多信息。</p>
        <p>说明修改： 如果您对作品进行了修改，提供说明，明确修改的内容。</p>
      </div>
      <div class=" text-left flex-none w-2/6"></div>
    </div>
  </div>
</template>