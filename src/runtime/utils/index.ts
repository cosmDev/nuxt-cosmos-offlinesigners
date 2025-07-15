export const formatAddress = (address: string, startLength = 10, endLength = 8): string => {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export const formatBalance = (balance: string | number, decimals = 6): string => {
  if (!balance) return '0'
  const balanceNum = typeof balance === 'string' ? Number.parseInt(balance) : balance
  return (balanceNum / Math.pow(10, decimals)).toFixed(6)
}

export const formatCoin = (amount: string | number, denom: string, decimals = 6): string => {
  const formatted = formatBalance(amount, decimals)
  return `${formatted} ${denom.toUpperCase()}`
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    }
  }
  catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

export const truncateHash = (hash: string, length = 12): string => {
  if (!hash) return ''
  if (hash.length <= length * 2) return hash
  return `${hash.slice(0, length)}...${hash.slice(-length)}`
}
