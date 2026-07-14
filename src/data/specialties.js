import {
  Cpu,
  Fan,
  Flame,
  Gauge,
  HardHat,
  Settings,
  Wrench,
  Zap,
} from 'lucide-react'

const specialtiesData = [
  { id: 'industrial-repair', title: 'تعمیرات صنعتی', example: 'تعمیر خط تولید، نگهداری پیشگیرانه', icon: Wrench },
  { id: 'automation-plc', title: 'اتوماسیون و PLC', example: 'PLC Siemens، SCADA، HMI', icon: Cpu },
  { id: 'mechanical', title: 'مکانیک ماشین‌آلات', example: 'هیدرولیک، پنوماتیک، CNC', icon: Settings },
  { id: 'electrical', title: 'برق صنعتی', example: 'تابلو برق، درایو، اینورتر', icon: Zap },
  { id: 'instrumentation', title: 'ابزار دقیق', example: 'کالیبراسیون، سنسور، کنترل', icon: Gauge },
  { id: 'utilities', title: 'تأسیسات', example: 'بخار، سرمایش، هوای فشرده', icon: Fan },
  { id: 'robotics', title: 'رباتیک صنعتی', example: 'ربات جوش، ABB، KUKA', icon: Flame },
  { id: 'turbine', title: 'توربین و تجهیزات دوار', example: 'توربین گاز، کمپرسور', icon: HardHat },
]

export const specialties = specialtiesData

export const specialtyTitles = specialtiesData.map((item) => item.title)

export const specialtyExamples = specialtiesData.map((item) => item.example)

export function getSpecialtyPlaceholder() {
  const samples = specialtiesData.slice(0, 2).map((item) => item.example)
  return `مثال: ${samples.join(' — ')}`
}

export function getSpecialtyExample(title) {
  return specialtiesData.find((item) => item.title === title)?.example || ''
}

export function getSpecialtyFilterPlaceholder() {
  const sample = specialtiesData[1]?.title || specialtiesData[0]?.title || 'اتوماسیون'
  return `مثال: ${sample}`
}

export const specialtySelectOptions = [
  { value: '', label: 'انتخاب کنید', description: 'یک تخصص را انتخاب کنید' },
  ...specialtiesData.map((item) => ({
    value: item.title,
    label: item.title,
    description: item.example,
    icon: item.icon,
  })),
]

export const specialtyFilterOptions = [
  { value: '', label: 'همه تخصص‌ها' },
  ...specialtiesData.map((item) => ({ value: item.title, label: item.title })),
]
