<script setup>
const { t, locale, setLocale } = useI18n();
let colorMode = ref({});
const selectedLocale = ref(locale.value);
let themes = [
  { key: "light", name: t("theme.light") },
  { key: "dark", name: t("theme.dark") },
  { key: "system", name: t("theme.system") },
];

let languages = [
  { key: "zh", name: t("lang.china") },
  { key: "en", name: t("lang.english") },
];

onMounted(() => {
  selectedLocale.value = locale.value;
});
watchEffect(() => {
  // Update themes and languages when the locale changes
  themes = [
    { key: "light", name: t("theme.light") },
    { key: "dark", name: t("theme.dark") },
    { key: "system", name: t("theme.system") },
  ];

  languages = [
    { key: "zh", name: t("lang.china") },
    { key: "en", name: t("lang.english") },
  ];
});

const changeLocale = () => {
  setLocale(selectedLocale.value);
};
onMounted(() => {
  colorMode.value = useColorMode();
});
</script>

<template>
  <div class="navbar  h-14 bg-base-100 border border-base-300 fixed top-0 left-0 right-0 z-50 font-bold text-base-content"
    :class="{
      'bg-base-300': colorMode.value === 'dark',
      'bg-base-100': colorMode.value === 'light',
    }">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <Icon name="ep:menu" size="26" color="black" />
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52">
          <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '技术' } })">{{ $t("menu.home") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '下载' } })">{{ $t("menu.download") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '软件' } })">{{
            $t("menu.software")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: 'VPS' } })">{{
            $t("menu.vps")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '机场' } })">{{
            $t("menu.proxy")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '搞钱' } })">{{
            $t("menu.money")
          }}</NuxtLink>
        </li>
        </ul>
      </div>
      <a class="btn btn-ghost normal-case sm:text lg:text-xl">
        <img src="/images/logo.png" class=" w-20 h-10" alt="一码界">
     </a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal gap-6 px-1 text-lg">
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '技术' } })">{{ $t("menu.home") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '下载' } })">{{ $t("menu.download") }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '软件' } })">{{
            $t("menu.software")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: 'VPS' } })">{{
            $t("menu.vps")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '机场' } })">{{
            $t("menu.proxy")
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath({ name: 'index', query: { type: '搞钱' } })">{{
            $t("menu.money")
          }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="navbar-end gap-4">
      <select class="select select-sm focus:outline-0 text-center pl-0" v-model="selectedLocale" @change="changeLocale">
        <option v-for="lang of languages" :value="lang.key" :key="lang.key">
          {{ lang.name }}
        </option>
      </select>
      <select class="select select-sm focus:outline-0 text-center pl-0" v-model="colorMode.preference">
        <option v-for="theme of themes" :value="theme.key" :key="theme.key"
          :selected="theme.key === colorMode.preference">
          {{ theme.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped></style>
