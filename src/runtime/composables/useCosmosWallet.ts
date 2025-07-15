import { ref, computed, readonly } from 'vue'
import type { CosmosWallet, WalletInfo, ChainInfo, CosmosMessage, CosmosFee } from '../types'
import { useRuntimeConfig } from '#app'

export const useCosmosWallet = () => {
  const config = useRuntimeConfig()
  const cosmosConfig = config.public.cosmosOfflineSigners

  const connectedWallet = ref<CosmosWallet | null>(null)
  const walletInfo = ref<WalletInfo | null>(null)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)

  const isConnected = computed(() => !!connectedWallet.value && !!walletInfo.value)

  const chainInfo = computed((): ChainInfo => ({
    chainId: cosmosConfig.chainId,
    chainName: cosmosConfig.chainId === 'cosmoshub-4' ? 'Cosmos Hub' : 'Custom Chain',
    rpc: cosmosConfig.rpcEndpoint,
    rest: cosmosConfig.restEndpoint,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: cosmosConfig.bech32Prefix,
      bech32PrefixAccPub: `${cosmosConfig.bech32Prefix}pub`,
      bech32PrefixValAddr: `${cosmosConfig.bech32Prefix}valoper`,
      bech32PrefixValPub: `${cosmosConfig.bech32Prefix}valoperpub`,
      bech32PrefixConsAddr: `${cosmosConfig.bech32Prefix}valcons`,
      bech32PrefixConsPub: `${cosmosConfig.bech32Prefix}valconspub`,
    },
    currencies: [{
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
      coinGeckoId: 'cosmos',
    }],
    feeCurrencies: [{
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
      coinGeckoId: 'cosmos',
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    }],
    stakeCurrency: {
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
      coinGeckoId: 'cosmos',
    },
  }))

  const connectWallet = async (wallet: CosmosWallet) => {
    if (!wallet.isInstalled) {
      throw new Error(`${wallet.name} is not installed`)
    }

    isConnecting.value = true
    error.value = null

    try {
      const info = await wallet.connect()
      connectedWallet.value = wallet
      walletInfo.value = info
      console.log(`Connected to ${wallet.name}:`, info)
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to connect wallet'
      throw err
    }
    finally {
      isConnecting.value = false
    }
  }

  const disconnectWallet = async () => {
    if (connectedWallet.value) {
      try {
        await connectedWallet.value.disconnect()
      }
      catch (err) {
        console.warn('Error disconnecting wallet:', err)
      }
      connectedWallet.value = null
      walletInfo.value = null
      error.value = null
    }
  }

  const getOfflineSigner = async () => {
    if (!connectedWallet.value) {
      throw new Error('No wallet connected')
    }
    return await connectedWallet.value.getOfflineSigner(cosmosConfig.chainId)
  }

  const getAccount = async () => {
    if (!connectedWallet.value) {
      throw new Error('No wallet connected')
    }
    return await connectedWallet.value.getAccount(cosmosConfig.chainId)
  }

  const signAndBroadcast = async (msgs: CosmosMessage[], fee: CosmosFee, memo = '') => {
    if (!connectedWallet.value) {
      throw new Error('No wallet connected')
    }
    return await connectedWallet.value.signAndBroadcast(msgs, fee, memo)
  }

  return {
    // State
    connectedWallet: readonly(connectedWallet),
    walletInfo: readonly(walletInfo),
    isConnecting: readonly(isConnecting),
    isConnected,
    error: readonly(error),
    chainInfo,

    // Actions
    connectWallet,
    disconnectWallet,
    getOfflineSigner,
    getAccount,
    signAndBroadcast,
  }
}
