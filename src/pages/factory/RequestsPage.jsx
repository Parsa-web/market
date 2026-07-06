import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../../components/dashboard/EmptyState'
import FilterPanel from '../../components/dashboard/FilterPanel'
import Modal from '../../components/dashboard/Modal'
import RequestCard from '../../components/dashboard/RequestCard'
import SearchBar from '../../components/dashboard/SearchBar'
import Button from '../../components/common/Button'
import { useFactory } from '../../hooks/useFactory'
import { specialtyFilterOptions } from '../../data/specialties'

const STATUS_OPTIONS = [
  { value: '', label: 'همه وضعیت‌ها' },
  { value: 'فعال', label: 'فعال' },
  { value: 'در انتظار', label: 'در انتظار' },
  { value: 'تکمیل شده', label: 'تکمیل شده' },
  { value: 'بسته شده', label: 'بسته شده' },
]

export default function RequestsPage() {
  const { requests, updateRequest, deleteRequest } = useFactory()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [sort, setSort] = useState('newest')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)

  const filtered = useMemo(() => {
    let result = [...requests]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.equipment.toLowerCase().includes(q) ||
          r.brand.toLowerCase().includes(q)
      )
    }
    if (status) result = result.filter((r) => r.status === status)
    if (specialty) result = result.filter((r) => r.specialty === specialty)

    if (sort === 'newest') result.sort((a, b) => b.createdAt - a.createdAt)
    if (sort === 'oldest') result.sort((a, b) => a.createdAt - b.createdAt)

    return result
  }, [requests, search, status, specialty, sort])

  const filters = [
    {
      key: 'status',
      label: 'وضعیت',
      type: 'select',
      value: status,
      options: STATUS_OPTIONS,
    },
    {
      key: 'specialty',
      label: 'تخصص',
      type: 'select',
      value: specialty,
      options: specialtyFilterOptions,
    },
    {
      key: 'sort',
      label: 'مرتب‌سازی',
      type: 'select',
      value: sort,
      options: [
        { value: 'newest', label: 'جدیدترین' },
        { value: 'oldest', label: 'قدیمی‌ترین' },
      ],
    },
  ]

  const handleFilterChange = (key, value) => {
    if (key === 'status') setStatus(value)
    if (key === 'specialty') setSpecialty(value)
    if (key === 'sort') setSort(value)
  }

  const handleClose = (request) => {
    updateRequest(request.id, { status: 'بسته شده' })
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteRequest(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="dash-page">
      <div className="dash-page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="جستجو در درخواست‌ها..."
        />
        <Button variant="primary" onClick={() => navigate('/factory/requests/new')}>
          ثبت نیاز جدید
        </Button>
      </div>

      <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => { setStatus(''); setSpecialty(''); setSort('newest') }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="درخواستی یافت نشد"
          description="هنوز درخواستی ثبت نکرده‌اید یا فیلترها نتیجه‌ای ندارند."
          actionLabel="ثبت نیاز جدید"
          onAction={() => navigate('/factory/requests/new')}
        />
      ) : (
        <div className="dash-requests-list">
          {filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onView={setViewTarget}
              onEdit={() => navigate(`/factory/requests/${request.id}/edit`)}
              onClose={handleClose}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="جزئیات درخواست">
        {viewTarget && (
          <div className="dash-detail-view">
            <p><strong>عنوان:</strong> {viewTarget.title}</p>
            <p><strong>توضیحات:</strong> {viewTarget.description}</p>
            <p><strong>تخصص:</strong> {viewTarget.specialty}</p>
            <p><strong>دستگاه:</strong> {viewTarget.equipment}</p>
            <p><strong>برند:</strong> {viewTarget.brand}</p>
            <p><strong>شهر:</strong> {viewTarget.city}</p>
            <p><strong>وضعیت:</strong> {viewTarget.status}</p>
            <p><strong>نوع همکاری:</strong> {viewTarget.collaborationType}</p>
            <p><strong>فوریت:</strong> {viewTarget.urgency}</p>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="حذف درخواست">
        <p className="dash-modal-text">آیا از حذف «{deleteTarget?.title}» مطمئن هستید؟</p>
        <div className="dash-modal-actions">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>انصراف</Button>
          <Button variant="primary" className="dash-btn-danger-bg" onClick={confirmDelete}>حذف</Button>
        </div>
      </Modal>
    </div>
  )
}
