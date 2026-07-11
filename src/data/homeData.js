import {
  Award,
  Briefcase,
  Building2,
  Clock,
  Cpu,
  Gauge,
  Settings,
  Shield,
  Target,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'

export const categories = [
  { id: 1, title: 'تعمیرات صنعتی', desc: 'تعمیر و نگهداری انواع ماشین‌آلات و تجهیزات کارخانه', icon: Wrench, count: '۲۴۸' },
  { id: 2, title: 'اتوماسیون و PLC', desc: 'برنامه‌نویسی و عیب‌یابی PLC زیمنس، اشنایدر و دلتا', icon: Cpu, count: '۱۸۶' },
  { id: 3, title: 'مکانیک ماشین‌آلات', desc: 'هیدرولیک، پنوماتیک، جوشکاری و ساخت قطعات صنعتی', icon: Settings, count: '۱۳۲' },
  { id: 4, title: 'برق صنعتی', desc: 'تابلو برق، درایو، اینورتر و سیستم‌های توزیع برق', icon: Zap, count: '۲۰۳' },
  { id: 5, title: 'ابزار دقیق', desc: 'کالیبراسیون و تعمیر سنسورها و تجهیزات اندازه‌گیری', icon: Gauge, count: '۱۵۶' },
  { id: 6, title: 'تأسیسات', desc: 'سیستم‌های سرمایش، گرمایش، بخار و هوای فشرده', icon: Building2, count: '۹۷' },
]

export const specialists = [
  {
    id: 1,
    name: 'رضا احمدی',
    role: 'متخصص اتوماسیون صنعتی و برنامه‌نویس PLC',
    skills: ['SIMATIC S7', 'TIA Portal', 'WinCC'],
    experience: '۱۲ سال تجربه',
    verified: true,
    initials: 'را',
  },
  {
    id: 2,
    name: 'سعید مرادی',
    role: 'تکنسین برق صنعتی و تعمیرات ماشین‌آلات',
    skills: ['تعمیرات برد', 'تابلو برق', 'اینورتر'],
    experience: '۱۰ سال تجربه',
    verified: true,
    initials: 'سم',
  },
  {
    id: 3,
    name: 'مهدی رضایی',
    role: 'متخصص ماشین‌آلات CNC و تعمیرات مکانیک',
    skills: ['تعمیرات CNC', 'هیدرولیک', 'پنوماتیک'],
    experience: '۱۵ سال تجربه',
    verified: true,
    initials: 'مر',
  },
  {
    id: 4,
    name: 'حمید کریمی',
    role: 'متخصص هیدرولیک و پنوماتیک صنعتی',
    skills: ['سیستم هیدرولیک', 'پمپ هیدرولیک', 'سروو موتور'],
    experience: '۱۰ سال تجربه',
    verified: true,
    initials: 'حک',
  },
]

export const requests = [
  {
    id: 1,
    title: 'تعمیر سیستم هیدرولیک دستگاه پرس ۲۰۰ تن',
    industry: 'فولاد و ذوب فلزات',
    equipment: 'پرس هیدرولیک ۲۰۰ تن',
    brand: 'Rexroth',
    skills: 'هیدرولیک — تعمیرات پرس — پمپ هیدرولیک',
    status: 'در انتظار متخصص',
  },
  {
    id: 2,
    title: 'عیب‌یابی و برنامه‌نویسی مجدد PLC خط پلیمر',
    industry: 'پتروشیمی و نفت',
    equipment: 'PLC خط پلیمر',
    brand: 'Siemens',
    skills: 'PLC — TIA Portal — SIMATIC S7',
    status: 'فوری',
  },
  {
    id: 3,
    title: 'راه‌اندازی اینورتر خط تولید کنسانتره',
    industry: 'صنایع غذایی',
    equipment: 'اینورتر ۳۰ کیلووات',
    brand: 'LS',
    skills: 'اینورتر — برق صنعتی — راه‌اندازی',
    status: 'در انتظار متخصص',
  },
  {
    id: 4,
    title: 'عیب‌یابی ربات جوشکاری خط تولید',
    industry: 'قطعه‌سازی و خودرو',
    equipment: 'ربات جوشکاری KUKA',
    brand: 'KUKA',
    skills: 'رباتیک — PLC — برنامه‌نویسی ربات',
    status: 'فوری',
  },
]

export const whyFeatures = [
  { id: 1, title: 'پیدا کردن متخصص واقعی', desc: 'تکنسین‌هایی که دقیقاً با دستگاه و تجهیزات شما کار کرده‌اند', icon: Target },
  { id: 2, title: 'تجربه قابل بررسی روی دستگاه‌ها', desc: 'سابقه واقعی کار با برندها و ماشین‌آلات مشخص به همراه تأیید', icon: Shield },
  { id: 3, title: 'کاهش زمان توقف تولید', desc: 'با پیدا کردن سریع متخصص مناسب، توقف خط تولید را به حداقل برسانید', icon: Clock },
  { id: 4, title: 'ارتباط مستقیم کارخانه و متخصص', desc: 'بدون واسطه و با کمترین زمان، مستقیماً با متخصص ارتباط بگیرید', icon: Users },
]

export const trustStats = [
  { id: 1, label: '۹۸۰+ پروژه تکمیل شده', icon: Award },
  { id: 2, label: '۳۲۰+ کارخانه فعال', icon: Building2 },
  { id: 3, label: '۴۵۰+ متخصص مجرب', icon: Users },
]

export const popularSearches = ['PLC Siemens', 'پرس هیدرولیک', 'دستگاه CNC', 'برق صنعتی']

export const searchSuggestions = [
  'تعمیر PLC Siemens — برنامه‌نویسی و عیب‌یابی',
  'تعمیر پرس هیدرولیک — سیستم کنترل و سیلندر',
  'تعمیر دستگاه CNC — کالیبراسیون و تنظیمات',
  'برق صنعتی — تابلو برق و درایو',
]
