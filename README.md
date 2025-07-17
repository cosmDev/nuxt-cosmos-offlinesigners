# 🌌 Nuxt Cosmos Offline Signers

A powerful and modern Nuxt 3 module for seamless integration of Cosmos ecosystem wallets (Keplr and Leap) into your decentralized applications.

![MainApp](https://i.imgur.com/4OSL0lx.png)

## ✨ Features

- 🔗 **Multiple Wallet Support**: Built-in support for Keplr and Leap wallets
- 🎯 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🚀 **Nuxt 3 Composables**: Reactive composables for wallet management and blockchain interactions
- 🎨 **Beautiful Components**: Pre-built Vue components with modern UI/UX design
- ⚙️ **Highly Configurable**: Customize chain settings, endpoints, and wallet behavior
- 🔐 **Secure**: Built with security best practices and offline signing capabilities
- 🌐 **Multi-Chain**: Support for any Cosmos-based blockchain
- ⚡ **Performance Optimized**: Lightweight and fast with minimal bundle size
- 🛠️ **Developer Friendly**: Comprehensive documentation and examples

## 🚀 Quick Setup

### Nuxt install

```bash
npx nuxi module add @cosmdev/nuxt-cosmos-offlinesigners
```
That's it! You can now use Nuxt offlinesigners Module in your Nuxt app ✨

### Manual install

```bash
# npm
npm install @cosmdev/nuxt-cosmos-offlinesigners

# yarn
yarn add @cosmdev/nuxt-cosmos-offlinesigners

# pnpm
pnpm add @cosmdev/nuxt-cosmos-offlinesigners
```

### Basic Configuration

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@cosmdev/nuxt-cosmos-offlinesigners'
  ],
  cosmosOfflineSigners: {
    chainId: 'cosmoshub-4',
    rpcEndpoint: 'https://cosmos-rpc.cosmdev.com/lcd/atom',
    restEndpoint: 'https://cosmos-api.cosmdev.com/lcd/atom',
    bech32Prefix: 'cosmos',
    coinDenom: 'ATOM',
    coinMinimalDenom: 'uatom',
    coinDecimals: 6
  }
})
```

## 📖 Usage

### Basic Wallet Connection

```vue
<template>
  <div>
    <!-- Pre-built wallet connection component -->
    <CosmosWalletConnect />
    
    <!-- Display wallet information when connected -->
    <CosmosWalletInfo v-if="isConnected" />
  </div>
</template>

<script setup>
const { isConnected } = useCosmosWallet()
</script>
```

### Advanced Usage with Composables

```vue
<template>
  <div>
    <div v-if="!isConnected">
      <button @click="connectKeplr">Connect Keplr</button>
      <button @click="connectLeap">Connect Leap</button>
    </div>
    
    <div v-else>
      <p>Connected: {{ walletInfo?.address }}</p>
      <p>Balance: {{ balance }} {{ coinDenom }}</p>
      <button @click="sendTokens">Send Tokens</button>
      <button @click="delegate">Delegate</button>
      <button @click="disconnect">Disconnect</button>
    </div>
  </div>
</template>

<script setup>
// Wallet management
const { 
  isConnected, 
  walletInfo, 
  connectWallet, 
  disconnectWallet 
} = useCosmosWallet()

// Keplr specific features
const { 
  isInstalled: keplrInstalled, 
  wallet: keplrWallet 
} = useKeplr()

// Leap specific features
const { 
  isInstalled: leapInstalled, 
  wallet: leapWallet 
} = useLeap()

// Blockchain transactions
const {
  getBalance,
  sendTokens,
  delegate,
  getValidators,
  getProposals
} = useCosmosTransactions()

// Local state
const balance = ref('0')
const coinDenom = ref('ATOM')

// Methods
const connectKeplr = () => connectWallet(keplrWallet.value)
const connectLeap = () => connectWallet(leapWallet.value)
const disconnect = () => disconnectWallet()

// Load balance when connected
watchEffect(async () => {
  if (isConnected.value && walletInfo.value) {
    balance.value = await getBalance(walletInfo.value.address)
  }
})
</script>
```

### Transaction Examples

```typescript
// Send tokens
const txResult = await sendTokens({
  recipient: 'cosmos1...',
  amount: '1000000', // 1 ATOM in uatom
  memo: 'Hello Cosmos!'
})

// Delegate to validator
const delegateResult = await delegate({
  validatorAddress: 'cosmosvaloper1...',
  amount: '1000000' // 1 ATOM in uatom
})

// Query blockchain data
const validators = await getValidators()
const proposals = await getProposals()
const balance = await getBalance('cosmos1...')
```

## � Components

### CosmosWalletConnect

A beautiful, responsive wallet connection component with support for multiple wallets.

```vue
<CosmosWalletConnect 
  :show-balance="true"
  :auto-connect="false"
  theme="dark"
