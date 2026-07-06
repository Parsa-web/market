import { MapPin, Clock, Mail, Phone, Globe, ExternalLink } from 'lucide-react'
import styles from './CompanyInfo.module.css'

interface CompanyData {
  name: string
  address: string
  workingHours: string
  email: string
  phone: string
  website: string
  socialLinks: { platform: string; url: string }[]
}

interface CompanyInfoProps {
  company: CompanyData
}

export default function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h3 className={styles.title}>اطلاعات شرکت</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <MapPin size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>آدرس</div>
              <div className={styles.infoValue}>{company.address}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Clock size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>ساعات کاری</div>
              <div className={styles.infoValue}>{company.workingHours}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Mail size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>ایمیل</div>
              <div className={styles.infoValue}>{company.email}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Phone size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>تلفن</div>
              <div className={styles.infoValue}>{company.phone}</div>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Globe size={16} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>وبسایت</div>
              <div className={styles.infoValue}>{company.website}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>شبکه‌های اجتماعی</h3>
        <div className={styles.socialList}>
          {company.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <ExternalLink size={14} />
              {link.platform}
            </a>
          ))}
        </div>

        <div className={styles.mapPlaceholder}>
          <MapPin size={32} className={styles.mapIcon} />
          <p className={styles.mapText}>نقشه گوگل</p>
        </div>
      </div>
    </div>
  )
}
