export function LoadingState({ text = 'Loading...' }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
      {text}
    </div>
  )
}
