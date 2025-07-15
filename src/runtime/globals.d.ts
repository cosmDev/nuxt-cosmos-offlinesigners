import type { Window as KeplrWindow } from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'

interface KeplrKey {
  bech32Address: string
  pubKey: Uint8Array
}

interface ChainInfo {
  chainId: string
  chainName: string
  rpc: string
  rest: string
}

interface LeapWallet {
  enable: (chainId: string) => Promise<void>
  getKey: (chainId: string) => Promise<KeplrKey>
  getOfflineSigner: (chainId: string) => OfflineDirectSigner
  experimentalSuggestChain: (chainInfo: ChainInfo) => Promise<void>
}

declare global {
  interface Window extends KeplrWindow {
    leap?: LeapWallet
  }
}

export {}
