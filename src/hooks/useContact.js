import { contactService } from '../services/content/contactService'

const DATA = contactService.getData()

export function useContact() {
  return { data: DATA, loading: false, error: false }
}