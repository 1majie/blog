<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-10 07:41:58
 * @FilePath: \blog_before_vue3_nuxt\components\List.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import utils from '~/utils/util';
import { ref, nextTick } from 'vue';
const baseUrl = utils.getBaseUrl();
let colorMode = ref({});
let page = 1;
let beforePage = 0;
let afterPage = 1;
let list = ref([]);
let pageSize = 2;
let type = "技术";
const route = useRoute()
if (route.query.type) {
  type = route.query.type
  page = route.query.page || 1
}
const getList = async (currentPage, type) => {
  // 防止客户端执行时，直接返回null
  await nextTick()
  page = currentPage
  let { data: count } = await useFetch(baseUrl + '/base/getTblContentList?page=' + page + '&pageSize=' + pageSize + '&type=' + type)
  list.value = count.value.data.result.list;
  beforePage = count.value.data.beforePage;
  afterPage = count.value.data.nextPage;
}
getList(page, type);
watch(
  () => route.query, // 监听 $route.query.param 的变化
  async (newType) => {
    // 当切换菜单时，分页重置为1
    let currentPage = route.query.page || 1
    type = route.query.type
    // 在路由参数变化时重新加载数据
    getList(currentPage, type);
  }
);
onMounted(() => {
  colorMode.value = useColorMode();
});
</script>

<template>
  <div class="mt-16 lg:mb-32 sm:mb-44">
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
            <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID, type: type } })"><span
                class="line-clamp-2" :title="item.summary">{{ item.summary }}
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
    <div v-if="list.length > 0" class="flex flex-wrap justify-center gap-x-8 gap-y-8 mt-10">
      <div class="join grid grid-cols-2" :class="{
        'bg-base-300': colorMode.value === 'dark',
        'bg-base-100': colorMode.value === 'light',
      }">
        <NuxtLink v-if="beforePage >= 1" target="_self"
          :to="localePath({ name: 'index', query: { 'type': type, 'page': beforePage } })">{{
            $t("page.before") }}</NuxtLink>
        <NuxtLink v-if="afterPage >= 2" target="_self" class="ml-4"
          :to="localePath({ name: 'index', query: { 'type': type, 'page': afterPage } })">{{
            $t("page.next") }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
