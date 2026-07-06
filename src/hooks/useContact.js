import { useState, useEffect } from 'react'
import { contactService } from '../services/content/contactService'

export function useContact() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    contactService.getData()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    return () => {}
  }, [])

  return { data, loading, error }
}
