import { useState, useEffect } from 'react'
import { privacyService } from '../services/content/privacyService'

export function usePrivacy() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    privacyService.getData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => {}
  }, [])

  return { data, loading, error }
}
