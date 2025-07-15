<template>
  <div class="advanced-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">⚛️</div>
        <h1>Advanced Cosmos Demo</h1>
        <p>Explore advanced features of the Nuxt Cosmos Offline Signers module with our interactive demo.</p>
      </div>
      <div class="hero-background">
        <div class="cosmic-particle"></div>
        <div class="cosmic-particle"></div>
        <div class="cosmic-particle"></div>
      </div>
    </div>

    <section class="login-section">
        <div class="connection-status">
            <div class="status-card" :class="{ 'connected': isConnected, 'not-connected': !isConnected }">
                <div class="status-visual">
                    <div class="status-ring" :class="{ 'pulse': isConnecting }">
                        <div class="status-icon">
                            <svg v-if="isConnected" viewBox="0 0 24 24" fill="currentColor" class="status-svg">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="currentColor" class="status-svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="status-content">
                    <h3>{{ isConnected ? 'Wallet Connected' : 'Wallet Not Connected' }}</h3>
                    <p v-if="isConnected && walletInfo" class="connection-details">
                        <span class="address-label">Address:</span>
                        <code class="address-code">{{ formatAddress(walletInfo.address) }}</code>
                        <span class="wallet-label">Wallet:</span>
                        <span class="wallet-name">{{ walletInfo.name || 'Unknown' }}</span>
                    </p>
                    <p v-else class="connection-prompt">
                        Connect your Cosmos wallet to unlock all features
                    </p>
                </div>
            </div>
        </div>

        <div class="wallet-section">
            <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" class="section-icon">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                Connect Wallet
            </h3>
            <div class="button-group">
                <button
                    v-if="!isConnected"
                    :disabled="isConnecting"
                    class="connect-btn keplr-btn"
                    @click="connectKeplr"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    {{ isConnecting ? 'Connecting...' : 'Connect Keplr' }}
                </button>
                <button
                    v-if="!isConnected && keplrInstalled"
                    :disabled="isConnecting"
                    class="connect-btn leap-btn"
                    @click="connectKeplr"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon">
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                    </svg>
                    {{ isConnecting ? 'Connecting...' : 'Connect Leap' }}
                </button>
                <button
                    v-if="isConnected"
                    class="disconnect-btn"
                    @click="disconnect"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Disconnect
                </button>
            </div>
        </div>
    </section>
 
    <section class="api-examples">
      <div class="section-header">
        <h2 class="section-title">
          <svg viewBox="0 0 24 24" fill="currentColor" class="section-icon">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
          API Examples
        </h2>
        <p class="section-description">Interact with the Cosmos blockchain through these live examples</p>
      </div>

      <div class="example-grid">
        <div class="example-card balance-card">
          <div class="card-header">
            <div class="card-icon balance-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
            <h3>Query Balance</h3>
            <p class="card-description">Check your wallet's ATOM balance</p>
          </div>
          <div class="card-actions">
            <button
              :disabled="!isConnected || isQuerying"
              @click="queryBalance"
              class="action-btn primary-btn"
            >
              <span v-if="isQuerying" class="loading-spinner"></span>
              {{ isQuerying ? 'Querying...' : 'Query Balance' }}
            </button>
          </div>
          <div v-if="balanceResult" class="result-display balance-result">
            <div class="result-label">Balance:</div>
            <div class="result-value">{{ balanceResult }}</div>
          </div>
        </div>

        <div class="example-card delegations-card">
          <div class="card-header">
            <div class="card-icon delegations-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3>Get Delegations</h3>
            <p class="card-description">View your staking delegations</p>
          </div>
          <div class="card-actions">
            <button
              :disabled="!isConnected || isQuerying"
              @click="getDelegations"
              class="action-btn secondary-btn"
            >
              <span v-if="isQuerying" class="loading-spinner"></span>
              {{ isQuerying ? 'Loading...' : 'Get Delegations' }}
            </button>
          </div>
          <div v-if="delegationsResult" class="result-display">
            <pre class="json-result">{{ JSON.stringify(delegationsResult, null, 2) }}</pre>
          </div>
        </div>

        <div class="example-card validators-card">
          <div class="card-header">
            <div class="card-icon validators-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.3-1.74-2.46-1.74s-2.12.72-2.46 1.74L13.5 16H16v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2.5 16v-6H10l-2.54-7.63C7.12 7.35 6.16 6.63 5 6.63s-2.12.72-2.46 1.74L0 16h2.5v6h5.5z"/>
              </svg>
            </div>
            <h3>List Validators</h3>
            <p class="card-description">Browse active validators</p>
          </div>
          <div class="card-actions">
            <button
              :disabled="isQuerying"
              @click="getValidators"
              class="action-btn accent-btn"
            >
              <span v-if="isQuerying" class="loading-spinner"></span>
              {{ isQuerying ? 'Loading...' : 'Get Validators' }}
            </button>
          </div>
          <div v-if="validatorsResult" class="result-display validators-result">
            <div class="validators-list">
              <div
                v-for="validator in validatorsResult.slice(0, 5)"
                :key="validator.operator_address"
                class="validator-item"
              >
                <div class="validator-info">
                  <strong class="validator-name">{{ validator.description.moniker }}</strong>
                  <code class="validator-address">{{ formatAddress(validator.operator_address) }}</code>
                </div>
                <div class="validator-badge">Active</div>
              </div>
            </div>
          </div>
        </div>

        <div class="example-card proposals-card">
          <div class="card-header">
            <div class="card-icon proposals-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h3>Governance Proposals</h3>
            <p class="card-description">View governance proposals</p>
          </div>
          <div class="card-actions">
            <button
              :disabled="isQuerying"
              @click="getProposals"
              class="action-btn warning-btn"
            >
              <span v-if="isQuerying" class="loading-spinner"></span>
              {{ isQuerying ? 'Loading...' : 'Get Proposals' }}
            </button>
          </div>
          <div v-if="proposalsResult" class="result-display proposals-result">
            <div class="proposals-list">
              <div
                v-for="proposal in proposalsResult.slice(0, 3)"
                :key="proposal.proposal_id"
                class="proposal-item"
              >
                <div class="proposal-header">
                  <span class="proposal-id">#{{ proposal.proposal_id }}</span>
                  <span class="proposal-status" :class="proposal.status.toLowerCase()">{{ proposal.status }}</span>
                </div>
                <h4 class="proposal-title">{{ proposal.content.title }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="utilities-demo">
      <div class="section-header">
        <h2 class="section-title">
          <svg viewBox="0 0 24 24" fill="currentColor" class="section-icon">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
          Utility Functions Demo
        </h2>
        <p class="section-description">Test and explore various utility functions for Cosmos development</p>
      </div>

      <div class="utility-examples">
        <div class="utility-card address-card">
          <div class="utility-header">
            <div class="utility-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <h4>Address Formatting</h4>
          </div>
          <div class="utility-content">
            <div class="input-group">
              <label for="address-input">Cosmos Address</label>
              <input
                id="address-input"
                v-model="testAddress"
                placeholder="Enter cosmos address"
                class="utility-input"
              >
            </div>
            <div class="utility-results">
              <div class="result-item">
                <span class="result-label">Formatted:</span>
                <code class="result-code">{{ formatAddress(testAddress) }}</code>
              </div>
              <div class="result-item">
                <span class="result-label">Valid:</span>
                <span class="validation-badge" :class="{ 'valid': isValidCosmosAddress(testAddress), 'invalid': !isValidCosmosAddress(testAddress) }">
                  {{ isValidCosmosAddress(testAddress) ? '✅ Valid' : '❌ Invalid' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="utility-card amount-card">
          <div class="utility-header">
            <div class="utility-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
            <h4>Amount Conversion</h4>
          </div>
          <div class="utility-content">
            <div class="input-group">
              <label for="amount-input">ATOM Amount</label>
              <input
                id="amount-input"
                v-model="testAmount"
                placeholder="Enter ATOM amount"
                type="number"
                class="utility-input"
                step="0.000001"
              >
            </div>
            <div class="utility-results">
              <div class="conversion-result">
                <div class="conversion-item">
                  <span class="conversion-amount">{{ testAmount }} ATOM</span>
                  <span class="conversion-arrow">→</span>
                  <code class="conversion-code">{{ atomToUatom(testAmount) }} uatom</code>
                </div>
                <div class="conversion-item reverse">
                  <code class="conversion-code">{{ atomToUatom(testAmount) }} uatom</code>
                  <span class="conversion-arrow">→</span>
                  <span class="conversion-amount">{{ uatomToAtom(atomToUatom(testAmount)) }} ATOM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="utility-card hash-card">
          <div class="utility-header">
            <div class="utility-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
              </svg>
            </div>
            <h4>Hash Utilities</h4>
          </div>
          <div class="utility-content">
            <div class="input-group">
              <label for="hash-input">Transaction Hash</label>
              <input
                id="hash-input"
                v-model="testHash"
                placeholder="Enter transaction hash"
                class="utility-input"
              >
            </div>
            <div class="utility-results">
              <div class="result-item">
                <span class="result-label">Truncated:</span>
                <code class="result-code">{{ truncateHash(testHash) }}</code>
              </div>
              <button
                class="copy-button"
                @click="copyHash"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="copy-icon">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { isInstalled: keplrInstalled, wallet: keplrWallet } = useKeplr()
const { connectWallet, disconnectWallet, isConnected, walletInfo, isConnecting } = useCosmosWallet()
const {
  getBalance,
  getDelegations: getDelegationsQuery,
  getValidators: getValidatorsQuery,
  getProposals: getProposalsQuery
} = useCosmosTransactions() 

// Local state for demo results and loading
const isQuerying = ref(false)
const balanceResult = ref('')
const delegationsResult = ref(null)
const validatorsResult = ref(null)
const proposalsResult = ref(null)

// Utility demo state
const testAddress = ref('cosmos1abc123def456ghi789jkl012mno345pqr678stu')
const testAmount = ref('1.5')
const testHash = ref('A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2')

// Methods
const connectKeplr = async () => {
  try {
    await connectWallet(walletInfo.value?.address || keplrWallet)
  }
  catch {
    console.error('Failed to connect Keplr wallet')
    //error.value = 'Failed to connect Keplr wallet'
  }
}

const disconnect = async () => {
  try {
    await disconnectWallet()
  }
  catch (err) {
    console.error('Failed to disconnect wallet:', err)
  }
}
const queryBalance = async () => {
  if (!isConnected.value || !walletInfo.value?.address) return

  isQuerying.value = true
  try {
    const balance = await getBalance(walletInfo.value.address)
    balanceResult.value = `${formatBalance(balance)} ATOM`
  }
  catch (err) {
    balanceResult.value = `Error: ${err.message}`
  }
  finally {
    isQuerying.value = false
  }
}

const getDelegations = async () => {
  if (!isConnected.value || !walletInfo.value?.address) return

  isQuerying.value = true
  try {
    const delegations = await getDelegationsQuery(walletInfo.value.address)
    delegationsResult.value = delegations
  }
  catch (err) {
    delegationsResult.value = { error: err.message }
  }
  finally {
    isQuerying.value = false
  }
}

const getValidators = async () => {
  isQuerying.value = true
  try {
    const validators = await getValidatorsQuery()
    validatorsResult.value = validators
  }
  catch (err) {
    validatorsResult.value = [{ error: err.message }]
  }
  finally {
    isQuerying.value = false
  }
}

const getProposals = async () => {
  isQuerying.value = true
  try {
    const proposals = await getProposalsQuery()
    proposalsResult.value = proposals
  }
  catch (err) {
    proposalsResult.value = [{ error: err.message }]
  }
  finally {
    isQuerying.value = false
  }
}

const copyHash = async () => {
  const success = await copyToClipboard(testHash.value)
  if (success) {
    alert('Hash copied to clipboard!')
  }
  else {
    alert('Failed to copy hash')
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.advanced-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cosmic-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.cosmic-particle:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.cosmic-particle:nth-child(2) {
  top: 60%;
  right: 30%;
  animation-delay: 2s;
}

.cosmic-particle:nth-child(3) {
  bottom: 30%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.25rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 0;
}

/* Main Content */
.login-section,
.api-examples,
.utilities-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.section-icon {
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.9;
}

.section-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Status Card */
.status-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 2rem;
  transition: all 0.3s ease;
}

.status-card.connected {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.status-card.not-connected {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
  border-color: rgba(245, 158, 11, 0.3);
}

.status-visual {
  flex-shrink: 0;
}

.status-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  position: relative;
}

.status-card.not-connected .status-ring {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.status-ring.pulse {
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
}

.status-svg {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}

.status-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.connection-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
}

.address-label,
.wallet-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
}

.address-code {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
}

.wallet-name {
  color: #1f2937;
  font-weight: 600;
}

.connection-prompt {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Wallet Section */
.wallet-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.wallet-section .section-title {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.connect-btn,
.disconnect-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.keplr-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.keplr-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.4);
}

.leap-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
}

.leap-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(245, 87, 108, 0.4);
}

.disconnect-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.disconnect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(239, 68, 68, 0.4);
}

