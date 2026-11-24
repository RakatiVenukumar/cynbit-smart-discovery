import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { CheckCircle2, ArrowRight, BarChart3, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function SuccessPage() {
  const location = useLocation()
  const state = location.state || {}
  const referenceId = state.referenceId || 'CSD-PROTOTYPE-DEMO'
  const companyName = state.companyName || ''
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referenceId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-xl w-full text-center" padding="p-8 sm:p-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <Badge variant="converted" className="mb-3">
            Saved to Prototype Database
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Inquiry Submitted Successfully!
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {companyName
              ? `Thank you! The discovery blueprint and inquiry for ${companyName} have been recorded.`
              : 'Thank you! Your discovery blueprint and inquiry have been recorded.'}{' '}
            In a production deployment, a Cynbit solution architect would review your qualification
            brief and follow up within 2–3 business days.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
              Your Reference ID
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-wide">
                {referenceId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                aria-label="Copy reference ID"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-800 mb-8 text-left">
            <strong>Assessment Prototype Notice:</strong> This submission is stored only in the
            assessment prototype database and has not been sent to Cynbit Technologies&apos; real
            contact systems.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/demo/admin" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                <BarChart3 className="w-4 h-4" />
                View Demo Dashboard
              </Button>
            </Link>
            <Link to="/discover" className="w-full sm:w-auto">
              <Button className="w-full gap-2">
                Start New Discovery
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
