export const REQUEST_STATUS = {
  ACTIVE: 'فعال',
  PENDING: 'در انتظار',
  COMPLETED: 'تکمیل شده',
  CLOSED: 'بسته شده',
}

export const APPLICATION_STATUS = {
  PENDING: 'در انتظار',
  ACCEPTED: 'پذیرفته شده',
  REJECTED: 'رد شده',
}

export const CERTIFICATE_STATUS = {
  UPLOADED: 'آپلود شده',
}

export const DEFAULT_SPECIALIST_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  newMessageAlert: true,
  applicationAlert: true,
  opportunityAlert: true,
  applicationsSeenAt: 0,
}

export const DEFAULT_FACTORY_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  newMessageAlert: true,
  requestUpdateAlert: true,
  applicationsSeenAt: 0,
}
