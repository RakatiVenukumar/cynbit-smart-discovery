import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
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
  Legend,
} from 'recharts'
import { Search, Info, ArrowRight } from 'lucide-react'

const DEMO_INQUIRIES = [
  {
    id: 'demo-1',
    reference_id: 'CSD-20261124-AB123',
    full_name: 'Priya Sharma',
    company_name: 'TechVentures India (Synthetic)',
    industry: 'Technology',
    selected_services: ['ai_automation', 'custom_software'],
    qualification_score: 87,
    priority: 'high',
    status: 'contacted',
    created_at: '2026-11-24T10:30:00Z',
  },
  {
    id: 'demo-2',
    reference_id: 'CSD-20261123-CD456',
    full_name: 'Rahul Mehta',
    company_name: 'RetailPro Solutions (Synthetic)',
    industry: 'Retail & E-Commerce',
    selected_services: ['ecommerce_development', 'digital_marketing'],
    qualification_score: 72,
    priority: 'medium',
    status: 'new',
    created_at: '2026-11-23T14:15:00Z',
  },
  {
    id: 'demo-3',
    reference_id: 'CSD-20261122-EF789',
    full_name: 'Ananya Krishnan',
    company_name: 'HealthFirst Clinic (Synthetic)',
    industry: 'Healthcare',
    selected_services: ['custom_software', 'mobile_development'],
    qualification_score: 91,
    priority: 'high',
    status: 'in_progress',
    created_at: '2026-11-22T09:45:00Z',
  },
  {
    id: 'demo-4',
    reference_id: 'CSD-20261121-GH012',
    full_name: 'Vikram Patel',
    company_name: 'EduLearn Platform (Synthetic)',
    industry: 'Education',
    selected_services: ['website_development', 'mobile_development'],
    qualification_score: 55,
    priority: 'medium',
    status: 'new',
    created_at: '2026-11-21T16:20:00Z',
  },
  {
    id: 'demo-5',
    reference_id: 'CSD-20261120-IJ345',
    full_name: 'Deepa Nair',
    company_name: 'CloudFirst Startup (Synthetic)',
    industry: 'Technology',
    selected_services: ['cloud_solutions', 'ai_automation'],
    qualification_score: 34,
    priority: 'low',
    status: 'closed',
    created_at: '2026-11-20T11:00:00Z',
  },
  {
    id: 'demo-6',
    reference_id: 'CSD-20261119-KL678',
    full_name: 'Arjun Verma',
    company_name: 'FinEdge Advisory (Synthetic)',
    industry: 'Finance & Banking',
    selected_services: ['crm_erp', 'cloud_solutions'],
    qualification_score: 82,
    priority: 'high',
    status: 'converted',
    created_at: '2026-11-19T13:10:00Z',
  },
]

const PRIORITY_COLORS = {
  high: '#dc2626',
  medium: '#d97706',
  low: '#64748b',
}

export default function DemoAdminPage() {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return DEMO_INQUIRIES.filter((inq) => {
      if (priorityFilter && inq.priority !== priorityFilter) return false
      if (statusFilter && inq.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          inq.company_name.toLowerCase().includes(q) ||
          inq.full_name.toLowerCase().includes(q) ||
          inq.reference_id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, priorityFilter, statusFilter])

  const serviceData = useMemo(() => {
    const counts = {}
    DEMO_INQUIRIES.forEach((inq) => {
      inq.selected_services.forEach((svc) => {
        counts[svc] = (counts[svc] || 0) + 1
      })
    })
    return Object.entries(counts).map(([svc, count]) => ({
      name: SERVICE_LABEL_MAP[svc] || svc,
      count,
    }))
  }, [])

  const priorityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 }
    DEMO_INQUIRIES.forEach((inq) => {
      counts[inq.priority] = (counts[inq.priority] || 0) + 1
    })
    return Object.entries(counts).map(([key, value]) => ({
      key,
      name: formatPriority(key),
      value,
    }))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-sm">
          <Info className="w-5 h-5 shrink-0 text-cyan-700 mt-0.5" />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              <strong>Public Demo Dashboard (Synthetic Data Only):</strong> All records below are
              synthetic demonstration entries. No real customer inquiries or database records are
              exposed here.
            </span>
            <Link to="/discover" className="shrink-0">
              <Button size="sm" className="gap-1.5 whitespace-nowrap">
                Try Discovery Wizard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Lead Qualification Dashboard (Demo)
          </h1>
          <p className="text-sm text-slate-600">
            Preview of how Cynbit teams could triage and analyze structured discovery inquiries.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">Total Inquiries</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{DEMO_INQUIRIES.length}</p>
          </Card>
          <Card padding="p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">New Inquiries</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {DEMO_INQUIRIES.filter((i) => i.status === 'new').length}
            </p>
          </Card>
          <Card padding="p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">High Priority</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {DEMO_INQUIRIES.filter((i) => i.priority === 'high').length}
            </p>
          </Card>
          <Card padding="p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">Converted</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {DEMO_INQUIRIES.filter((i) => i.status === 'converted').length}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-base font-bold text-slate-900 mb-4">Service Demand</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1a56db" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-bold text-slate-900 mb-4">Priority Distribution</h2>
            <div className="h-64">
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
                      <Cell key={entry.key} fill={PRIORITY_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <h2 className="text-base font-bold text-slate-900">Synthetic Inquiries</h2>
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
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inq) => (
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
                      {inq.qualification_score}/100
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={inq.priority}>{formatPriority(inq.priority)}</Badge>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={inq.status}>{formatStatus(inq.status)}</Badge>
                    </td>
                    <td className="py-3.5 text-xs text-slate-500">{formatDate(inq.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
