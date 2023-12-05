// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "nuxt-icon", //https://icones.js.org/ icon图标地址
    "@nuxtjs/color-mode",
  ],
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "dark", /// default theme
    dataValue: "theme", // activate data-theme in <html> tag
    classSuffix: "",
    storageKey: 'nuxt-color-mode',
  },
  // css: ["~/assets/main.css"],
  i18n: {
    locales: [
      { code: "zh", iso: "zh-CN", file: "zh.json" },
      { code: "en", iso: "en-US", file: "en.json" },
    ],
    defaultLocale: "zh",
    langDir: "locales/",
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
      fallbackLocale: "zh", // 如果无法检测到语言，则使用的语言
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    }
  }, 
});
