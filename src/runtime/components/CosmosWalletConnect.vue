<template>
  <div class="cosmos-wallet-connect">
    <div
      v-if="!isConnected"
      class="wallet-selection"
    >
      <h3 class="title">
        Connect Your Cosmos Wallet
      </h3>
      <p class="subtitle">
        Choose a wallet to connect to the Cosmos network
      </p>

      <div class="wallet-buttons">
        <!-- Keplr Wallet -->
        <button
          v-if="keplrInstalled"
          :disabled="isConnecting"
          class="wallet-button keplr"
          @click="connectKeplr"
        >
          <div class="wallet-icon">
            🔵
          </div>
          <div class="wallet-info">
            <div class="wallet-name">
              Keplr Wallet
            </div>
            <div class="wallet-description">
              Browser extension wallet
            </div>
          </div>
          <div
            v-if="isConnecting"
            class="loading"
          >
            ⏳
          </div>
        </button>

        <button
          v-else
          class="wallet-button keplr disabled"
          @click="openKeplrStore"
        >
          <div class="wallet-icon">
            🔵
          </div>
          <div class="wallet-info">
            <div class="wallet-name">
              Keplr Wallet
            </div>
            <div class="wallet-description">
              Not installed - Click to install
            </div>
          </div>
        </button>

        <!-- Leap Wallet -->
        <button
          v-if="leapInstalled"
          :disabled="isConnecting"
          class="wallet-button leap"
          @click="connectLeap"
        >
          <div class="wallet-icon">
            🟠
          </div>
          <div class="wallet-info">
            <div class="wallet-name">
              Leap Wallet
            </div>
            <div class="wallet-description">
              Browser extension wallet
            </div>
          </div>
          <div
            v-if="isConnecting"
            class="loading"
          >
            ⏳
          </div>
        </button>

        <button
          v-else
          class="wallet-button leap disabled"
          @click="openLeapStore"
        >
          <div class="wallet-icon">
            🟠
          </div>
          <div class="wallet-info">
            <div class="wallet-name">
              Leap Wallet
            </div>
            <div class="wallet-description">
              Not installed - Click to install
            </div>
          </div>
        </button>
      </div>

      <div
        v-if="error"
        class="error"
      >
        ❌ {{ error }}
      </div>
    </div>

    <div
      v-else
      class="connected"
    >
      <div class="success-message">
        ✅ Successfully connected to {{ walletInfo?.name }}
      </div>
      <button
        class="disconnect-button"
        @click="disconnect"
      >
        Disconnect Wallet
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCosmosWallet } from '../composables/useCosmosWallet'
import { useKeplr } from '../composables/useKeplr'
import { useLeap } from '../composables/useLeap'

const {
  connectWallet,
  disconnectWallet,
  isConnected,
  isConnecting,
  walletInfo,
  error,
} = useCosmosWallet()

const { isInstalled: keplrInstalled, wallet: keplrWallet, openKeplrStore } = useKeplr()
const { isInstalled: leapInstalled, wallet: leapWallet, openLeapStore } = useLeap()

const connectKeplr = async () => {
  try {
    await connectWallet(keplrWallet)
  }
  catch (err) {
    console.error('Failed to connect Keplr:', err)
  }
}

const connectLeap = async () => {
  try {
    await connectWallet(leapWallet)
  }
  catch (err) {
    console.error('Failed to connect Leap:', err)
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
</script>

<style scoped>
.cosmos-wallet-connect {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.wallet-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wallet-button {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.wallet-button:hover:not(.disabled):not(:disabled) {
  border-color: #007AFF;
  background: #f8f9ff;
  transform: translateY(-1px);
}

.wallet-button.disabled {
  opacity: 0.6;
  cursor: default;
}

.wallet-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wallet-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.wallet-info {
  flex: 1;
}

.wallet-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.wallet-description {
  color: #666;
  font-size: 0.9rem;
}

.loading {
  font-size: 1.2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #c62828;
  text-align: center;
}

.connected {
  text-align: center;
}

.success-message {
  padding: 1rem;
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  color: #2e7d32;
  margin-bottom: 1rem;
  font-weight: 500;
}

.disconnect-button {
  padding: 0.75rem 1.5rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.disconnect-button:hover {
  background: #ff3838;
}
</style>
