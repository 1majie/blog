/*
 * @Author: freedom 957420317@qq.com
 * @Date: 2023-12-06 20:41:55
 * @LastEditors: freedom 957420317@qq.com
 * @LastEditTime: 2023-12-11 07:56:14
 * @FilePath: \blog_before_vue3_nuxt\nuxt.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import prismjs from "vite-plugin-prismjs";
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
    storageKey: "nuxt-color-mode",
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
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
      },
    },
  },
  vite: {
    plugins: [
      prismjs({
        // 添加支持的高亮的语言, 如果需要支持全部的话改成这样:  languages: "all"
        languages: "all",
        // 配置prism插件 toolbar是后面两个插件依赖的插件.
        // show-language: 显示语言名。
        // copy-to-clipboard: 添加复制代码功能。
        plugins: [
          "inline-color",
          "line-numbers",
          "toolbar",
          "show-language",
          "copy-to-clipboard",
        ],
        // 主题名称,支持的主题可以在 node_moduels中安装此库的目录下寻找。
        theme: "tomorrow",
        css: true,
      }),
    ],
  },
  app: {
    head: {
      titleTemplate: "%s-一码界博客", // 用模板，具体参考官网
      meta: [
        { charset: "utf-8" },
        { name: "renderer", content: "webkit", "data-n-head": true },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge,chrome=1" },
        { name: "keywords", content: "编程记录,网络安全,工具软件,随笔杂谈" },
        {
          name: "description",
          content:
            "一码界博客，集前端、后端、数据库、运维、网络安全、产品开发技术于一身。实用指南、工具推荐，助力你的技术成长。",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
