export function validateContactField(field, rawValue) {
  const value = rawValue.trim()
  if (field === 'name') {
    if (!value || !/\p{L}/u.test(value)) return 'Please enter your name.'
    if (value.length > 120) return 'Keep your name within 120 characters.'
  }
  if (field === 'email') {
    if (!value) return 'Please enter your email address.'
    const parts = value.split('@')
    const [local, domain] = parts
    const validDomain = domain?.split('.').every((label) =>
      /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label) && label.length <= 63)
    if (value.length > 254 || parts.length !== 2 || !local || local.length > 64 ||
      !/^[a-z\d.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) ||
      local.startsWith('.') || local.endsWith('.') || local.includes('..') ||
      !domain?.includes('.') || !validDomain) {
      return 'Enter a valid email, like you@example.com.'
    }
  }
  if (field === 'message') {
    if (!value) return 'Please add a short message.'
    if (value.length < 10 || !/[\p{L}\p{N}]/u.test(value)) return 'Add a little more detail (at least 10 characters).'
    if (value.length > 5000) return 'Keep your message within 5,000 characters.'
  }
  return ''
}