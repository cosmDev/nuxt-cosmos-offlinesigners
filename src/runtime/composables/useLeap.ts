import { computed } from 'vue'
import { SigningStargateClient } from '@cosmjs/stargate'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import type { CosmosWallet, WalletInfo, ChainInfo, CosmosMessage, CosmosFee } from '../types'
import { useRuntimeConfig } from '#app'

export const useLeap = () => {
  const config = useRuntimeConfig()
  const cosmosConfig = config.public.cosmosOfflineSigners

  const isInstalled = computed(() => {
    if (import.meta.client) {
      return !!window.leap
    }
    return false
  })

  const getChainInfo = (): ChainInfo => ({
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
  })

  const leapWallet: CosmosWallet = {
    name: 'Leap',
    isInstalled: isInstalled.value,

    async connect(): Promise<WalletInfo> {
      if (!window.leap) {
        throw new Error('Leap Wallet is not installed')
      }

      const chainInfo = getChainInfo()

      try {
        // Try to get the chain, if it fails, suggest the chain
        try {
          await window.leap.getKey(chainInfo.chainId)
        }
        catch {
          await window.leap.experimentalSuggestChain(chainInfo)
        }

        // Enable the chain
        await window.leap.enable(chainInfo.chainId)

        // Get account info
        const key = await window.leap.getKey(chainInfo.chainId)

        // Get balance (optional)
        let balance = '0'
        try {
          const offlineSigner = window.leap.getOfflineSigner(chainInfo.chainId)
          const client = await SigningStargateClient.connectWithSigner(
            chainInfo.rpc,
            offlineSigner,
          )
          const balanceResult = await client.getBalance(key.bech32Address, chainInfo.stakeCurrency.coinMinimalDenom)
          balance = balanceResult.amount
        }
        catch (err) {
          console.warn('Failed to fetch balance:', err)
        }

        return {
          name: 'Leap',
          address: key.bech32Address,
          balance,
          isConnected: true,
        }
      }
      catch (error) {
        console.error('Leap connection failed:', error)
        throw error
      }
    },

    async disconnect(): Promise<void> {
      // Leap doesn't have a disconnect method, we just clear the local state
      console.log('Leap disconnected')
    },

    async getOfflineSigner(chainId: string) {
      if (!window.leap) {
        throw new Error('Leap Wallet is not installed')
      }
      return window.leap.getOfflineSigner(chainId) as OfflineDirectSigner
    },

    async getAccount(chainId: string) {
      if (!window.leap) {
        throw new Error('Leap Wallet is not installed')
      }
      const key = await window.leap.getKey(chainId)
      return {
        address: key.bech32Address,
        pubkey: key.pubKey,
      }
    },

    async signAndBroadcast(msgs: CosmosMessage[], fee: CosmosFee, memo = '') {
      if (!window.leap) {
        throw new Error('Leap Wallet is not installed')
      }

      const chainInfo = getChainInfo()
      const offlineSigner = window.leap.getOfflineSigner(chainInfo.chainId)
      const client = await SigningStargateClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
      )

      const accounts = await offlineSigner.getAccounts()
      const result = await client.signAndBroadcast(accounts[0].address, msgs, fee, memo)

      return result.transactionHash
    },
  }

  return {
    isInstalled,
    wallet: leapWallet,
    openLeapStore: () => {
      if (import.meta.client) {
        window.open('https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg', '_blank')
      }
    },
  }
}
