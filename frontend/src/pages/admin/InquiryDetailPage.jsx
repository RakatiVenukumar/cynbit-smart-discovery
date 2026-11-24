import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { api } from '../../services/api'
import { SERVICE_LABEL_MAP } from '../../data/services'
import { formatDate, formatStatus, formatPriority } from '../../utils/formatters'
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'

const STATUS_OPTIONS = ['new', 'contacted', 'in_progress', 'converted', 'closed']

export default function InquiryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inquiry, setInquiry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const res = await api.getInquiry(id)
        if (active) setInquiry(res.data)
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem('admin_token')
          navigate('/admin/login', { replace: true })
          return
        }
        if (active) setError('Unable to load inquiry details.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id, navigate])

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    setStatusMessage('')
    try {
      const res = await api.updateInquiryStatus(id, newStatus)
      setInquiry((prev) => ({ ...prev, status: res.data.status }))
      setStatusMessage(`Status updated to "${formatStatus(res.data.status)}".`)
    } catch {
      setError('Failed to update status.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {loading && <LoadingSpinner label="Loading inquiry details..." />}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {inquiry && !loading && (
          <>
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-slate-500">{inquiry.reference_id}</span>
                  <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                    {inquiry.company_name}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {inquiry.full_name} · {inquiry.email}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={inquiry.priority}>{formatPriority(inquiry.priority)} Priority</Badge>
                  <select
                    value={inquiry.status}
                    disabled={updating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    aria-label="Update inquiry status"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white font-medium"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {formatStatus(st)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {statusMessage && (
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </Card>

            {/* Qualification Breakdown */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Lead Qualification Score (Prototype Rules)
                </h2>
                <span className="text-2xl font-bold text-blue-600">
                  {inquiry.qualification_score ?? 0}/100
                </span>
              </div>

              {inquiry.qualification_breakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      label: 'Budget Readiness',
                      val: inquiry.qualification_breakdown.budget_readiness,
                      max: inquiry.qualification_breakdown.budget_max || 25,
                    },
                    {
                      label: 'Timeline Clarity',
                      val: inquiry.qualification_breakdown.timeline_clarity,
                      max: inquiry.qualification_breakdown.timeline_max || 20,
                    },
                    {
                      label: 'Requirement Clarity',
                      val: inquiry.qualification_breakdown.requirement_clarity,
                      max: inquiry.qualification_breakdown.requirement_max || 25,
                    },
                    {
                      label: 'Business Readiness',
                      val: inquiry.qualification_breakdown.business_readiness,
                      max: inquiry.qualification_breakdown.business_max || 20,
                    },
                    {
                      label: 'Contact Completeness',
                      val: inquiry.qualification_breakdown.contact_completeness,
                      max: inquiry.qualification_breakdown.contact_max || 10,
                    },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-slate-900">
                        {item.val}/{item.max}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Discovery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Business Context
                </h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Industry</dt>
                    <dd className="font-medium text-slate-900">{inquiry.industry}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Business Size</dt>
                    <dd className="font-medium text-slate-900">{inquiry.business_size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Digital Presence</dt>
                    <dd className="font-medium text-slate-900">{inquiry.digital_presence}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Stage</dt>
                    <dd className="font-medium text-slate-900">{inquiry.business_stage}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Submitted</dt>
                    <dd className="font-medium text-slate-900">{formatDate(inquiry.created_at)}</dd>
                  </div>
                </dl>
              </Card>

              <Card>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Constraints &amp; Services
                </h2>
                <dl className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Budget</dt>
                    <dd className="font-medium text-slate-900">{inquiry.budget_range}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Timeline</dt>
                    <dd className="font-medium text-slate-900">{inquiry.timeline}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Urgency</dt>
                    <dd className="font-medium text-slate-900">{inquiry.urgency || '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Readiness</dt>
                    <dd className="font-medium text-slate-900">
                      {inquiry.project_readiness || '—'}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-1.5">
                  {(inquiry.selected_services || []).map((svc) => (
                    <Badge key={svc} variant="blue">
                      {SERVICE_LABEL_MAP[svc] || svc}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
