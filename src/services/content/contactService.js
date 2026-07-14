const DATA = {
  hero: {
    title: 'تماس با ما',
    subtitle: 'ما آماده پاسخگویی به سوالات شما هستیم.',
  },
  contactCards: [
    { id: 'support', title: 'پشتیبانی', description: 'برای رفع مشکلات فنی و سوالات درباره استفاده از پلتفرم', icon: 'Headphones', email: 'support@sanatnet.ir', phone: '۰۲۱-۱۲۳۴۵۶۷۸', hours: 'شنبه تا پنجشنبه، ۸ صبح تا ۶ عصر' },
    { id: 'sales', title: 'فروش و همکاری', description: 'برای اطلاعات بیشتر درباره خدمات و همکاری‌های تجاری', icon: 'Handshake', email: 'sales@sanatnet.ir', phone: '۰۲۱-۱۲۳۴۵۶۷۹', hours: 'شنبه تا پنجشنبه، ۹ صبح تا ۵ عصر' },
    { id: 'technical', title: 'مشکلات فنی', description: 'برای گزارش باگ و مشکلات فنی پلتفرم', icon: 'Wrench', email: 'tech@sanatnet.ir', phone: '۰۲۱-۱۲۳۴۵۶۸۰', hours: 'شنبه تا پنجشنبه، ۸ صبح تا ۶ عصر' },
    { id: 'general', title: 'اطلاعات عمومی', description: 'برای سوالات عمومی و اطلاعات بیشتر درباره صنعت‌نت', icon: 'Info', email: 'info@sanatnet.ir', phone: '۰۲۱-۱۲۳۴۵۶۸۱', hours: 'شنبه تا پنجشنبه، ۸ صبح تا ۶ عصر' },
  ],
  companyInfo: {
    name: 'صنعت‌نت',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳، طبقه ۴',
    workingHours: 'شنبه تا پنجشنبه، ۸ صبح تا ۶ عصر',
    email: 'info@sanatnet.ir',
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    website: 'www.sanatnet.ir',
    socialLinks: [
      { platform: 'اینستاگرام', url: 'https://instagram.com/sanatnet' },
      { platform: 'لینکدین', url: 'https://linkedin.com/company/sanatnet' },
      { platform: 'توییتر', url: 'https://twitter.com/sanatnet' },
      { platform: 'تلگرام', url: 'https://t.me/sanatnet' },
    ],
  },
  form: {
    title: 'پیام برای ما ارسال کنید',
    fields: { name: 'نام و نام خانوادگی', email: 'ایمیل', phone: 'شماره تماس', subject: 'موضوع', message: 'پیام شما' },
    subjects: ['سوال عمومی', 'پشتیبانی فنی', 'همکاری تجاری', 'گزارش مشکل', 'پیشنهاد و انتقاد'],
    validation: {
      nameRequired: 'نام و نام خانوادگی الزامی است',
      emailRequired: 'ایمیل الزامی است',
      emailInvalid: 'ایمیل معتبر نیست',
      phoneRequired: 'شماره تماس الزامی است',
      subjectRequired: 'موضوع الزامی است',
      messageRequired: 'پیام الزامی است',
    },
    successMessage: 'پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.',
    errorMessage: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
    submitText: 'ارسال پیام',
  },
  cta: {
    title: 'آماده شروع همکاری هستید؟',
    subtitle: 'همین الان با ما تماس بگیرید یا در پلتفرم ثبت‌نام کنید.',
    factoryBtn: 'ثبت‌نام کارخانه',
    specialistBtn: 'ثبت‌نام متخصص',
  },
}

export const contactService = {
  getData() {
    return DATA
  },
}
