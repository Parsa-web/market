import {
  Award,
  Briefcase,
  Building2,
  CheckCircle,
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
    name: 'امیر رضایی',
    role: 'تکنسین اتوماسیون صنعتی',
    skills: ['Siemens PLC', 'SCADA', 'HMI'],
    experience: '۸ سال تجربه',
    verified: true,
    initials: 'عر',
  },
  {
    id: 2,
    name: 'رضا کرمی',
    role: 'تکنسین کوره و حرارت صنعتی',
    skills: ['کوره', 'نسوز', 'هیدرولیک'],
    experience: '۱۵ سال تجربه',
    verified: true,
    initials: 'رک',
  },
  {
    id: 3,
    name: 'علی حسینی',
    role: 'تکنسین ماشین‌آلات CNC',
    skills: ['CNC', 'CAD/CAM', 'برش'],
    experience: '۱۰ سال تجربه',
    verified: true,
    initials: 'اح',
  },
  {
    id: 4,
    name: 'محمد کریمی',
    role: 'تکنسین تعمیر توربین و تجهیزات دوار',
    skills: ['توربین', 'کمپرسور', 'مکانیک'],
    experience: '۱۲ سال تجربه',
    verified: true,
    initials: 'مک',
  },
]

export const requests = [
  {
    id: 1,
    title: 'نیاز به تعمیرکار خط تولید',
    industry: 'کاشی و سرامیک',
    equipment: 'Roller Kiln',
    brand: 'SACMI',
    skills: 'PLC — Mechanical — Electrical',
    status: 'در انتظار متخصص',
  },
  {
    id: 2,
    title: 'نیاز به تکنسین برق صنعتی',
    industry: 'صنایع غذایی',
    equipment: 'Packaging Line',
    brand: 'Tetra Pak',
    skills: 'برق — اتوماسیون — مکانیک',
    status: 'فوری',
  },
  {
    id: 3,
    title: 'تعمیرکار توربین گاز',
    industry: 'نیروگاه',
    equipment: 'Gas Turbine',
    brand: 'Siemens',
    skills: 'مکانیک — توربین — تعمیرات',
    status: 'در انتظار متخصص',
  },
  {
    id: 4,
    title: 'تکنسین ربات جوشکار صنعتی',
    industry: 'خودروسازی',
    equipment: 'Welding Robot',
    brand: 'ABB',
    skills: 'رباتیک — PLC — برق',
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
  { id: 1, label: '+ هزاران تخصص صنعتی', icon: Briefcase },
  { id: 2, label: 'متخصصان تأیید شده', icon: CheckCircle },
  { id: 3, label: 'تجربه واقعی دستگاه‌ها', icon: Award },
]

export const popularSearches = ['PLC Siemens', 'کوره صنعتی', 'دستگاه CNC', 'برق صنعتی']

export const searchSuggestions = [
  'تعمیر PLC Siemens — برنامه‌نویسی و عیب‌یابی',
  'متخصص کوره صنعتی — سیستم کنترل حرارت',
  'تعمیر دستگاه CNC — کالیبراسیون و تنظیمات',
  'برق صنعتی — تابلو برق و درایو',
]
