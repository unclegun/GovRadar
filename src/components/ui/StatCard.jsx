export function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)] md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">{value}</p>
      {detail && <p className="mt-1 text-sm text-slate-600">{detail}</p>}
    </div>
  )
}
