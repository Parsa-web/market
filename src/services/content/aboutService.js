const cache = {}

export const aboutService = {
  async getData() {
    if (cache.about) return cache.about
    const res = await fetch('/data/about.json')
    if (!res.ok) throw new Error('Failed to load about data')
    const data = await res.json()
    cache.about = data
    return data
  },
}