/>
```

### CosmosWalletInfo

Display comprehensive wallet information and account details.

```vue
<CosmosWalletInfo 
  :show-demo="true"
  :show-transactions="true"
/>
```

### CosmosAdvancedDemo

A complete demo component showcasing all module features.

```vue
<CosmosAdvancedDemo />
```

## ⚙️ Configuration

```typescript
export interface ModuleOptions {
  // Blockchain Configuration
  chainId: string
  rpcEndpoint: string
  restEndpoint: string
  bech32Prefix: string
  
  // Token Configuration
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: number
  
  // Wallet Configuration
  autoConnect?: boolean
  preferredWallet?: 'keplr' | 'leap'
  
  // UI Configuration
  theme?: 'light' | 'dark' | 'auto'
  
  // Advanced Configuration
  gasPrice?: string
  defaultGas?: number
  memo?: string
}
```

### Example Configurations

#### Cosmos Hub
```typescript
cosmosOfflineSigners: {
  chainId: 'cosmoshub-4',
  rpcEndpoint: 'https://cosmos-rpc.cosmdev.com/lcd/atom',
  restEndpoint: 'https://cosmos-api.cosmdev.com/lcd/atom',
  bech32Prefix: 'cosmos',
  coinDenom: 'ATOM',
  coinMinimalDenom: 'uatom',
  coinDecimals: 6
}
```

#### Osmosis
```typescript
cosmosOfflineSigners: {
  chainId: 'osmosis-1',
  rpcEndpoint: 'https://osmosis-rpc.polkachu.com',
  restEndpoint: 'https://osmosis-api.polkachu.com',
  bech32Prefix: 'osmo',
  coinDenom: 'OSMO',
  coinMinimalDenom: 'uosmo',
  coinDecimals: 6
}
```

#### Juno
```typescript
cosmosOfflineSigners: {
  chainId: 'juno-1',
  rpcEndpoint: 'https://juno-rpc.polkachu.com',
  restEndpoint: 'https://juno-api.polkachu.com',
  bech32Prefix: 'juno',
  coinDenom: 'JUNO',
  coinMinimalDenom: 'ujuno',
  coinDecimals: 6
}
```

## 🔧 Composables API

### useCosmosWallet()

Main wallet management composable.

```typescript
const {
  // State
  isConnected: Ref<boolean>,
  walletInfo: Ref<WalletInfo | null>,
  isConnecting: Ref<boolean>,
  
  // Methods
  connectWallet: (wallet: any) => Promise<void>,
  disconnectWallet: () => Promise<void>,
  
  // Utils
  formatAddress: (address: string) => string,
  isValidCosmosAddress: (address: string) => boolean
} = useCosmosWallet()
```

### useCosmosTransactions()

Blockchain interaction composable.

```typescript
const {
  // Query Methods
  getBalance: (address: string) => Promise<string>,
  getDelegations: (address: string) => Promise<any[]>,
  getValidators: () => Promise<any[]>,
  getProposals: () => Promise<any[]>,
  
  // Transaction Methods
  sendTokens: (params: SendParams) => Promise<any>,
  delegate: (params: DelegateParams) => Promise<any>,
  undelegate: (params: UndelegateParams) => Promise<any>,
  vote: (params: VoteParams) => Promise<any>
} = useCosmosTransactions()
```

### useKeplr() & useLeap()

Wallet-specific composables.

```typescript
const {
  isInstalled: Ref<boolean>,
  wallet: Ref<any>,
  isSupported: Ref<boolean>
} = useKeplr()
```

## 🎯 Examples

Check out our comprehensive examples:

- **[Basic Integration](./playground/pages/simple.vue)** - Simple wallet connection
- **[Advanced Demo](./playground/pages/advanced.vue)** - Full feature showcase
- **[Custom Implementation](./playground/pages/docs.vue)** - Documentation and guides

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Start development server
npm run dev

# Build the playground
npm run dev:build

# Run tests
npm run test

# Run linting
npm run lint
```

### Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Type checking
npm run test:types
```

## 📝 Requirements

- **Nuxt 3.x**
- **Vue 3.x**
- **Node.js 16+**
- **TypeScript 4.x+** (recommended)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[MIT License](./LICENSE)

## 🙏 Acknowledgments

- [CosmJS](https://github.com/cosmos/cosmjs) - Cosmos JavaScript library
- [Keplr Wallet](https://www.keplr.app/) - Leading Cosmos wallet
- [Leap Wallet](https://www.leapwallet.io/) - Modern Cosmos wallet
- [Nuxt 3](https://nuxt.com/) - The Intuitive Vue Framework

---

<p align="center">
  <strong>Built with ❤️ by cosmDev</strong>
</p>

