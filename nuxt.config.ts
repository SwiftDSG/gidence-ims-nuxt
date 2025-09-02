// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    public: {
      api: process.env.API_URL || "http://localhost:8000",
      base: process.env.BASE_URL || "http://localhost:3000",
    }
  },
})
