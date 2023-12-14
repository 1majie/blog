<!--
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-14 08:01:49
 * @FilePath: \blog_before_vue3_nuxt\layouts\default.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup></script>

<template>
  <div>
    
    <Header></Header>
    <slot />
    <Foot></Foot>
  </div>
</template>

<style scoped></style>
