const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Ubah nomor ke format internasional tanpa tanda "+" (contoh: 081234567890 -> 6281234567890). */
function normalizePhone(raw?: string): string | null {
  if (!raw) return null
  let digits = raw.replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  else if (digits.startsWith('8')) digits = `62${digits}`

  return digits.length >= 9 ? digits : null
}

function normalizeEmail(raw?: string): string | null {
  const value = raw?.trim()
  return value && EMAIL_RE.test(value) ? value : null
}

/**
 * Kontak admin dibaca dari:
 *  - VITE_ADMIN_NUMBER -> WhatsApp
 *  - VITE_ADMIN_EMAIL  -> email
 * Nilai env diisi saat build, jadi tidak perlu reaktif.
 */
export function useAdminContact() {
  const phone = normalizePhone(import.meta.env.VITE_ADMIN_NUMBER)
  const email = normalizeEmail(import.meta.env.VITE_ADMIN_EMAIL)

  const hasWhatsApp = phone !== null
  const hasEmail = email !== null
  const hasContact = hasWhatsApp || hasEmail

  const displayPhone = phone ? `+${phone}` : ''
  const displayEmail = email ?? ''

  function whatsappLink(text: string): string {
    return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : ''
  }

  function emailLink(subject: string, body: string): string {
    if (!email) return ''
    const crlfBody = body.replace(/\n/g, '\r\n')
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(crlfBody)}`
  }

  return {
    hasWhatsApp,
    hasEmail,
    hasContact,
    displayPhone,
    displayEmail,
    whatsappLink,
    emailLink,
  }
}