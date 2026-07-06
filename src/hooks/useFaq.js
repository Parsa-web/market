import { useState, useEffect } from 'react'
import { faqService } from '../services/content/faqService'

export function useFaq() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    faqService.getData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => {}
  }, [])

  return { data, loading, error }
}
