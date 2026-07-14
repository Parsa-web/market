import { aboutService } from '../services/content/aboutService'

const DATA = aboutService.getData()

export function useAbout() {
  return { data: DATA, loading: false, error: false }
}