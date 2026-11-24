export default function Card({ children, className = '', padding = 'p-6' }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding} ${className}`}
    >
      {children}
    </div>
  )
}
