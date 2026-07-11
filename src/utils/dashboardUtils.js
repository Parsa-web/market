export function formatPersianDate(timestamp) {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatPersianTime(timestamp) {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function formatBadgeCount(count) {
  return new Intl.NumberFormat('fa-IR').format(count)
}

export const STATUS_LABELS = {
  draft: 'پیش‌نویس',
  published: 'منتشر شده',
  waiting_for_applications: 'در انتظار متخصص',
  in_progress: 'در حال انجام',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
}

export const APPLICATION_STATUS_LABELS = {
  pending: 'در انتظار',
  accepted: 'پذیرفته شده',
  rejected: 'رد شده',
  cancelled: 'لغو شده',
}

export const PROJECT_STATUS_LABELS = {
  active: 'فعال',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
}

export function getStatusVariant(status) {
  switch (status) {
    case 'published':
    case 'waiting_for_applications':
      return 'active'
    case 'draft':
    case 'pending':
      return 'pending'
    case 'completed':
      return 'completed'
    case 'cancelled':
    case 'in_progress':
      return 'default'
    default:
      return 'default'
  }
}

export function getApplicationStatusVariant(status) {
  switch (status) {
    case 'accepted':
      return 'completed'
    case 'rejected':
    case 'cancelled':
      return 'closed'
    case 'pending':
      return 'pending'
    default:
      return 'default'
  }
}

export function getDashboardPath(role) {
  return role === 'factory' ? '/factory' : '/specialist'
}

export const FACTORY_MENU = [
  { path: '/factory', label: 'داشبورد', icon: 'LayoutDashboard', end: true },
  { path: '/factory/requests/new', label: 'ثبت نیاز جدید', icon: 'PlusCircle' },
  { path: '/factory/requests', label: 'نیازهای صنعتی من', icon: 'ClipboardList' },
  { path: '/factory/applications', label: 'درخواست‌های دریافتی', icon: 'Users' },
  { path: '/factory/messages', label: 'پیام‌ها', icon: 'MessageSquare' },
  { path: '/factory/profile', label: 'پروفایل کارخانه', icon: 'Building2' },
  { path: '/factory/settings', label: 'تنظیمات', icon: 'Settings' },
]

export const SPECIALIST_MENU = [
  { path: '/specialist', label: 'داشبورد', icon: 'LayoutDashboard', end: true },
  { path: '/specialist/profile', label: 'پروفایل تخصصی من', icon: 'User' },
  { path: '/specialist/machines', label: 'تجربه دستگاه‌ها', icon: 'Cpu' },
  { path: '/specialist/certificates', label: 'مدارک و گواهینامه‌ها', icon: 'Award' },
  { path: '/specialist/portfolio', label: 'نمونه‌کارها', icon: 'FolderOpen' },
  { path: '/specialist/opportunities', label: 'نیازهای صنعتی', icon: 'ClipboardList' },
  { path: '/specialist/applications', label: 'درخواست‌های ارسال‌شده', icon: 'Send' },
  { path: '/specialist/messages', label: 'پیام‌ها', icon: 'MessageSquare' },
  { path: '/specialist/settings', label: 'تنظیمات', icon: 'Settings' },
]

export const PAGE_TITLES = {
  '/factory': 'داشبورد',
  '/factory/requests/new': 'ثبت نیاز جدید',
  '/factory/requests': 'نیازهای صنعتی من',
  '/factory/applications': 'درخواست‌های دریافتی',
  '/factory/messages': 'پیام‌ها',
  '/factory/profile': 'پروفایل کارخانه',
  '/factory/settings': 'تنظیمات',
  '/specialist': 'داشبورد',
  '/specialist/profile': 'پروفایل تخصصی من',
  '/specialist/machines': 'تجربه دستگاه‌ها',
  '/specialist/certificates': 'مدارک و گواهینامه‌ها',
  '/specialist/portfolio': 'نمونه‌کارها',
  '/specialist/opportunities': 'نیازهای صنعتی',
  '/specialist/applications': 'درخواست‌های ارسال‌شده',
  '/specialist/messages': 'پیام‌ها',
  '/specialist/settings': 'تنظیمات',
}
