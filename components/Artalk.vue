<template>
    <div id="Comments"></div>
</template>
  
<script setup>
import "artalk/dist/Artalk.css";
import Artalk from "artalk";
let colorMode = ref({});

onMounted(() => {
    colorMode.value = useColorMode();
    if (Artalk) {
        const pageTitle = document.title;
        new Artalk({
            el: "#Comments",
            pageKey: `${window.location.href}`, // 页面链接
            pageTitle: pageTitle, // 页面标题
            server: "http://192.168.100.23:8080", // 后端地址
            site: "一码界",
            darkMode: colorMode.value === 'dark', // 自动主题
            useBackendConf: false,// 关闭前端中心
        });
    }
})

</script>