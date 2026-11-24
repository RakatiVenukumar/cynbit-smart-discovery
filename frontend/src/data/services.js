export const SERVICE_OPTIONS = [
  {
    id: 'ai_automation',
    label: 'AI & Automation',
    icon: 'Bot',
    description: 'Intelligent workflow automation, AI agents, and process optimization',
  },
  {
    id: 'website_development',
    label: 'Website Development',
    icon: 'Globe',
    description: 'Modern, responsive websites and high-converting web experiences',
  },
  {
    id: 'ecommerce_development',
    label: 'E-Commerce Development',
    icon: 'ShoppingCart',
    description: 'Online storefronts, payment gateways, and inventory workflows',
  },
  {
    id: 'mobile_development',
    label: 'Mobile App Development',
    icon: 'Smartphone',
    description: 'Cross-platform iOS and Android mobile applications',
  },
  {
    id: 'custom_software',
    label: 'Custom Software Development',
    icon: 'Code',
    description: 'Tailored web platforms, portals, and enterprise applications',
  },
  {
    id: 'crm_erp',
    label: 'CRM & ERP Solutions',
    icon: 'Users',
    description: 'Centralized customer pipelines, billing, and operations systems',
  },
  {
    id: 'cloud_solutions',
    label: 'Cloud Solutions',
    icon: 'Cloud',
    description: 'Cloud migration, containerization, CI/CD, and scalable infrastructure',
  },
  {
    id: 'digital_marketing',
    label: 'Digital Marketing & SEO',
    icon: 'TrendingUp',
    description: 'Search visibility, lead generation, and analytics-driven growth',
  },
  {
    id: 'not_sure',
    label: 'Not Sure Yet',
    icon: 'HelpCircle',
    description: 'Help me identify the best-fit technology roadmap for my goals',
  },
]

export const SERVICE_LABEL_MAP = Object.fromEntries(
  SERVICE_OPTIONS.map((s) => [s.id, s.label])
)
