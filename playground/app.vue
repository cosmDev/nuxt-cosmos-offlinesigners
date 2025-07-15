<template>
  <div class="app">
    <header class="header">
      <h1>🌌 Nuxt Cosmos Offline Signers Demo</h1>
      <p>Integration of Keplr and Leap wallets for Cosmos SDK</p>

      <nav class="navigation">
        <NuxtLink
          to="/"
          class="nav-link"
          active-class="nav-active"
        >Home</NuxtLink>
        <NuxtLink
          to="/simple"
          class="nav-link"
          active-class="nav-active"
        >Simple Demo</NuxtLink>
        <NuxtLink
          to="/advanced"
          class="nav-link"
          active-class="nav-active"
        >Advanced Demo</NuxtLink>
        <NuxtLink
          to="/docs"
          class="nav-link"
          active-class="nav-active"
        >Documentation</NuxtLink>
      </nav>
    </header>

    <main class="main">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>Built with ❤️ for the Cosmos ecosystem</p>
    </footer>
  </div>
</template>

<script setup>
// Global layout - no specific logic needed here
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #0f011d 100%);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-active {
  background: rgba(255, 255, 255, 0.3) !important;
  font-weight: 600;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  margin-top: auto;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
  }

  .navigation {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
  }

  .main {
    padding: 1rem;
  }
}
</style>
