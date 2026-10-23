/** Format minor units (cents) as a chat-facing USD amount, e.g. `$1,250.00`. */
export function formatUsdChat(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

/** Format minor units as a context-label USD amount, e.g. `USD 1,250.00`. */
export function formatUsdLabel(cents: number): string {
  const amount = (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `USD ${amount}`
}

/** Format minor units as a plain decimal for structured context, e.g. `1250.00`. */
export function formatUsdPlain(cents: number): string {
  return (cents / 100).toFixed(2)
}
