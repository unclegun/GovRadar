export function Card({ title, subtitle, actions, children, className = '' }) {
  return (
    <section
      className={`panel-modern rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_16px_38px_rgba(15,23,42,0.08)] backdrop-blur md:p-5 ${className}`}
    >
      {(title || subtitle || actions) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
