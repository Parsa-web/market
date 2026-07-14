import { termsService } from '../services/content/termsService'

const DATA = termsService.getData()

export function useTerms() {
  return { data: DATA, loading: false, error: false }
}