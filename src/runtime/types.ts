// Types for Cosmos wallet functionality
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface WalletInfo {
  name: string
  address: string
  balance?: string
  isConnected: boolean
}

export interface ChainInfo {
  chainId: string
  chainName: string
  rpc: string
  rest: string
  bip44: {
    coinType: number
  }
  bech32Config: {
    bech32PrefixAccAddr: string
    bech32PrefixAccPub: string
    bech32PrefixValAddr: string
    bech32PrefixValPub: string
    bech32PrefixConsAddr: string
    bech32PrefixConsPub: string
  }
  currencies: Array<{
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
    coinGeckoId?: string
  }>
  feeCurrencies: Array<{
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
    coinGeckoId?: string
    gasPriceStep?: {
      low: number
      average: number
      high: number
    }
  }>
  stakeCurrency: {
    coinDenom: string
    coinMinimalDenom: string
    coinDecimals: number
    coinGeckoId?: string
  }
}

export interface CosmosMessage {
  typeUrl: string
  value: Record<string, unknown>
}

export interface CosmosFee {
  amount: Array<{ denom: string, amount: string }>
  gas: string
}

export interface CosmosWallet {
  name: string
  isInstalled: boolean
  connect: () => Promise<WalletInfo>
  disconnect: () => Promise<void>
  getOfflineSigner: (chainId: string) => Promise<any>
  getAccount: (chainId: string) => Promise<{ address: string, pubkey: Uint8Array }>
  signAndBroadcast: (msgs: CosmosMessage[], fee: CosmosFee, memo?: string) => Promise<string>
}
