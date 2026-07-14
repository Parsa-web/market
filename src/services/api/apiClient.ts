const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const TIMEOUT_MS = 30000

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`API Error ${res.status}: ${text || res.statusText}`)
    }

    if (res.status === 204) return undefined as T
    return res.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path)
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  patch<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  del<T>(path: string): Promise<T> {
    return request<T>(path, {
      method: 'DELETE',
    })
  },
}
