<script setup>
import utils from '~/utils/util';
import { ref, nextTick } from 'vue';
const baseUrl = utils.getBaseUrl();
let colorMode = ref({});
let page = 1;
let list = ref([]);
let total = 0;
let pageSize = 1;
let type = "技术"
const route = useRoute()
if (route.query.type) {
  type = route.query.type
}
console.log(type)
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
watch(
  () => route.query.type, // 监听 $route.query.param 的变化
  async (newType) => {
    // 在路由参数变化时重新加载数据
    getList(page, newType);
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
        <div class="card card-compact w-96 h-80 bg-base-100 shadow-lg top-5 border border-base-300" :class="{
          'bg-base-300': colorMode.value === 'dark',
          'bg-base-100': colorMode.value === 'light',
        }">
          <div class="w-48 mx-auto mt-5">
            <img :src="baseUrl + '/' + item.img" class="rounded h-48" :alt="item.title" />
          </div>
          <div class="mt-4">
            <h1 class="font-bold text-xl display:block flex justify-center" :title="item.title">
              <NuxtLink :to="localePath({ name: 'maintance', query: { id: item.ID } })">{{ item.title }}</NuxtLink>
            </h1>
          </div>
          <div class="mt-4">
            <span class="display:block flex justify-center" :title="item.summary">{{ item.summary }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap justify-center gap-x-8 gap-y-8 mt-16">
      <div class="join grid grid-cols-2" :class="{
        'bg-base-300': colorMode.value === 'dark',
        'bg-base-100': colorMode.value === 'light',
      }">
        <button v-if="page > 1" class="join-item btn btn-outline border border-base-300" @click="getList(--page, type)">{{
          $t("page.before")
        }}</button>
        <button v-if="total > 1 && page < total / pageSize" class="join-item btn btn-outline border border-base-300"
          @click="getList(++page, type)">{{ $t("page.next")
          }}</button>
      </div>
    </div>
  </div>
</template>
