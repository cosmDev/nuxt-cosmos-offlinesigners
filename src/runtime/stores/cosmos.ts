import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import type { ChainInfo, Key } from '@keplr-wallet/types'

interface WalletInfo {
  name: string
  address: string
  balance?: string
  publicKey?: Uint8Array
}

interface Transaction {
  hash: string
  height: number
  type: string
  amount?: string
  timestamp: Date
  status: 'success' | 'failed' | 'pending'
}

interface ChainConfig {
  chainId: string
  rpcEndpoint: string
  restEndpoint: string
  bech32Prefix: string
  chainName: string
  stakeCurrency: {
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
  }
}

export const useCosmosStore = defineStore('cosmos', () => {
  // State
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const walletInfo = ref<WalletInfo | null>(null)
  const chainInfo = ref<ChainConfig>({
    chainId: 'cosmoshub-4',
    rpcEndpoint: 'https://cosmos-api.cosmdev.com/rpc/atom',
    restEndpoint: 'https://cosmos-api.cosmdev.com/lcd/atom',
    bech32Prefix: 'cosmos',
    chainName: 'Cosmos Hub',
    stakeCurrency: {
      coinDenom: 'ATOM',
      coinMinimalDenom: 'uatom',
      coinDecimals: 6,
    },
  })
  const transactions = ref<Transaction[]>([])
  const lastError = ref<string | null>(null)

  // Wallet availability
  const keplrInstalled = ref(false)
  const leapInstalled = ref(false)

  // Loading states
  const isQuerying = ref(false)
  const isSending = ref(false)

  // Getters
  const isWalletAvailable = computed(() => keplrInstalled.value || leapInstalled.value)
  const formattedBalance = computed(() => {
    if (!walletInfo.value?.balance) return '0'
    const balance = Number.parseFloat(walletInfo.value.balance)
    return (balance / 1000000).toFixed(6) // Convert from uatom to ATOM
  })

  // Actions
  const setWalletAvailability = (keplr: boolean, leap: boolean) => {
    keplrInstalled.value = keplr
    leapInstalled.value = leap
  }

  const setConnecting = (connecting: boolean) => {
    isConnecting.value = connecting
  }

  const setConnected = (connected: boolean) => {
    isConnected.value = connected
    if (!connected) {
      walletInfo.value = null
      transactions.value = []
    }
  }

  const setWalletInfo = (info: WalletInfo) => {
    walletInfo.value = info
    isConnected.value = true
  }

  const updateBalance = (balance: string) => {
    if (walletInfo.value) {
      walletInfo.value.balance = balance
    }
  }

  const setChainConfig = (config: Partial<ChainConfig>) => {
    chainInfo.value = { ...chainInfo.value, ...config }
  }

  const addTransaction = (transaction: Transaction) => {
    transactions.value.unshift(transaction)
    // Keep only last 20 transactions
    if (transactions.value.length > 20) {
      transactions.value = transactions.value.slice(0, 20)
    }
  }

  const updateTransactionStatus = (hash: string, status: 'success' | 'failed') => {
    const tx = transactions.value.find(t => t.hash === hash)
    if (tx) {
      tx.status = status
    }
  }

  const setError = (error: string | null) => {
    lastError.value = error
  }

  const clearError = () => {
    lastError.value = null
  }

  const setQuerying = (querying: boolean) => {
    isQuerying.value = querying
  }

  const setSending = (sending: boolean) => {
    isSending.value = sending
  }

  const disconnect = () => {
    isConnected.value = false
    walletInfo.value = null
    transactions.value = []
    lastError.value = null
    isConnecting.value = false
    isQuerying.value = false
    isSending.value = false
  }

  const reset = () => {
    disconnect()
    keplrInstalled.value = false
    leapInstalled.value = false
  }

  return {
    // State
    isConnected,
    isConnecting,
    walletInfo,
    chainInfo,
    transactions,
    lastError,
    keplrInstalled,
    leapInstalled,
    isQuerying,
    isSending,

    // Getters
    isWalletAvailable,
    formattedBalance,

    // Actions
    setWalletAvailability,
    setConnecting,
    setConnected,
    setWalletInfo,
    updateBalance,
    setChainConfig,
    addTransaction,
    updateTransactionStatus,
    setError,
    clearError,
    setQuerying,
    setSending,
    disconnect,
    reset,
  }
})
