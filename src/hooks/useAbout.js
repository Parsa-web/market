import { useState, useEffect } from 'react'
import { aboutService } from '../services/content/aboutService'

export function useAbout() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)

    aboutService.getData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  return { data, loading, error }
}
