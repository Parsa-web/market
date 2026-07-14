import { privacyService } from '../services/content/privacyService'

const DATA = privacyService.getData()

export function usePrivacy() {
  return { data: DATA, loading: false, error: false }
}