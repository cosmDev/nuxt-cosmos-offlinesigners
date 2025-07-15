/**
 * Format a Cosmos address for display (truncated)
 */
export const formatAddress = (address: string, prefixLength = 10, suffixLength = 8): string => {
  if (!address) return ''
  if (address.length <= prefixLength + suffixLength) return address
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}

/**
 * Format a balance with proper decimal places
 */
export const formatBalance = (balance: string | number, decimals = 6): string => {
  const num = typeof balance === 'string' ? Number.parseInt(balance) : balance
  return (num / Math.pow(10, decimals)).toFixed(6)
}

/**
 * Format a coin amount with denomination
 */
export const formatCoin = (amount: string | number, denom: string, decimals = 6): string => {
  const formatted = formatBalance(amount, decimals)
  return `${formatted} ${denom}`
}

/**
 * Truncate a transaction hash for display
 */
export const truncateHash = (hash: string, length = 16): string => {
  if (!hash) return ''
  if (hash.length <= length) return hash
  return `${hash.slice(0, length / 2)}...${hash.slice(-length / 2)}`
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
    catch {
      document.body.removeChild(textArea)
      return false
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * Convert ATOM to uatom (micro ATOM)
 */
export const atomToUatom = (amount: string | number): string => {
  const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount
  return Math.floor(num * 1000000).toString()
}

/**
 * Convert uatom to ATOM
 */
export const uatomToAtom = (amount: string | number): string => {
  const num = typeof amount === 'string' ? Number.parseInt(amount) : amount
  return (num / 1000000).toString()
}

/**
 * Validate a Cosmos address
 */
export const isValidCosmosAddress = (address: string, prefix = 'cosmos'): boolean => {
  if (!address) return false

  // Basic validation - starts with prefix and has correct length
  const addressRegex = new RegExp(`^${prefix}1[a-z0-9]{38}$`)
  return addressRegex.test(address)
}

/**
 * Format transaction fee
 */
export const formatFee = (fee: { amount: Array<{ denom: string, amount: string }> }): string => {
  if (!fee.amount || fee.amount.length === 0) return '0'

  const firstAmount = fee.amount[0]
  const formatted = formatBalance(firstAmount.amount, 6)
  const denom = firstAmount.denom === 'uatom' ? 'ATOM' : firstAmount.denom

  return `${formatted} ${denom}`
}

/**
 * Generate a simple memo
 */
export const generateMemo = (type: string): string => {
  const timestamp = new Date().toISOString()
  return `${type} transaction via Nuxt Cosmos module - ${timestamp}`
}

/**
 * Sleep utility for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry utility for failed operations
 */
export const retry = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000,
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    }
    catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        throw lastError
      }

      await sleep(delay * attempt)
    }
  }

  throw lastError!
}
