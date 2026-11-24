export default function ProgressBar({ currentStep, totalSteps = 5, labels = [] }) {
  const pct = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
        <span>
          Step {currentStep} of {totalSteps}
          {labels[currentStep - 1] ? ` — ${labels[currentStep - 1]}` : ''}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {labels.length > 0 && (
        <div className="hidden sm:grid grid-cols-5 gap-2 mt-3">
          {labels.map((label, idx) => {
            const stepNum = idx + 1
            const isActive = stepNum === currentStep
            const isDone = stepNum < currentStep
            return (
              <div
                key={label}
                className={`text-xs truncate ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : isDone
                    ? 'text-slate-700 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {stepNum}. {label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
