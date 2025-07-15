export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  cosmosOfflineSigners: {
    chainId: 'cosmoshub-4',
    rpcEndpoint: 'https://cosmos-api.cosmdev.com/rpc/atom',
    restEndpoint: 'https://cosmos-api.cosmdev.com/lcd/atom',
    bech32Prefix: 'cosmos',
  },
})
