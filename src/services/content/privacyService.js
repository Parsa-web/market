const cache = {}

export const privacyService = {
  async getData() {
    if (cache.privacy) return cache.privacy
    const res = await fetch('/data/privacy.json')
    if (!res.ok) throw new Error('Failed to load privacy data')
    const data = await res.json()
    cache.privacy = data
    return data
  },
}
