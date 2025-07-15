<template>
  <div class="docs-page">
    <h1>📚 Documentation</h1>

    <section class="installation">
      <h2>Installation</h2>
      <div class="code-block">
        <pre><code>npm install nuxt-cosmos-offlinesigners</code></pre>
      </div>

      <p>Add the module to your <code>nuxt.config.ts</code>:</p>
      <div class="code-block">
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
    </section>

    <section class="composables">
      <h2>Composables Reference</h2>

      <div class="composable-docs">
        <div class="composable-card">
          <h3>useCosmosWallet()</h3>
          <p>Main composable for wallet management and connection state.</p>

          <h4>Returns:</h4>
          <ul>
            <li><code>connectedWallet</code> - Currently connected wallet instance</li>
            <li><code>walletInfo</code> - Wallet information (address, balance, etc.)</li>
            <li><code>isConnecting</code> - Connection loading state</li>
            <li><code>isConnected</code> - Connection status (computed)</li>
            <li><code>error</code> - Connection error message</li>
            <li><code>chainInfo</code> - Current chain configuration</li>
            <li><code>connectWallet(wallet)</code> - Connect to a specific wallet</li>
            <li><code>disconnectWallet()</code> - Disconnect current wallet</li>
            <li><code>getOfflineSigner()</code> - Get offline signer for transactions</li>
            <li><code>getAccount()</code> - Get account information</li>
            <li><code>signAndBroadcast(msgs, fee, memo?)</code> - Sign and broadcast transactions</li>
          </ul>
        </div>

        <div class="composable-card">
          <h3>useKeplr()</h3>
          <p>Keplr wallet specific composable.</p>

          <h4>Returns:</h4>
          <ul>
            <li><code>isInstalled</code> - Whether Keplr is installed</li>
            <li><code>wallet</code> - Keplr wallet instance</li>
            <li><code>openKeplrStore()</code> - Function to open Keplr Chrome store</li>
          </ul>
        </div>

        <div class="composable-card">
          <h3>useLeap()</h3>
          <p>Leap wallet specific composable.</p>

          <h4>Returns:</h4>
          <ul>
            <li><code>isInstalled</code> - Whether Leap is installed</li>
            <li><code>wallet</code> - Leap wallet instance</li>
            <li><code>openLeapStore()</code> - Function to open Leap Chrome store</li>
          </ul>
        </div>

        <div class="composable-card">
          <h3>useCosmosTransactions()</h3>
          <p>Advanced transaction management composable.</p>

          <h4>Returns:</h4>
          <ul>
            <li><code>isProcessing</code> - Transaction processing state</li>
            <li><code>lastTransaction</code> - Last transaction hash</li>
            <li><code>error</code> - Transaction error message</li>
            <li><code>sendTokens(client, fromAddress, options)</code> - Send tokens</li>
            <li><code>delegateTokens(client, delegatorAddress, options)</code> - Delegate tokens</li>
            <li><code>undelegateTokens(client, delegatorAddress, options)</code> - Undelegate tokens</li>
            <li><code>vote(client, voterAddress, options)</code> - Vote on governance proposal</li>
            <li><code>getBalance(address, denom?)</code> - Query account balance</li>
            <li><code>getDelegations(delegatorAddress)</code> - Get delegations</li>
            <li><code>getValidators()</code> - Get list of validators</li>
            <li><code>getProposals()</code> - Get governance proposals</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="components">
      <h2>Components Reference</h2>

      <div class="component-docs">
        <div class="component-card">
          <h3>&lt;CosmosWalletConnect /&gt;</h3>
          <p>Complete wallet connection component with wallet detection and installation prompts.</p>

          <h4>Features:</h4>
          <ul>
            <li>Automatic wallet detection</li>
            <li>Installation prompts for missing wallets</li>
            <li>Loading states and error handling</li>
            <li>Responsive design</li>
          </ul>
        </div>

        <div class="component-card">
          <h3>&lt;CosmosWalletInfo /&gt;</h3>
          <p>Display connected wallet information and management controls.</p>

          <h4>Props:</h4>
          <ul>
            <li><code>showDemo</code> (boolean, optional) - Show demo transaction section</li>
          </ul>

          <h4>Features:</h4>
          <ul>
            <li>Wallet address with copy functionality</li>
            <li>Balance display and refresh</li>
            <li>Disconnect functionality</li>
            <li>Optional demo transaction form</li>
          </ul>
        </div>

        <div class="component-card">
          <h3>&lt;CosmosAdvancedDemo /&gt;</h3>
          <p>Advanced demonstration component with full transaction capabilities.</p>

          <h4>Features:</h4>
          <ul>
            <li>Multiple transaction types (send, delegate, vote)</li>
            <li>Transaction simulation</li>
            <li>Transaction history</li>
            <li>Account management</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="utilities">
      <h2>Utility Functions</h2>

      <div class="utility-docs">
        <div class="utility-card">
          <h3>Address & Display</h3>
          <ul>
            <li><code>formatAddress(address, prefixLength?, suffixLength?)</code> - Format address for display</li>
            <li><code>truncateHash(hash, length?)</code> - Truncate transaction hash</li>
            <li><code>isValidCosmosAddress(address, prefix?)</code> - Validate Cosmos address</li>
          </ul>
        </div>

        <div class="utility-card">
          <h3>Amount Conversion</h3>
          <ul>
            <li><code>formatBalance(balance, decimals?)</code> - Format balance with decimal places</li>
            <li><code>formatCoin(amount, denom, decimals?)</code> - Format coin with denomination</li>
            <li><code>atomToUatom(amount)</code> - Convert ATOM to uATOM</li>
            <li><code>uatomToAtom(amount)</code> - Convert uATOM to ATOM</li>
            <li><code>formatFee(fee)</code> - Format transaction fee</li>
          </ul>
        </div>

        <div class="utility-card">
          <h3>General</h3>
          <ul>
            <li><code>copyToClipboard(text)</code> - Copy text to clipboard</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="examples">
      <h2>Code Examples</h2>

      <div class="example-section">
        <h3>Basic Wallet Connection</h3>
        <div class="code-block">
          <pre><code>&lt;template&gt;
  &lt;div&gt;
    &lt;button @click="connect" :disabled="isConnecting"&gt;
      &#123;&#123; isConnecting ? 'Connecting...' : 'Connect Keplr' &#125;&#125;
    &lt;/button&gt;

    &lt;div v-if="isConnected"&gt;
      &lt;p&gt;Address: &#123;&#123; walletInfo?.address &#125;&#125;&lt;/p&gt;
      &lt;p&gt;Balance: &#123;&#123; formatBalance(walletInfo?.balance || '0') &#125;&#125; ATOM&lt;/p&gt;
      &lt;button @click="disconnect"&gt;Disconnect&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
