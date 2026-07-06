export default function AuthIllustration() {
  return (
    <div className="auth-illustration-inner">
      <svg
        viewBox="0 0 480 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="auth-illustration-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="auth-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="auth-machine-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Floor */}
        <ellipse cx="240" cy="318" rx="168" ry="14" fill="url(#auth-floor)" />

        {/* Industrial machine */}
        <g transform="translate(248, 72)">
          <rect x="0" y="48" width="140" height="168" rx="8" fill="url(#auth-machine-body)" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="12" y="60" width="116" height="72" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="24" y="72" width="92" height="48" rx="4" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="70" cy="96" r="18" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
          <circle cx="70" cy="96" r="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1" />
          <rect x="20" y="148" width="36" height="10" rx="3" fill="#2563EB" fillOpacity="0.85" />
          <rect x="62" y="148" width="24" height="10" rx="3" fill="#E2E8F0" />
          <rect x="92" y="148" width="36" height="10" rx="3" fill="#E2E8F0" />
          <rect x="28" y="168" width="84" height="36" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="36" y="176" width="20" height="20" rx="3" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <rect x="62" y="176" width="20" height="20" rx="3" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <rect x="88" y="176" width="16" height="20" rx="3" fill="#2563EB" fillOpacity="0.12" stroke="#93C5FD" strokeWidth="1" />
          <rect x="48" y="216" width="44" height="8" rx="4" fill="#CBD5E1" />
          <rect x="-16" y="208" width="172" height="12" rx="4" fill="#E2E8F0" />
        </g>

        {/* Technician */}
        <g transform="translate(108, 118)">
          <ellipse cx="52" cy="188" rx="36" ry="6" fill="#CBD5E1" fillOpacity="0.35" />
          <rect x="38" y="132" width="28" height="52" rx="6" fill="#2563EB" fillOpacity="0.88" />
          <rect x="34" y="148" width="10" height="34" rx="4" fill="#1D4ED8" fillOpacity="0.75" />
          <rect x="60" y="148" width="10" height="34" rx="4" fill="#1D4ED8" fillOpacity="0.75" />
          <rect x="42" y="184" width="11" height="28" rx="4" fill="#334155" fillOpacity="0.85" />
          <rect x="51" y="184" width="11" height="28" rx="4" fill="#334155" fillOpacity="0.85" />
          <rect x="40" y="96" width="24" height="28" rx="8" fill="#FBBF24" fillOpacity="0.35" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="52" cy="78" r="16" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.2" />
          <rect x="44" y="68" width="16" height="8" rx="4" fill="#475569" fillOpacity="0.7" />
          <rect x="64" y="108" width="28" height="8" rx="4" fill="#64748B" fillOpacity="0.5" />
          <rect x="88" y="102" width="6" height="32" rx="3" fill="#94A3B8" />
          <rect x="82" y="98" width="18" height="10" rx="3" fill="#2563EB" fillOpacity="0.2" stroke="#93C5FD" strokeWidth="1" />
        </g>

        {/* Ambient light accent */}
        <circle cx="380" cy="88" r="48" fill="#2563EB" fillOpacity="0.04" />
        <circle cx="96" cy="120" r="32" fill="#2563EB" fillOpacity="0.03" />
      </svg>

      <p className="auth-illustration-caption">
        پلتفرم تخصصی ارتباط صنایع
      </p>
    </div>
  )
}
