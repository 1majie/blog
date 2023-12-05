<script setup>
let colorMode = ref({});
let currentYear=ref(0);

onMounted(() => {
  colorMode.value = useColorMode();
  const date = new Date();
  currentYear.value= date.getFullYear();
});
</script>

<template>
  <footer class="items-center sm:text lg:text-xl p-4 bg-base-100 border border-base-300 fixed bottom-0 w-full" :class="{
    'bg-base-300': colorMode.value === 'dark',
    'bg-base-100': colorMode.value === 'light',
  }">
    <div class="items-center justify-center flex flex-col md:flex-row">
      <p>{{ $t("company") }}&nbsp;&nbsp;</p>
      <p>Copyright © {{ currentYear }} - All right reserved</p>
    </div>
  </footer>
</template>

<style scoped></style>
