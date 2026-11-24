import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { api } from '../../services/api'
import { SERVICE_LABEL_MAP } from '../../data/services'
import { formatDate, formatStatus, formatPriority } from '../../utils/formatters'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { LogOut, Search, Download, Eye, AlertCircle } from 'lucide-react'

const PRIORITY_COLORS = {
  high: '#dc2626',
  medium: '#d97706',
  low: '#64748b',
}

// Prevent CSV formula injection (=, +, -, @, \t, \r)
function sanitizeCsvCell(val) {
  const str = String(val ?? '')
  const escaped = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str
  return `"${escaped.replace(/"/g, '""')}"`
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [anRes, inqRes] = await Promise.all([
        api.getAnalytics(),
        api.getInquiries({
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          search: search.trim() || undefined,
        }),
      ])
      setAnalytics(anRes.data)
      setInquiries(inqRes.data || [])
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.removeItem('admin_token')
        navigate('/admin/login', { replace: true })
        return
      }
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter, search, navigate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const handleExportCsv = () => {
    const headers = [
      'Reference ID',
      'Company',
      'Contact Name',
      'Email',
      'Industry',
      'Score',
      'Priority',
      'Status',
      'Created At',
    ]
    const rows = inquiries.map((inq) => [
      inq.reference_id,
      inq.company_name,
      inq.full_name,
      inq.email,
      inq.industry,
      inq.qualification_score ?? '',
      inq.priority,
      inq.status,
      inq.created_at,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map(sanitizeCsvCell).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cynbit-inquiries.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const priorityData = analytics
    ? Object.entries(analytics.by_priority || {}).map(([name, value]) => ({
        name: formatPriority(name),
        key: name,
        value,
      }))
    : []

  const serviceData = (analytics?.by_service || []).map((item) => ({
    name: SERVICE_LABEL_MAP[item.service] || item.service,
    count: item.count,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Administrator Dashboard</h1>
            <p className="text-sm text-slate-600">
              Manage incoming project discovery inquiries and qualification scores.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading && !analytics ? (
          <LoadingSpinner label="Loading analytics and inquiries..." />
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card padding="p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">Total Inquiries</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{analytics?.total ?? 0}</p>
              </Card>
              <Card padding="p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">New Inquiries</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{analytics?.new ?? 0}</p>
              </Card>
              <Card padding="p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">High Priority</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {analytics?.high_priority ?? 0}
                </p>
              </Card>
              <Card padding="p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">Converted</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {analytics?.converted ?? 0}
                </p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-base font-bold text-slate-900 mb-4">Service Demand</h2>
                <div className="h-64">
                  {serviceData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No service demand data yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1a56db" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              <Card>
                <h2 className="text-base font-bold text-slate-900 mb-4">Priority Distribution</h2>
                <div className="h-64">
                  {priorityData.every((d) => d.value === 0) ? (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">
                      No priority data yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priorityData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {priorityData.map((entry) => (
                            <Cell
                              key={entry.key}
                              fill={PRIORITY_COLORS[entry.key] || '#64748b'}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </div>

            {/* Filters & Table */}
            <Card>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <h2 className="text-base font-bold text-slate-900">Inquiries</h2>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search company or contact..."
                      className="pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No inquiries match your current filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                        <th className="py-3 pr-4">Ref ID</th>
                        <th className="py-3 pr-4">Company / Contact</th>
                        <th className="py-3 pr-4">Industry</th>
                        <th className="py-3 pr-4">Score</th>
                        <th className="py-3 pr-4">Priority</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50">
                          <td className="py-3.5 pr-4 font-mono text-xs text-slate-700">
                            {inq.reference_id}
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="font-semibold text-slate-900">{inq.company_name}</div>
                            <div className="text-xs text-slate-500">{inq.full_name}</div>
                          </td>
                          <td className="py-3.5 pr-4 text-slate-700">{inq.industry}</td>
                          <td className="py-3.5 pr-4 font-semibold text-slate-900">
                            {inq.qualification_score ?? '—'}/100
                          </td>
                          <td className="py-3.5 pr-4">
                            <Badge variant={inq.priority}>{formatPriority(inq.priority)}</Badge>
                          </td>
                          <td className="py-3.5 pr-4">
                            <Badge variant={inq.status}>{formatStatus(inq.status)}</Badge>
                          </td>
                          <td className="py-3.5 pr-4 text-xs text-slate-500">
                            {formatDate(inq.created_at)}
                          </td>
                          <td className="py-3.5 text-right">
                            <Link to={`/admin/inquiries/${inq.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
