import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { SERVICE_OPTIONS, SERVICE_LABEL_MAP } from '../data/services'
import {
  INDUSTRIES,
  BUSINESS_SIZES,
  DIGITAL_PRESENCES,
  BUSINESS_STAGES,
  BUSINESS_GOALS,
  CHALLENGES,
  REQUIRED_FEATURES_OPTIONS,
  BUDGET_RANGES,
  TIMELINES,
  URGENCIES,
  READINESS_OPTIONS,
} from '../data/wizardOptions'
import { useDiscovery, buildDiscoveryPayload } from '../hooks/useDiscovery'
import { api } from '../services/api'
import {
  Bot,
  Globe,
  ShoppingCart,
  Smartphone,
  Code,
  Users,
  Cloud,
  TrendingUp,
  HelpCircle,
  Check,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
} from 'lucide-react'

const ICON_MAP = {
  Bot,
  Globe,
  ShoppingCart,
  Smartphone,
  Code,
  Users,
  Cloud,
  TrendingUp,
  HelpCircle,
}

const STEP_LABELS = [
  'Services',
  'Business Info',
  'Requirements',
  'Constraints',
  'Contact & Review',
]

export default function DiscoverPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const restoredState = location.state?.formData || null
  const { formData, updateField, toggleArrayItem } = useDiscovery(restoredState)

  const [step, setStep] = useState(restoredState ? 5 : 1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const validateStep = (currentStep) => {
    setError('')
    if (currentStep === 1) {
      if (formData.selectedServices.length === 0) {
        setError('Please select at least one service category (or "Not Sure Yet").')
        return false
      }
    }
    if (currentStep === 2) {
      if (
        !formData.industry ||
        !formData.businessSize ||
        !formData.digitalPresence ||
        !formData.businessStage
      ) {
        setError('Please complete all four business profile fields.')
        return false
      }
      if (formData.industry === 'Other' && !formData.industryOther.trim()) {
        setError('Please specify your industry.')
        return false
      }
    }
    if (currentStep === 3) {
      if (formData.businessGoals.length === 0) {
        setError('Please select at least one business goal.')
        return false
      }
    }
    if (currentStep === 4) {
      if (
        !formData.budgetRange ||
        !formData.timeline ||
        !formData.urgency ||
        !formData.projectReadiness
      ) {
        setError('Please select an option for all four project constraint fields.')
        return false
      }
    }
    if (currentStep === 5) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.companyName.trim()) {
        setError('Full name, email address, and company name are required.')
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        setError('Please enter a valid email address.')
        return false
      }
      if (!formData.consent) {
        setError('You must check the consent box to generate your prototype blueprint.')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 5))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGenerateBlueprint = async () => {
    if (!validateStep(5)) return

    setLoading(true)
    setError('')
    try {
      const payload = buildDiscoveryPayload(formData)
      const res = await api.recommend(payload)
      navigate('/blueprint', {
        state: {
          formData,
          recommendations: res.data.recommendations || [],
        },
      })
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Unable to reach the recommendation service. Please ensure the backend API is running and try again.'
      setError(typeof msg === 'string' ? msg : 'Failed to generate blueprint.')
    } finally {
      setLoading(false)
    }
  }

  const hasWebsite = formData.selectedServices.includes('website_development')
  const hasAI = formData.selectedServices.includes('ai_automation')
  const hasCustom = formData.selectedServices.includes('custom_software')

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Project Discovery Wizard
          </h1>
          <p className="text-sm text-slate-600">
            Complete the five steps below to generate your personalized preliminary project
            blueprint.
          </p>
        </div>

        <Card className="mb-6" padding="p-5">
          <ProgressBar currentStep={step} totalSteps={5} labels={STEP_LABELS} />
        </Card>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div role="region" aria-label="Discovery Wizard Form">
          <Card padding="p-6 sm:p-8">
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  What can we help you build?
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Select one or more service categories that match your initiative.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SERVICE_OPTIONS.map((svc) => {
                    const Icon = ICON_MAP[svc.icon] || Code
                    const selected = formData.selectedServices.includes(svc.id)
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleArrayItem('selectedServices', svc.id)}
                        aria-pressed={selected}
                        className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                          selected
                            ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {selected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                            selected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="font-semibold text-sm text-slate-900 mb-1 pr-6">
                          {svc.label}
                        </div>
                        <div className="text-xs text-slate-500 leading-relaxed">
                          {svc.description}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Tell us about your business
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  This context tailors the complexity, architecture, and onboarding roadmap.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Industry *
                    </label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => updateField('industry', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-blue-600"
                    >
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.industry === 'Other' && (
                    <div>
                      <label
                        htmlFor="industryOther"
                        className="block text-sm font-medium text-slate-700 mb-1.5"
                      >
                        Specify Industry *
                      </label>
                      <input
                        id="industryOther"
                        type="text"
                        maxLength={80}
                        value={formData.industryOther}
                        onChange={(e) => updateField('industryOther', e.target.value)}
                        placeholder="e.g., Logistics & Supply Chain"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="businessSize"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Business Size *
                    </label>
                    <select
                      id="businessSize"
                      value={formData.businessSize}
                      onChange={(e) => updateField('businessSize', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select team size...</option>
                      {BUSINESS_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="digitalPresence"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Existing Digital Presence *
                    </label>
                    <select
                      id="digitalPresence"
                      value={formData.digitalPresence}
                      onChange={(e) => updateField('digitalPresence', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select current presence...</option>
                      {DIGITAL_PRESENCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="businessStage"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Business Stage *
                    </label>
                    <select
                      id="businessStage"
                      value={formData.businessStage}
                      onChange={(e) => updateField('businessStage', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select business stage...</option>
                      {BUSINESS_STAGES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Define your project requirements
                  </h2>
                  <p className="text-sm text-slate-600">
                    Select your primary goals, current bottlenecks, and any service-specific
                    details.
                  </p>
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    Primary Business Goals * (Select at least one)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {BUSINESS_GOALS.map((goal) => {
                      const checked = formData.businessGoals.includes(goal)
                      return (
                        <label
                          key={goal}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                            checked
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleArrayItem('businessGoals', goal)}
                            className="rounded text-blue-600 focus:ring-blue-600"
                          />
                          <span>{goal}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    Current Challenges (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CHALLENGES.map((ch) => {
                      const checked = formData.currentChallenges.includes(ch)
                      return (
                        <label
                          key={ch}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                            checked
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleArrayItem('currentChallenges', ch)}
                            className="rounded text-blue-600 focus:ring-blue-600"
                          />
                          <span>{ch}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Required Functionality */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    Required Functionality (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {REQUIRED_FEATURES_OPTIONS.map((feat) => {
                      const checked = formData.requiredFeatures.includes(feat)
                      return (
                        <label
                          key={feat}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                            checked
                              ? 'border-cyan-600 bg-cyan-50 text-cyan-950 font-medium'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleArrayItem('requiredFeatures', feat)}
                            className="rounded text-cyan-600 focus:ring-cyan-600"
                          />
                          <span>{feat}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Conditional Questions: Website */}
                {hasWebsite && (
                  <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-4">
                    <h3 className="text-sm font-bold text-blue-900">
                      Website Development Specifics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          New Website or Redesign?
                        </label>
                        <select
                          value={formData.websiteType}
                          onChange={(e) => updateField('websiteType', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                          <option value="">Select...</option>
                          <option value="New Website">New Website from Scratch</option>
                          <option value="Redesign">Website Redesign &amp; Modernization</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Required Pages (e.g. Home, Services, Blog)
                        </label>
                        <input
                          type="text"
                          value={formData.requiredPages}
                          onChange={(e) => updateField('requiredPages', e.target.value)}
                          placeholder="Home, About, Services, Contact..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          CMS Required?
                        </label>
                        <select
                          value={formData.cmsRequired}
                          onChange={(e) => updateField('cmsRequired', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                          <option value="">Select...</option>
                          <option value="Yes">Yes — Non-technical team updates</option>
                          <option value="No">No — Static / Developer managed</option>
                          <option value="Unsure">Unsure</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          E-Commerce Functionality Needed?
                        </label>
                        <select
                          value={formData.ecommerceNeeded}
                          onChange={(e) => updateField('ecommerceNeeded', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                          <option value="">Select...</option>
                          <option value="Yes">Yes — Online payments &amp; cart</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Questions: AI Automation */}
                {hasAI && (
                  <div className="p-5 rounded-xl bg-cyan-50/60 border border-cyan-200 space-y-4">
                    <h3 className="text-sm font-bold text-cyan-950">
                      AI &amp; Automation Specifics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Repetitive Tasks to Automate
                        </label>
                        <input
                          type="text"
                          value={formData.repetitiveTasks}
                          onChange={(e) => updateField('repetitiveTasks', e.target.value)}
                          placeholder="e.g., Invoice entry, support triage"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Existing Workflows / Tools
                        </label>
                        <input
                          type="text"
                          value={formData.existingWorkflows}
                          onChange={(e) => updateField('existingWorkflows', e.target.value)}
                          placeholder="e.g., Google Sheets, Slack, HubSpot"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Integration Requirements
                        </label>
                        <input
                          type="text"
                          value={formData.automationIntegrations}
                          onChange={(e) => updateField('automationIntegrations', e.target.value)}
                          placeholder="e.g., ERP API, Email, CRM"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Primary Automation Objective
                        </label>
                        <input
                          type="text"
                          value={formData.automationObjectives}
                          onChange={(e) => updateField('automationObjectives', e.target.value)}
                          placeholder="e.g., Reduce manual hours by 50%"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Questions: Custom Software */}
                {hasCustom && (
                  <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-4">
                    <h3 className="text-sm font-bold text-indigo-950">
                      Custom Software Specifics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Expected User Roles
                        </label>
                        <input
                          type="text"
                          value={formData.userRoles}
                          onChange={(e) => updateField('userRoles', e.target.value)}
                          placeholder="e.g., Admin, Manager, Customer"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Core Business Processes
                        </label>
                        <input
                          type="text"
                          value={formData.businessProcesses}
                          onChange={(e) => updateField('businessProcesses', e.target.value)}
                          placeholder="e.g., Order approvals, inventory"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Reporting &amp; Analytics Needs
                        </label>
                        <input
                          type="text"
                          value={formData.reportingNeeds}
                          onChange={(e) => updateField('reportingNeeds', e.target.value)}
                          placeholder="e.g., Monthly KPI exports, live charts"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Third-Party Integrations
                        </label>
                        <input
                          type="text"
                          value={formData.integrationRequirements}
                          onChange={(e) => updateField('integrationRequirements', e.target.value)}
                          placeholder="e.g., Payment gateway, Tally, Zoho"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Description */}
                <div>
                  <label
                    htmlFor="projectDescription"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Project Description (Optional)
                  </label>
                  <textarea
                    id="projectDescription"
                    rows={4}
                    maxLength={2000}
                    value={formData.projectDescription}
                    onChange={(e) => updateField('projectDescription', e.target.value)}
                    placeholder="Briefly describe what you are trying to achieve, key pain points, or any existing systems..."
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1 text-right">
                    {formData.projectDescription.length}/2000
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Project Constraints &amp; Readiness
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  Share your indicative budget, timeline, urgency, and readiness to start.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="budgetRange"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Indicative Budget Range *
                    </label>
                    <select
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) => updateField('budgetRange', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select budget range...</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Expected Timeline *
                    </label>
                    <select
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => updateField('timeline', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select timeline...</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="urgency"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Project Urgency *
                    </label>
                    <select
                      id="urgency"
                      value={formData.urgency}
                      onChange={(e) => updateField('urgency', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select urgency...</option>
                      {URGENCIES.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="projectReadiness"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Project Readiness *
                    </label>
                    <select
                      id="projectReadiness"
                      value={formData.projectReadiness}
                      onChange={(e) => updateField('projectReadiness', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
                    >
                      <option value="">Select readiness...</option>
                      {READINESS_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Contact Information &amp; Review
                  </h2>
                  <p className="text-sm text-slate-600">
                    Enter contact details to personalize your blueprint. Public evaluators should
                    use fictional information (e.g., Alex Rivera / alex@example.com).
                  </p>
                </div>

                {/* Toggle Review */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowReview((r) => !r)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    {showReview ? 'Hide Summary Review' : 'Review Your Selections'}
                  </button>

                  {showReview && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                      <div>
                        <strong>Services:</strong>{' '}
                        {formData.selectedServices
                          .map((id) => SERVICE_LABEL_MAP[id] || id)
                          .join(', ')}
                      </div>
                      <div>
                        <strong>Business:</strong> {formData.industry} · {formData.businessSize} ·{' '}
                        {formData.businessStage}
                      </div>
                      <div>
                        <strong>Goals:</strong> {formData.businessGoals.join(', ')}
                      </div>
                      <div>
                        <strong>Constraints:</strong> {formData.budgetRange} · {formData.timeline}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      maxLength={200}
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      maxLength={254}
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Company Name *
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      maxLength={200}
                      value={formData.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      placeholder="Example Innovations Ltd."
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={30}
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateField('consent', e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-600"
                  />
                  <span>
                    I understand this is an independent assessment prototype and consent to storing
                    these details in the prototype database. I will use fictional contact details if
                    evaluating publicly.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={handleBack} className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button key="next-btn" type="button" onClick={handleNext} className="gap-1.5">
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  key="submit-btn"
                  type="button"
                  onClick={handleGenerateBlueprint}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Blueprint...
                    </>
                  ) : (
                    <>
                      Generate Project Blueprint
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
