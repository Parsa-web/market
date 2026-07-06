const cache = {}

export const faqService = {
  async getData() {
    if (cache.faq) return cache.faq
    const res = await fetch('/data/faq.json')
    if (!res.ok) throw new Error('Failed to load FAQ data')
    const data = await res.json()
    cache.faq = data
    return data
  },
}
