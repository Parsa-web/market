import { Award, Download, FileText, Plus, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/dashboard/Badge'
import EmptyState from '../../components/dashboard/EmptyState'
import Modal from '../../components/dashboard/Modal'
import { fileToBase64, formatPersianDate } from '../../utils/dashboardUtils'
import { useSpecialist } from '../../hooks/useSpecialist'

export default function CertificatesPage() {
  const { certificates, addCertificate, removeCertificate } = useSpecialist()
  const fileRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'گواهینامه فنی' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !selectedFile) return

    setUploading(true)
    try {
      const dataUrl = await fileToBase64(selectedFile)
      addCertificate({
        name: form.name,
        type: form.type,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: dataUrl,
        status: 'آپلود شده',
      })
      setModalOpen(false)
      setForm({ name: '', type: 'گواهینامه فنی' })
      setSelectedFile(null)
      showSuccess('مدرک با موفقیت آپلود شد')
    } catch {
      showSuccess('خطا در آپلود فایل')
    }
    setUploading(false)
  }

  return (
    <div className="dash-page">
      {successMsg && <div className="dash-toast dash-toast--success">{successMsg}</div>}

      <div className="dash-page-toolbar">
        <p className="dash-page-desc">گواهینامه‌ها، مدارک فنی و مجوزهای حرفه‌ای خود را بارگذاری کنید.</p>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          آپلود مدرک
        </Button>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="مدرکی ثبت نشده"
          description="گواهینامه‌ها و مدارک فنی خود را آپلود کنید تا اعتبار پروفایل افزایش یابد."
        />
      ) : (
        <div className="dash-certificates-grid">
          {certificates.map((cert) => (
            <article key={cert.id} className="dash-certificate-card">
              <div className="dash-certificate-preview">
                {cert.fileData && cert.fileType?.startsWith('image/') ? (
                  <img src={cert.fileData} alt={cert.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <FileText size={32} />
                )}
              </div>
              <div className="dash-certificate-info">
                <h3>{cert.name}</h3>
                <span className="dash-certificate-type">{cert.type}</span>
                <div className="dash-certificate-meta">
                  <Badge variant="completed">{cert.status}</Badge>
                  <span>{formatPersianDate(cert.uploadedAt)}</span>
                </div>
              </div>
              <div className="dash-certificate-actions">
                {cert.fileData && (
                  <a href={cert.fileData} download={cert.fileName} className="dash-icon-btn" aria-label="دانلود">
                    <Download size={16} />
                  </a>
                )}
                <button
                  type="button"
                  className="dash-icon-btn dash-icon-btn--danger"
                  onClick={() => { removeCertificate(cert.id); showSuccess('مدرک حذف شد') }}
                  aria-label="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="آپلود مدرک">
        <form className="dash-form" onSubmit={handleUpload}>
          <Input
            label="نام مدرک"
            icon={Award}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="مثال: گواهینامه PLC زیمنس"
            fullWidth
            required
          />
          <div className="dash-form-field">
            <label className="auth-field-label">نوع مدرک</label>
            <select
              className="dash-select"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            >
              <option value="گواهینامه فنی">گواهینامه فنی</option>
              <option value="مدرک آموزشی">مدرک آموزشی</option>
              <option value="مجوز">مجوز</option>
            </select>
          </div>
          <div className="dash-upload-zone" onClick={() => fileRef.current?.click()}>
            <Upload size={24} />
            <span>{selectedFile ? selectedFile.name : 'فایل را انتخاب کنید یا اینجا رها کنید'}</span>
            <input ref={fileRef} type="file" hidden accept=".pdf,.jpg,.png" onChange={handleFileChange} />
          </div>
          {uploading && <p className="dash-upload-status">در حال آپلود...</p>}
          <div className="dash-modal-actions">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>انصراف</Button>
            <Button type="submit" variant="primary" loading={uploading} loadingText="در حال آپلود...">
              آپلود
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
