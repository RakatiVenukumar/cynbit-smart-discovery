import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  }
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-600">
      <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-blue-600`} />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  )
}
