<template>
  <div class="home-page">
    <section class="wallet-connect-section">
      <CosmosWalletConnect />
    </section>

    <section
      v-if="isConnected"
      class="wallet-info-section"
    >
      <CosmosWalletInfo :show-demo="true" />
    </section>

    <section class="info-section">
      <div class="info-cards">
        <div class="info-card">
          <h3>🔗 Features</h3>
          <ul>
            <li>Support for Keplr and Leap wallets</li>
            <li>Easy wallet connection and management</li>
            <li>Balance display and transaction signing</li>
            <li>TypeScript support</li>
            <li>Nuxt 3 composables</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>🚀 Usage</h3>
          <p>Import the composables in your Nuxt 3 application:</p>
          <pre><code>// In your component
  const { connectWallet, isConnected } = useCosmosWallet()
  const { wallet: keplrWallet } = useKeplr()
  const { wallet: leapWallet } = useLeap()</code></pre>
        </div>

        <div class="info-card">
          <h3>⚙️ Configuration</h3>
          <p>Configure the module in your <code>nuxt.config.ts</code>:</p>
          <pre><code>export default defineNuxtConfig({
  modules: ['nuxt-cosmos-offlinesigners'],
  cosmosOfflineSigners: {
    chainId: 'cosmoshub-4',
    rpcEndpoint: 'https://cosmos-api.cosmdev.com/rpc/atom',
    restEndpoint: 'https://cosmos-api.cosmdev.com/lcd/atom',
    bech32Prefix: 'cosmos'
  }
})</code></pre>
        </div>
      </div>
    </section>

    <section class="demos-section">
      <h2>Try the Demos</h2>
      <div class="demo-cards">
        <NuxtLink
          to="/simple"
          class="demo-card"
        >
          <h3>🔰 Simple Demo</h3>
          <p>Basic wallet connection and token transfer functionality. Perfect for getting started with the module.</p>
          <span class="demo-link">Try Simple Demo →</span>
        </NuxtLink>

        <NuxtLink
          to="/advanced"
          class="demo-card"
        >
          <h3>🚀 Advanced Demo</h3>
          <p>Advanced features including staking, governance, and complex transaction management.</p>
          <span class="demo-link">Try Advanced Demo →</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const { isConnected } = useCosmosWallet()
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.wallet-connect-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.wallet-info-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-section {
  margin-bottom: 3rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.info-card ul {
  list-style: none;
  padding-left: 0;
}

.info-card li {
  padding: 0.5rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.info-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #34c759;
  font-weight: bold;
}

.info-card pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.info-card code {
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.demos-section {
  margin-bottom: 2rem;
}

.demos-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2rem;
}

.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.demo-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.demo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border-color: #667eea;
}

.demo-card h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-size: 1.3rem;
}

.demo-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.demo-link {
  color: #667eea;
  font-weight: 600;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .info-cards,
  .demo-cards {
    grid-template-columns: 1fr;
  }

  .wallet-connect-section,
  .wallet-info-section,
  .info-card,
  .demo-card {
    padding: 1.5rem;
  }

  .demos-section h2 {
    font-size: 1.5rem;
  }
}
</style>