const {
  connectWallet,
  disconnectWallet,
  isConnected,
  isConnecting,
  walletInfo
} = useCosmosWallet()

const { wallet: keplrWallet } = useKeplr()

const connect = () => connectWallet(keplrWallet)
const disconnect = () => disconnectWallet()
&lt;/script&gt;</code></pre>
        </div>
      </div>

      <div class="example-section">
        <h3>Send Transaction</h3>
        <div class="code-block">
          <pre><code>&lt;script setup&gt;
const { signAndBroadcast, walletInfo } = useCosmosWallet()

const sendTokens = async () => {
  const msgs = [{
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: walletInfo.value?.address,
      toAddress: 'cosmos1recipient...',
      amount: [{
        denom: 'uatom',
        amount: '1000000' // 1 ATOM
      }]
    }
  }]

  const fee = {
    amount: [{ denom: 'uatom', amount: '5000' }],
    gas: '200000'
  }

  const txHash = await signAndBroadcast(msgs, fee, 'Send tokens')
  console.log('Transaction hash:', txHash)
}
&lt;/script&gt;</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs-page {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.docs-page h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
  font-size: 2.5rem;
}

.docs-page h2 {
  margin: 3rem 0 1.5rem 0;
  color: #333;
  font-size: 1.8rem;
  border-bottom: 2px solid #e5e5e5;
  padding-bottom: 0.5rem;
}

.docs-page h3 {
  margin: 2rem 0 1rem 0;
  color: #444;
  font-size: 1.3rem;
}

.docs-page h4 {
  margin: 1.5rem 0 0.5rem 0;
  color: #555;
  font-size: 1.1rem;
}

.code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.code-block code {
  color: #495057;
}

.docs-page p {
  line-height: 1.6;
  margin: 1rem 0;
  color: #666;
}

.docs-page ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.docs-page li {
  margin: 0.5rem 0;
  line-height: 1.5;
  color: #666;
}

.docs-page code {
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.9rem;
  color: #e83e8c;
}

.composable-docs,
.component-docs,
.utility-docs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.composable-card,
.component-card,
.utility-card {
  background: #f8f9ff;
  border: 1px solid #e3f2fd;
  border-radius: 12px;
  padding: 1.5rem;
}

.composable-card h3,
.component-card h3,
.utility-card h3 {
  color: #1976d2;
  margin-top: 0;
}

.example-section {
  margin: 2rem 0;
}

.installation {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
}

.installation h2 {
  margin-top: 0;
  color: #0369a1;
}

@media (max-width: 768px) {
  .docs-page {
    padding: 2rem 1rem;
  }

  .docs-page h1 {
    font-size: 2rem;
  }

  .docs-page h2 {
    font-size: 1.5rem;
  }

  .composable-docs,
  .component-docs,
  .utility-docs {
    grid-template-columns: 1fr;
  }
}
</style>
