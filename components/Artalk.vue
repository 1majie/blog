<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-16 06:34:44
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-30 07:41:44
 * @FilePath: \blog_before_vue3_nuxt\components\Artalk.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div id="Comments"></div>
</template>
  
<script setup>
import "artalk/dist/Artalk.css";
import Artalk from "artalk";;
let colorMode = ref({});

onMounted(() => {
    colorMode.value = useColorMode();
    if (Artalk) {
        const pageTitle = document.title;
        new Artalk({
            el: "#Comments",
            pageKey: `${window.location.href}`, // 页面链接
            pageTitle: pageTitle, // 页面标题
            server: import.meta.env.VITE_ARTALK_URL, // 后端地址
            site: import.meta.env.VITE_ARTALK_SITE_TILE,
            darkMode: colorMode.value === 'dark', // 自动主题
            useBackendConf: false,// 关闭前端中心
        });
    }
})

</script>