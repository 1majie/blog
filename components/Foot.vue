<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-16 09:36:30
 * @FilePath: \blog_before_vue3_nuxt\components\Foot.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
let colorMode = ref({});
let currentYear = ref(0);

onMounted(() => {
  colorMode.value = useColorMode();
  const date = new Date();
  currentYear.value = date.getFullYear();
});
</script>

<template>
  <footer class="items-center sm:text lg:text-xl p-2 md:p-6 rounded-md shadow-lg fixed bottom-0 w-full" :class="{
    'bg-black text-white': colorMode.value === 'dark',
    'bg-white': colorMode.value === 'light',
  }">
    <div class="items-center justify-center flex flex-col md:flex-row">
      <p>{{ $t("company") }}&nbsp;&nbsp;</p>
      <p>Copyright © {{ currentYear }} - All right reserved</p>
    </div>
  </footer>
</template>

<style scoped></style>
