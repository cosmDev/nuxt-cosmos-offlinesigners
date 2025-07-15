<template>
  <div class="simple-demo">
    <h2>Simple Cosmos Wallet Demo</h2>

    <section class="connection-section">
      <h3>Connect Wallet</h3>
      <div class="button-group">
        <button
          v-if="keplrInstalled"
          :disabled="isConnecting"
          class="connect-btn keplr-btn"
          @click="connectKeplr"
        >
          {{ isConnecting ? 'Connecting...' : 'Connect Keplr' }}
        </button>
        <button
          v-if="leapInstalled"
          :disabled="isConnecting"
          class="connect-btn leap-btn"
          @click="connectLeap"
        >
          {{ isConnecting ? 'Connecting...' : 'Connect Leap' }}
        </button>
      </div>
    </section>

    <section
      v-if="isConnected"
      class="wallet-section"
    >
      <h3>Wallet Information</h3>
      <div class="info-card">
        <p><strong>Wallet:</strong> {{ walletInfo?.name }}</p>
        <p><strong>Address:</strong> {{ formatAddress(walletInfo?.address || '') }}</p>
        <p><strong>Balance:</strong> {{ formattedBalance }} ATOM</p>
        <button
          class="disconnect-btn"
          @click="disconnect"
        >
          Disconnect
        </button>
      </div>
    </section>

    <section
      v-if="isConnected"
      class="transaction-section"
    >
      <h3>Send Transaction</h3>
      <div class="form-card">
        <input
          v-model="recipient"
          placeholder="Recipient address"
          class="form-input"
        >
        <input
          v-model="amount"
          placeholder="Amount (ATOM)"
          type="number"
          class="form-input"
        >
        <button
          :disabled="!canSend || isSending"
          class="send-btn"
          @click="sendTransaction"
        >
          {{ isSending ? 'Sending...' : 'Send ATOM' }}
        </button>
      </div>
    </section>

    <div
      v-if="transactionHash"
      class="success"
    >
      Transaction sent! Hash: {{ transactionHash }}
    </div>

    <div
      v-if="error"
      class="error"
    >
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const {
  isConnected,
  isConnecting,
  walletInfo,
  connectWallet,
  disconnectWallet,
  signAndBroadcast,
  error: walletError,
} = useCosmosWallet()

const { isInstalled: keplrInstalled, wallet: keplrWallet } = useKeplr()
const { isInstalled: leapInstalled, wallet: leapWallet } = useLeap()

// Form state
const recipient = ref('')
const amount = ref('')
const isSending = ref(false)
const transactionHash = ref('')
const error = ref('')

// Computed
const formattedBalance = computed(() => {
  if (!walletInfo.value?.balance) return '0'
  return formatBalance(walletInfo.value.balance, 6)
})

const canSend = computed(() => {
  return recipient.value && amount.value && Number.parseFloat(amount.value) > 0
})

// Methods
const connectKeplr = async () => {
  try {
    await connectWallet(keplrWallet)
  }
  catch {
    error.value = 'Failed to connect Keplr wallet'
  }
}

const connectLeap = async () => {
  try {
    await connectWallet(leapWallet)
  }
  catch {
    error.value = 'Failed to connect Leap wallet'
  }
}

const disconnect = async () => {
  try {
    await disconnectWallet()
    transactionHash.value = ''
    error.value = ''
  }
  catch {
    error.value = 'Failed to disconnect wallet'
  }
}

const sendTransaction = async () => {
  if (!canSend.value) return

  isSending.value = true
  error.value = ''
  transactionHash.value = ''

  try {
    const amountInUatom = atomToUatom(amount.value)

    const msgs = [{
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: walletInfo.value?.address,
        toAddress: recipient.value,
        amount: [{
          denom: 'uatom',
          amount: amountInUatom,
        }],
      },
    }]

    const fee = {
      amount: [{ denom: 'uatom', amount: '5000' }],
      gas: '200000',
    }

    const txHash = await signAndBroadcast(msgs, fee, 'Simple demo transaction')
    transactionHash.value = txHash

    // Reset form
    recipient.value = ''
    amount.value = ''
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Transaction failed'
  }
  finally {
    isSending.value = false
  }
}

// Watch for wallet errors
watch(walletError, (newError) => {
  if (newError) {
    error.value = newError
  }
})
</script>

<style scoped>
.simple-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.simple-demo h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

.simple-demo h3 {
  margin-bottom: 1rem;
  color: #333;
}

.connection-section,
.wallet-section,
.transaction-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
}

.connect-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.keplr-btn {
  background: #3b82f6;
  color: white;
}

.keplr-btn:hover:not(:disabled) {
  background: #2563eb;
}

.leap-btn {
  background: #f59e0b;
  color: white;
}

.leap-btn:hover:not(:disabled) {
  background: #d97706;
}

.connect-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.info-card,
.form-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card p {
  margin: 0.5rem 0;
}

.disconnect-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;
}

.disconnect-btn:hover {
  background: #dc2626;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #059669;
}

.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success {
  padding: 1rem;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
  margin-top: 1rem;
  word-break: break-all;
}

.error {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .simple-demo {
    padding: 1rem;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>