.connect-btn:disabled,
.disconnect-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Example Grid */
.example-grid,
.utility-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.example-card,
.utility-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.example-card:hover,
.utility-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Card Headers */
.card-header,
.utility-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon,
.utility-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.balance-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.delegations-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.validators-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.proposals-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.utility-icon {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
}

.card-icon svg,
.utility-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.card-header h3,
.utility-header h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-description {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

/* Action Buttons */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.primary-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.secondary-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.accent-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.warning-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Result Displays */
.result-display {
  margin-top: 1rem;
}

.balance-result .result-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
}

.balance-result .result-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
  font-family: 'Monaco', 'Menlo', monospace;
}

.json-result {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.85rem;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  color: #374151;
}

/* Validators Result */
.validators-result .validators-list {
  max-height: 250px;
  overflow-y: auto;
}

.validator-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.validator-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.validator-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.validator-name {
  color: #1f2937;
  font-size: 1rem;
}

.validator-address {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.validator-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Proposals Result */
.proposals-result .proposals-list {
  max-height: 250px;
  overflow-y: auto;
}

.proposal-item {
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.proposal-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.proposal-id {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.proposal-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.proposal-status.passed {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.proposal-status.voting {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.proposal-status.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.proposal-title {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

/* Utility Cards */
.utility-content {
  margin-top: 1.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.utility-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.utility-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Utility Results */
.utility-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
  min-width: 80px;
}

.result-code {
  background: rgba(102, 126, 234, 0.1);
  color: #5046e4;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85rem;
  flex: 1;
}

.validation-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.validation-badge.valid {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.validation-badge.invalid {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Amount Conversion */
.conversion-result {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conversion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.conversion-item.reverse {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.conversion-amount {
  font-weight: 600;
  color: #1f2937;
  min-width: 100px;
}

.conversion-arrow {
  color: #667eea;
  font-weight: bold;
  font-size: 1.2rem;
}

.conversion-code {
  background: rgba(102, 126, 234, 0.1);
  color: #5046e4;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  flex: 1;
}

/* Copy Button */
.copy-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.copy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
}

.copy-icon {
  width: 1rem;
  height: 1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .status-card {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .advanced-page {
    padding: 0;
  }

  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .login-section,
  .api-examples,
  .utilities-demo {
    padding: 1rem;
  }

  .section-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .example-grid,
  .utility-examples {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .example-card,
  .utility-card {
    padding: 1.5rem;
  }

  .status-ring {
    width: 60px;
    height: 60px;
  }

  .status-svg {
    width: 2rem;
    height: 2rem;
  }

  .button-group {
    flex-direction: column;
  }

  .conversion-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .conversion-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.75rem;
  }

  .card-header,
  .utility-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .validator-item,
  .proposal-item {
    padding: 0.75rem;
  }

  .proposal-header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
