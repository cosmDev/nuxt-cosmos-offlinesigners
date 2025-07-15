import { defineNuxtPlugin } from '#app'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keplr?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leap?: any
  }
}

export default defineNuxtPlugin(async () => {
  // Initialize Pinia store early
  if (import.meta.client) {
    // Wait a bit for Pinia to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Plugin initialization for Cosmos offline signers
  if (import.meta.client) {
    // Wait for wallet extensions to be available
    await new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const checkWallets = () => {
          if (window.keplr || window.leap) {
            resolve(true)
          }
          else {
            setTimeout(checkWallets, 100)
          }
        }
        // Check immediately and then every 100ms for up to 3 seconds
        setTimeout(() => resolve(false), 3000)
        checkWallets()
      }
      else {
        resolve(false)
      }
    })

    console.log('Cosmos offline signers module initialized')
  }
})
