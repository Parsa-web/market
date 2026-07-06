const cache = {}

export const termsService = {
  async getData() {
    if (cache.terms) return cache.terms
    const res = await fetch('/data/terms.json')
    if (!res.ok) throw new Error('Failed to load terms data')
    const data = await res.json()
    cache.terms = data
    return data
  },
}
