import { Briefcase, Camera, Mail, MessageCircle, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../common/Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo variant="footer" light />
            <p className="footer-desc">
              پلتفرم تخصصی اتصال کارخانه‌ها و صنایع به تکنسین‌های باتجربه در تعمیر و نگهداری ماشین‌آلات صنعتی
            </p>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Phone size={14} />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={14} />
                <span>info@sanatnet.ir</span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">دسترسی سریع</h4>
            <ul className="footer-links">
              <li>
                <a href="#specialists">پیدا کردن متخصص</a>
              </li>
              <li>
                <Link to="/register?role=factory">ثبت نیاز کارخانه</Link>
              </li>
              <li>
                <a href="#categories">دسته‌بندی تخصص‌ها</a>
              </li>
              <li>
                <a href="#why">نحوه کار</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">صنعت‌نت</h4>
            <ul className="footer-links">
              <li>
                <a href="#why">درباره ما</a>
              </li>
              <li>
                <a href="mailto:info@sanatnet.ir">تماس با ما</a>
              </li>
              <li>
                <Link to="/register">قوانین و مقررات</Link>
              </li>
              <li>
                <Link to="/login">حریم خصوصی</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">ارتباط سریع</h4>
            <div className="social-links">
              <a href="mailto:info@sanatnet.ir?subject=درخواست%20همکاری" className="social-link" aria-label="درخواست همکاری">
                <Briefcase size={16} />
              </a>
              <Link to="/register?role=specialist" className="social-link" aria-label="ثبت متخصص">
                <Camera size={16} />
              </Link>
              <a href="mailto:info@sanatnet.ir?subject=پیام%20از%20سایت" className="social-link" aria-label="ارسال ایمیل">
                <Send size={16} />
              </a>
              <a href="tel:+982112345678" className="social-link" aria-label="تماس تلفنی">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>تمام حقوق مادی و معنوی این وبسایت متعلق به صنعت‌نت می‌باشد.</p>
        </div>
      </div>
    </footer>
  )
}
