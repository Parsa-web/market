import { useState, useEffect } from 'react'
import { termsService } from '../services/content/termsService'

export function useTerms() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    termsService.getData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => {}
  }, [])

  return { data, loading, error }
}
