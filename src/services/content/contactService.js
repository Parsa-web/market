const cache = {}

export const contactService = {
  async getData() {
    if (cache.contact) return cache.contact
    const res = await fetch('/data/contact.json')
    if (!res.ok) throw new Error('Failed to load contact data')
    const data = await res.json()
    cache.contact = data
    return data
  },
}
