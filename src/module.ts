import { defineNuxtModule, addPlugin, createResolver, addImports, addComponent } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  chainId?: string
  rpcEndpoint?: string
  restEndpoint?: string
  bech32Prefix?: string
}

// Runtime config interface with required properties
export interface RuntimeCosmosOptions {
  chainId: string
  rpcEndpoint: string
  restEndpoint: string
  bech32Prefix: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-cosmos-offlinesigners',
    configKey: 'cosmosOfflineSigners',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    chainId: 'cosmoshub-4',
    rpcEndpoint: 'https://cosmos-api.cosmdev.com/rpc/atom',
    restEndpoint: 'https://cosmos-api.cosmdev.com/lcd/atom',
    bech32Prefix: 'cosmos',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add Pinia module
    nuxt.options.modules = nuxt.options.modules || []
    if (!nuxt.options.modules.includes('@pinia/nuxt')) {
      nuxt.options.modules.push('@pinia/nuxt')
    }

    // Create runtime config with all required properties, using defaults if not provided
    const runtimeConfig: RuntimeCosmosOptions = {
      chainId: options.chainId || 'cosmoshub-4',
      rpcEndpoint: options.rpcEndpoint || 'https://cosmos-api.cosmdev.com/rpc/atom',
      restEndpoint: options.restEndpoint || 'https://cosmos-api.cosmdev.com/lcd/atom',
      bech32Prefix: options.bech32Prefix || 'cosmos',
    }

    // Add runtime config
    nuxt.options.runtimeConfig.public.cosmosOfflineSigners = runtimeConfig

    // Add plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Add composables
    addImports([
      {
        name: 'useCosmosWallet',
        from: resolver.resolve('./runtime/composables/useCosmosWallet'),
      },
      {
        name: 'useKeplr',
        from: resolver.resolve('./runtime/composables/useKeplr'),
      },
      {
        name: 'useLeap',
        from: resolver.resolve('./runtime/composables/useLeap'),
      },
      {
        name: 'useCosmosTransactions',
        from: resolver.resolve('./runtime/composables/useCosmosTransactions'),
      },
      {
        name: 'formatAddress',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'formatBalance',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'formatCoin',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'copyToClipboard',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'truncateHash',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'atomToUatom',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'uatomToAtom',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'isValidCosmosAddress',
        from: resolver.resolve('./runtime/utils'),
      },
      {
        name: 'formatFee',
        from: resolver.resolve('./runtime/utils'),
      },
    ])

    // Add components
    addComponent({
      name: 'CosmosWalletConnect',
      filePath: resolver.resolve('./runtime/components/CosmosWalletConnect.vue'),
    })

    addComponent({
      name: 'CosmosWalletInfo',
      filePath: resolver.resolve('./runtime/components/CosmosWalletInfo.vue'),
    })

    addComponent({
      name: 'CosmosAdvancedDemo',
      filePath: resolver.resolve('./runtime/components/CosmosAdvancedDemo.vue'),
    })
  },
})
