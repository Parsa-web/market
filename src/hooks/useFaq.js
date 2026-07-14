import { faqService } from '../services/content/faqService'

const DATA = faqService.getData()

export function useFaq() {
  return { data: DATA, loading: false, error: false }
}