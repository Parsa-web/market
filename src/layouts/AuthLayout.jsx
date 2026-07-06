export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-split">
        <main className="auth-panel">{children}</main>
      </div>
    </div>
  )
}
