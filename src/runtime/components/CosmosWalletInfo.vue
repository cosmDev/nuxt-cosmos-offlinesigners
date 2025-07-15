<template>
  <div class="cosmos-wallet-info">
    <div
      v-if="isConnected && walletInfo"
      class="wallet-details"
    >
      <h3 class="title">
        Wallet Information
      </h3>

      <div class="info-card">
        <div class="info-row">
          <span class="label">Wallet:</span>
          <span class="value">{{ walletInfo.name }}</span>
        </div>

        <div class="info-row">
          <span class="label">Address:</span>
          <div class="address-container">
            <span class="value address">{{ truncatedAddress }}</span>
            <button
              class="copy-button"
              :title="copied ? 'Copied!' : 'Copy address'"
              @click="copyAddress"
            >
              {{ copied ? '✅' : '📋' }}
            </button>
          </div>
        </div>

        <div
          v-if="walletInfo.balance"
          class="info-row"
        >
          <span class="label">Balance:</span>
          <span class="value">{{ formattedBalance }} {{ chainInfo.stakeCurrency.coinDenom }}</span>
        </div>

        <div class="info-row">
          <span class="label">Chain:</span>
          <span class="value">{{ chainInfo.chainName }} ({{ chainInfo.chainId }})</span>
        </div>

        <div class="info-row">
          <span class="label">Status:</span>
          <span class="value status connected">🟢 Connected</span>
        </div>
      </div>

      <div class="actions">
        <button
          :disabled="isRefreshing"
          class="refresh-button"
          @click="refreshBalance"
        >
          <span v-if="isRefreshing">⏳</span>
          <span v-else>🔄</span>
          {{ isRefreshing ? 'Refreshing...' : 'Refresh Balance' }}
        </button>

        <button
          class="disconnect-button"
          @click="disconnect"
        >
          🔌 Disconnect
        </button>
      </div>

      <!-- Demo Transaction Section -->
      <div
        v-if="showDemo"
        class="demo-section"
      >
        <h4 class="demo-title">
          Demo Transaction
        </h4>
        <div class="demo-form">
          <input
            v-model="demoRecipient"
            placeholder="Recipient address"
            class="demo-input"
          >
          <input
            v-model="demoAmount"
            placeholder="Amount (in uatom)"
            type="number"
            class="demo-input"
          >
          <button
            :disabled="isSending || !demoRecipient || !demoAmount"
            class="demo-send-button"
            @click="sendDemo"
          >
            <span v-if="isSending">⏳</span>
            <span v-else>💸</span>
            {{ isSending ? 'Sending...' : 'Send Demo Transaction' }}
          </button>
        </div>

        <div
          v-if="transactionHash"
          class="transaction-result"
        >
          <p>✅ Transaction sent!</p>
          <p class="hash">
            Hash: {{ transactionHash }}
          </p>
        </div>

        <div
          v-if="transactionError"
          class="transaction-error"
        >
          ❌ {{ transactionError }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="not-connected"
    >
      <p>No wallet connected. Please connect a wallet first.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCosmosWallet } from '../composables/useCosmosWallet'

interface Props {
  showDemo?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  showDemo: false,
})

const {
  isConnected,
  walletInfo,
  chainInfo,
  disconnectWallet,
  signAndBroadcast,
} = useCosmosWallet()

// State
const copied = ref(false)
const isRefreshing = ref(false)
const isSending = ref(false)
const demoRecipient = ref('')
const demoAmount = ref('')
const transactionHash = ref('')
const transactionError = ref('')

// Computed
const truncatedAddress = computed(() => {
  if (!walletInfo.value?.address) return ''
  const addr = walletInfo.value.address
  return `${addr.slice(0, 10)}...${addr.slice(-8)}`
})

const formattedBalance = computed(() => {
  if (!walletInfo.value?.balance) return '0'
  const balance = Number.parseInt(walletInfo.value.balance)
  const decimals = chainInfo.value.stakeCurrency.coinDecimals
  return (balance / Math.pow(10, decimals)).toFixed(6)
})

// Methods
const copyAddress = async () => {
  if (!walletInfo.value?.address) return

  try {
    await navigator.clipboard.writeText(walletInfo.value.address)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy address:', err)
  }
}

const refreshBalance = async () => {
  isRefreshing.value = true
  try {
    // In a real implementation, you would refresh the balance here
    // For now, we'll just simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Balance refreshed (simulated)')
  }
  catch (err) {
    console.error('Failed to refresh balance:', err)
  }
  finally {
    isRefreshing.value = false
  }
}

const disconnect = async () => {
  try {
    await disconnectWallet()
  }
  catch (err) {
    console.error('Failed to disconnect:', err)
  }
}

const sendDemo = async () => {
  if (!demoRecipient.value || !demoAmount.value) return

  isSending.value = true
  transactionError.value = ''
  transactionHash.value = ''

  try {
    const amount = Number.parseInt(demoAmount.value)

    // Create a demo send message
    const msgs = [{
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: walletInfo.value?.address,
        toAddress: demoRecipient.value,
        amount: [{
          denom: chainInfo.value.stakeCurrency.coinMinimalDenom,
          amount: amount.toString(),
        }],
      },
    }]

    // Demo fee
    const fee = {
      amount: [{
        denom: chainInfo.value.stakeCurrency.coinMinimalDenom,
        amount: '5000',
      }],
      gas: '200000',
    }

    const txHash = await signAndBroadcast(msgs, fee, 'Demo transaction from Nuxt Cosmos module')
    transactionHash.value = txHash

    // Reset form
    demoRecipient.value = ''
    demoAmount.value = ''
  }
  catch (err) {
    transactionError.value = err instanceof Error ? err.message : 'Transaction failed'
    console.error('Demo transaction failed:', err)
  }
  finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.cosmos-wallet-info {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1a1a1a;
}

.info-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
  margin-right: 1rem;
}

.value {
  color: #1a1a1a;
  text-align: right;
  word-break: break-word;
}

.address-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.address {
  font-family: 'Monaco', 'Menlo', monospace;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.copy-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.copy-button:hover {
  background: #f0f0f0;
}

.status.connected {
  color: #2e7d32;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.refresh-button, .disconnect-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-button {
  background: #007AFF;
  color: white;
}

.refresh-button:hover:not(:disabled) {
  background: #0056CC;
}

.refresh-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.disconnect-button {
  background: #ff4757;
  color: white;
}

.disconnect-button:hover {
  background: #ff3838;
}

.demo-section {
  background: #f8f9ff;
  border: 1px solid #e3f2fd;
  border-radius: 12px;
  padding: 1.5rem;
}

.demo-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.demo-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.demo-input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.demo-send-button {
  padding: 0.75rem 1.5rem;
  background: #34c759;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.demo-send-button:hover:not(:disabled) {
  background: #28a745;
}

.demo-send-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.transaction-result {
  margin-top: 1rem;
  padding: 1rem;
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  color: #2e7d32;
}

.hash {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  word-break: break-all;
  margin-top: 0.5rem;
}

.transaction-error {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #c62828;
}

.not-connected {
  text-align: center;
  color: #666;
  padding: 2rem;
}
</style>
