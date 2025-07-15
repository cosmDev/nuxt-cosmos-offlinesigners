import { ref, computed, readonly } from 'vue'
import type { SigningStargateClient, Coin } from '@cosmjs/stargate'
import type { CosmosMessage } from '../types'
import { useRuntimeConfig } from '#app'

export interface TransactionOptions {
  fee?: {
    amount: Coin[]
    gas: string
  }
  memo?: string
}

export interface SendOptions extends TransactionOptions {
  recipient: string
  amount: Coin[]
}

export interface DelegateOptions extends TransactionOptions {
  validatorAddress: string
  amount: Coin
}

export interface VoteOptions extends TransactionOptions {
  proposalId: string
  option: number // 1 = Yes, 2 = Abstain, 3 = No, 4 = NoWithVeto
}

export const useCosmosTransactions = () => {
  const config = useRuntimeConfig()
  const cosmosConfig = config.public.cosmosOfflineSigners

  const isProcessing = ref(false)
  const isQuerying = ref(false)
  const lastTransaction = ref<string | null>(null)
  const error = ref<string | null>(null)

  // Default fee
  const defaultFee = computed(() => ({
    amount: [{ denom: 'uatom', amount: '5000' }],
    gas: '200000',
  }))

  const createSendTransaction = async (
    fromAddress: string,
    options: SendOptions,
  ) => {
    return [{
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress,
        toAddress: options.recipient,
        amount: options.amount,
      },
    }]
  }

  const createDelegateTransaction = async (
    delegatorAddress: string,
    options: DelegateOptions,
  ) => {
    return [{
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: {
        delegatorAddress,
        validatorAddress: options.validatorAddress,
        amount: options.amount,
      },
    }]
  }

  const createUndelegateTransaction = async (
    delegatorAddress: string,
    options: DelegateOptions,
  ) => {
    return [{
      typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
      value: {
        delegatorAddress,
        validatorAddress: options.validatorAddress,
        amount: options.amount,
      },
    }]
  }

  const createVoteTransaction = async (
    voterAddress: string,
    options: VoteOptions,
  ) => {
    return [{
      typeUrl: '/cosmos.gov.v1beta1.MsgVote',
      value: {
        voter: voterAddress,
        proposalId: options.proposalId,
        option: options.option,
      },
    }]
  }

  const estimateGas = async (
    client: SigningStargateClient,
    signerAddress: string,
    messages: CosmosMessage[],
    memo = '',
  ) => {
    try {
      const gasEstimation = await client.simulate(signerAddress, messages, memo)
      // Add 20% buffer to gas estimation
      const gasWanted = Math.ceil(gasEstimation * 1.2)
      return gasWanted.toString()
    }
    catch (err) {
      console.warn('Gas estimation failed, using default:', err)
      return defaultFee.value.gas
    }
  }

  const calculateFee = (gasLimit: string, gasPrice = '0.025'): { amount: Coin[], gas: string } => {
    const gasPriceNum = Number.parseFloat(gasPrice)
    const gasLimitNum = Number.parseInt(gasLimit)
    const feeAmount = Math.ceil(gasPriceNum * gasLimitNum)

    return {
      amount: [{ denom: 'uatom', amount: feeAmount.toString() }],
      gas: gasLimit,
    }
  }

  const sendTokens = async (
    client: SigningStargateClient,
    fromAddress: string,
    options: SendOptions,
  ) => {
    isProcessing.value = true
    error.value = null

    try {
      const messages = await createSendTransaction(fromAddress, options)
      const fee = options.fee || defaultFee.value
      const memo = options.memo || 'Send tokens via Nuxt Cosmos module'

      const result = await client.signAndBroadcast(fromAddress, messages, fee, memo)
      lastTransaction.value = result.transactionHash

      return result
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Transaction failed'
      throw err
    }
    finally {
      isProcessing.value = false
    }
  }

  const delegateTokens = async (
    client: SigningStargateClient,
    delegatorAddress: string,
    options: DelegateOptions,
  ) => {
    isProcessing.value = true
    error.value = null

    try {
      const messages = await createDelegateTransaction(delegatorAddress, options)
      const fee = options.fee || defaultFee.value
      const memo = options.memo || 'Delegate tokens via Nuxt Cosmos module'

      const result = await client.signAndBroadcast(delegatorAddress, messages, fee, memo)
      lastTransaction.value = result.transactionHash

      return result
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Delegation failed'
      throw err
    }
    finally {
      isProcessing.value = false
    }
  }

  const undelegateTokens = async (
    client: SigningStargateClient,
    delegatorAddress: string,
    options: DelegateOptions,
  ) => {
    isProcessing.value = true
    error.value = null

    try {
      const messages = await createUndelegateTransaction(delegatorAddress, options)
      const fee = options.fee || defaultFee.value
      const memo = options.memo || 'Undelegate tokens via Nuxt Cosmos module'

      const result = await client.signAndBroadcast(delegatorAddress, messages, fee, memo)
      lastTransaction.value = result.transactionHash

      return result
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Undelegation failed'
      throw err
    }
    finally {
      isProcessing.value = false
    }
  }

  const vote = async (
    client: SigningStargateClient,
    voterAddress: string,
    options: VoteOptions,
  ) => {
    isProcessing.value = true
    error.value = null

    try {
      const messages = await createVoteTransaction(voterAddress, options)
      const fee = options.fee || defaultFee.value
      const memo = options.memo || 'Vote via Nuxt Cosmos module'

      const result = await client.signAndBroadcast(voterAddress, messages, fee, memo)
      lastTransaction.value = result.transactionHash

      return result
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Vote failed'
      throw err
    }
    finally {
      isProcessing.value = false
    }
  }

  const getBalance = async (
    address: string,
    denom = 'uatom',
  ) => {
    try {
      const response = await fetch(`${cosmosConfig.restEndpoint}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`)
      const data = await response.json()
      return data.balance?.amount || '0'
    }
    catch (err) {
      console.error('Failed to fetch balance:', err)
      return '0'
    }
  }

  const getDelegations = async (delegatorAddress: string) => {
    try {
      const response = await fetch(`${cosmosConfig.restEndpoint}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`)
      const data = await response.json()
      return data.delegation_responses || []
    }
    catch (err) {
      console.error('Failed to fetch delegations:', err)
      return []
    }
  }

  const getValidators = async () => {
    try {
      const response = await fetch(`${cosmosConfig.restEndpoint}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED`)
      const data = await response.json()
      return data.validators || []
    }
    catch (err) {
      console.error('Failed to fetch validators:', err)
      return []
    }
  }

  const getProposals = async () => {
    try {
      const response = await fetch(`${cosmosConfig.restEndpoint}/cosmos/gov/v1beta1/proposals`)
      const data = await response.json()
      return data.proposals || []
    }
    catch (err) {
      console.error('Failed to fetch proposals:', err)
      return []
    }
  }

  return {
    // State
    isProcessing: readonly(isProcessing),
    isQuerying: readonly(isQuerying),
    lastTransaction: readonly(lastTransaction),
    error: readonly(error),
    defaultFee,

    // Transaction creators
    createSendTransaction,
    createDelegateTransaction,
    createUndelegateTransaction,
    createVoteTransaction,

    // Utilities
    estimateGas,
    calculateFee,

    // Actions
    sendTokens,
    delegateTokens,
    undelegateTokens,
    vote,

    // Queries
    getBalance,
    getDelegations,
    getValidators,
    getProposals,
  }
}
