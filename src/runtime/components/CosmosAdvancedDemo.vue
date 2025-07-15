<template>
  <div class="advanced-demo">
    <CosmosWalletConnect />
    <h3>🚀 Advanced Cosmos Integration Demo</h3>

    <div class="demo-grid">
      <!-- Wallet Status -->
      <div class="demo-card">
        <h4>📱 Wallet Status</h4>
        <div class="status-info">
          <p><strong>Connected:</strong> {{ isConnected ? '✅' : '❌' }}</p>
          <p><strong>Wallet:</strong> {{ walletInfo?.name || 'None' }}</p>
          <p><strong>Chain:</strong> {{ chainInfo.chainName }}</p>
          <p v-if="isConnected">
            <strong>Address:</strong> {{ formatAddress(walletInfo?.address || '') }}
          </p>
        </div>
      </div>

      <!-- Account Info -->
      <div
        v-if="isConnected"
        class="demo-card"
      >
        <h4>💰 Account Details</h4>
        <div class="account-info">
          <p><strong>Balance:</strong> {{ formatCoin(walletInfo?.balance || '0', 'ATOM') }}</p>
          <button
            :disabled="isLoading"
            class="refresh-btn"
            @click="refreshAccountInfo"
          >
            {{ isLoading ? '⏳ Loading...' : '🔄 Refresh' }}
          </button>
        </div>
      </div>

      <!-- Transaction Builder -->
      <div
        v-if="isConnected"
        class="demo-card"
      >
        <h4>📝 Transaction Builder</h4>
        <div class="tx-builder">
          <select
            v-model="selectedTxType"
            class="tx-select"
          >
            <option value="send">
              Send Tokens
            </option>
            <option value="delegate">
              Delegate
            </option>
            <option value="vote">
              Vote
            </option>
          </select>

          <div
            v-if="selectedTxType === 'send'"
            class="send-form"
          >
            <input
              v-model="sendForm.recipient"
              placeholder="Recipient address"
              class="form-input"
            >
            <input
              v-model="sendForm.amount"
              placeholder="Amount (ATOM)"
              type="number"
              class="form-input"
            >
            <input
              v-model="sendForm.memo"
              placeholder="Memo (optional)"
              class="form-input"
            >
          </div>

          <div
            v-if="selectedTxType === 'delegate'"
            class="delegate-form"
          >
            <input
              v-model="delegateForm.validator"
              placeholder="Validator address"
              class="form-input"
            >
            <input
              v-model="delegateForm.amount"
              placeholder="Amount (ATOM)"
              type="number"
              class="form-input"
            >
          </div>

          <div
            v-if="selectedTxType === 'vote'"
            class="vote-form"
          >
            <input
              v-model="voteForm.proposalId"
              placeholder="Proposal ID"
              type="number"
              class="form-input"
            >
            <select
              v-model="voteForm.option"
              class="form-input"
            >
              <option value="1">
                Yes
              </option>
              <option value="2">
                Abstain
              </option>
              <option value="3">
                No
              </option>
              <option value="4">
                No with Veto
              </option>
            </select>
          </div>

          <button
            :disabled="isLoading || !canSend"
            class="simulate-btn"
            @click="simulateTransaction"
          >
            {{ isLoading ? '⏳ Simulating...' : '🧪 Simulate Transaction' }}
          </button>

          <button
            :disabled="isLoading || !canSend"
            class="send-btn"
            @click="executeTransaction"
          >
            {{ isLoading ? '⏳ Sending...' : '💸 Send Transaction' }}
          </button>
        </div>
      </div>

      <!-- Transaction History -->
      <div
        v-if="isConnected && transactions.length > 0"
        class="demo-card"
      >
        <h4>📋 Recent Transactions</h4>
        <div class="tx-history">
          <div
            v-for="tx in transactions"
            :key="tx.hash"
            class="tx-item"
          >
            <div class="tx-info">
              <p><strong>Type:</strong> {{ tx.type }}</p>
              <p><strong>Hash:</strong> {{ truncateHash(tx.hash) }}</p>
              <p><strong>Status:</strong> {{ tx.status }}</p>
            </div>
            <button
              class="copy-btn"
              @click="copyToClipboard(tx.hash)"
            >
              📋
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div
      v-if="error"
      class="error-message"
    >
      ❌ {{ error }}
    </div>

    <!-- Success Display -->
    <div
      v-if="successMessage"
      class="success-message"
    >
      ✅ {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useCosmosWallet } from '../composables/useCosmosWallet'
import { formatAddress, formatCoin, truncateHash, copyToClipboard } from '../utils'

// Define transaction result interface
interface TransactionResult {
  transactionHash?: string
  hash?: string
  txhash?: string
  [key: string]: unknown
}

const {
  isConnected,
  walletInfo,
  chainInfo,
  signAndBroadcast,
  getAccount,
} = useCosmosWallet()

