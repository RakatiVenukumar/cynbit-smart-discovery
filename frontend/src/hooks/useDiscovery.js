import { useState, useCallback } from 'react'

export const INITIAL_DISCOVERY_STATE = {
  step: 1,
  // Step 1
  selectedServices: [],
  // Step 2
  industry: '',
  industryOther: '',
  businessSize: '',
  digitalPresence: '',
  businessStage: '',
  // Step 3
  businessGoals: [],
  currentChallenges: [],
  requiredFeatures: [],
  projectDescription: '',
  // Step 3 conditional — Website
  websiteType: '',
  requiredPages: '',
  cmsRequired: '',
  ecommerceNeeded: '',
  // Step 3 conditional — AI Automation
  repetitiveTasks: '',
  existingWorkflows: '',
  automationIntegrations: '',
  automationObjectives: '',
  // Step 3 conditional — Custom Software
  userRoles: '',
  businessProcesses: '',
  reportingNeeds: '',
  integrationRequirements: '',
  // Step 4
  budgetRange: '',
  timeline: '',
  urgency: '',
  projectReadiness: '',
  // Step 5 (never persisted to localStorage)
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  consent: false,
}

export function useDiscovery(initialState = null) {
  const [formData, setFormData] = useState(
    initialState ? { ...INITIAL_DISCOVERY_STATE, ...initialState } : INITIAL_DISCOVERY_STATE
  )

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleArrayItem = useCallback((field, item) => {
    setFormData((prev) => {
      const current = prev[field] || []
      const exists = current.includes(item)
      return {
        ...prev,
        [field]: exists ? current.filter((i) => i !== item) : [...current, item],
      }
    })
  }, [])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_DISCOVERY_STATE)
  }, [])

  return {
    formData,
    setFormData,
    updateField,
    toggleArrayItem,
    resetForm,
  }
}

export function buildDiscoveryPayload(formData) {
  const industry =
    formData.industry === 'Other' && formData.industryOther.trim()
      ? `Other: ${formData.industryOther.trim()}`
      : formData.industry

  return {
    selected_services: formData.selectedServices,
    industry,
    business_size: formData.businessSize,
    digital_presence: formData.digitalPresence,
    business_stage: formData.businessStage,
    business_goals: formData.businessGoals,
    challenges: formData.currentChallenges,
    project_requirements: {
      required_features: formData.requiredFeatures,
      project_description: formData.projectDescription,
      website: formData.selectedServices.includes('website_development')
        ? {
            website_type: formData.websiteType,
            required_pages: formData.requiredPages,
            cms_required: formData.cmsRequired,
            ecommerce_needed: formData.ecommerceNeeded,
          }
        : undefined,
      ai_automation: formData.selectedServices.includes('ai_automation')
        ? {
            repetitive_tasks: formData.repetitiveTasks,
            existing_workflows: formData.existingWorkflows,
            automation_integrations: formData.automationIntegrations,
            automation_objectives: formData.automationObjectives,
          }
        : undefined,
      custom_software: formData.selectedServices.includes('custom_software')
        ? {
            user_roles: formData.userRoles,
            business_processes: formData.businessProcesses,
            reporting_needs: formData.reportingNeeds,
            integration_requirements: formData.integrationRequirements,
          }
        : undefined,
    },
    budget_range: formData.budgetRange,
    timeline: formData.timeline,
    urgency: formData.urgency,
    project_readiness: formData.projectReadiness,
  }
}
