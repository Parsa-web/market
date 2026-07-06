import { useState } from 'react'
import RoleSelector from './RoleSelector'
import FactoryForm from './FactoryForm'
import SpecialistForm from './SpecialistForm'

export default function RegisterCard() {
  const [selectedRole, setSelectedRole] = useState(null)

  return (
    <div className="register-card">
      <header className="register-card-header">
        <h1 className="register-title">ایجاد حساب کاربری</h1>
        <p className="register-subtitle">برای شروع، نوع حساب خود را انتخاب کنید.</p>
      </header>

      <section className="register-card-body">
        <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />

        {selectedRole && (
          <div className="register-form-section">
            {selectedRole === 'factory' ? (
              <FactoryForm onSubmit={(e) => { e.preventDefault() }} />
            ) : (
              <SpecialistForm onSubmit={(e) => { e.preventDefault() }} />
            )}
          </div>
        )}
      </section>

      <footer className="register-card-footer">
        <p className="register-footer-text">
          حساب کاربری دارید؟
          {' '}
          <a href="/login" className="register-footer-link">وارد شوید</a>
        </p>
      </footer>
    </div>
  )
}