// State
const isLoading = ref(false)
const selectedTxType = ref('send')
const error = ref('')
const successMessage = ref('')
const transactions = ref<Array<{ hash: string, type: string, status: string }>>([])

// Form data
const sendForm = reactive({
  recipient: '',
  amount: '',
  memo: '',
})

const delegateForm = reactive({
  validator: '',
  amount: '',
})

const voteForm = reactive({
  proposalId: '',
  option: '1',
})

// Computed
const canSend = computed(() => {
  if (selectedTxType.value === 'send') {
    return sendForm.recipient && sendForm.amount
  }
  if (selectedTxType.value === 'delegate') {
    return delegateForm.validator && delegateForm.amount
  }
  if (selectedTxType.value === 'vote') {
    return voteForm.proposalId && voteForm.option
  }
  return false
})

// Methods
const refreshAccountInfo = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const account = await getAccount()
    console.log('Account info:', account)
    successMessage.value = 'Account info refreshed successfully'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to refresh account info'
  }
  finally {
    isLoading.value = false
  }
}

const simulateTransaction = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const msgs = await buildTransaction()
    console.log('Transaction simulation:', msgs)
    successMessage.value = 'Transaction simulation successful'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Simulation failed'
  }
  finally {
    isLoading.value = false
  }
}

const executeTransaction = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const msgs = await buildTransaction()
    const fee = {
      amount: [{ denom: 'uatom', amount: '5000' }],
      gas: '200000',
    }

    const result = await signAndBroadcast(msgs, fee, getMemo())
    let txHash: string

    // Handle different response formats
    if (typeof result === 'string') {
      txHash = result
    }
    else if (result && typeof result === 'object') {
      const txResult = result as TransactionResult
      txHash = txResult.transactionHash || txResult.hash || txResult.txhash || 'unknown'
    }
    else {
      txHash = 'unknown'
    }

    // Add to transaction history
    transactions.value.unshift({
      hash: txHash,
      type: selectedTxType.value,
      status: 'pending',
    })

    successMessage.value = `Transaction sent! Hash: ${truncateHash(txHash)}`
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)

    // Reset form
    resetForm()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Transaction failed'
  }
  finally {
    isLoading.value = false
  }
}

const buildTransaction = async () => {
  if (!walletInfo.value?.address) throw new Error('No wallet connected')

  if (selectedTxType.value === 'send') {
    const amount = Number.parseFloat(sendForm.amount) * 1000000 // Convert to uatom
    return [{
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: walletInfo.value.address,
        toAddress: sendForm.recipient,
        amount: [{
          denom: 'uatom',
          amount: amount.toString(),
        }],
      },
    }]
  }

  if (selectedTxType.value === 'delegate') {
    const amount = Number.parseFloat(delegateForm.amount) * 1000000 // Convert to uatom
    return [{
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: {
        delegatorAddress: walletInfo.value.address,
        validatorAddress: delegateForm.validator,
        amount: {
          denom: 'uatom',
          amount: amount.toString(),
        },
      },
    }]
  }

  if (selectedTxType.value === 'vote') {
    return [{
      typeUrl: '/cosmos.gov.v1beta1.MsgVote',
      value: {
        voter: walletInfo.value.address,
        proposalId: voteForm.proposalId,
        option: Number.parseInt(voteForm.option),
      },
    }]
  }

  throw new Error('Unknown transaction type')
}

const getMemo = () => {
  if (selectedTxType.value === 'send') return sendForm.memo
  return `${selectedTxType.value} transaction from Nuxt Cosmos module`
}

const resetForm = () => {
  if (selectedTxType.value === 'send') {
    sendForm.recipient = ''
    sendForm.amount = ''
    sendForm.memo = ''
  }
  else if (selectedTxType.value === 'delegate') {
    delegateForm.validator = ''
    delegateForm.amount = ''
  }
  else if (selectedTxType.value === 'vote') {
    voteForm.proposalId = ''
    voteForm.option = '1'
  }
}
</script>

<style scoped>
.advanced-demo {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.advanced-demo h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.demo-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.demo-card h4 {
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.status-info p,
.account-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.refresh-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.refresh-btn:hover:not(:disabled) {
  background: #0056CC;
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.tx-builder {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tx-select,
.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.tx-select:focus,
.form-input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.send-form,
.delegate-form,
.vote-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.simulate-btn,
.send-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.simulate-btn {
  background: #34c759;
  color: white;
}

.simulate-btn:hover:not(:disabled) {
  background: #28a745;
}

.send-btn {
  background: #ff9500;
  color: white;
}

.send-btn:hover:not(:disabled) {
  background: #e6850e;
}

.simulate-btn:disabled,
.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.tx-history {
  max-height: 200px;
  overflow-y: auto;
}

.tx-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.tx-info p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.copy-btn:hover {
  background: #e9ecef;
}

.error-message {
  padding: 1rem;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #c62828;
  margin-top: 1rem;
}

.success-message {
  padding: 1rem;
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  color: #2e7d32;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .advanced-demo {
    padding: 1rem;
  }
}
</style>
