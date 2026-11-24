from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class Recommendation:
    solution_name: str
    recommended_service: str
    reasoning: str
    suggested_features: list[str] = field(default_factory=list)
    suggested_tech_stack: list[str] = field(default_factory=list)
    indicative_timeline: str = "3-6 months"
    complexity_level: str = "medium"  # low / medium / high
    implementation_roadmap: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


def _get_complexity(budget_range: str) -> str:
    low_budgets = ["Under ₹5 Lakhs (< $6K)", "₹5-25 Lakhs ($6K-$30K)"]
    high_budgets = ["₹75L-2Cr ($90K-$240K)", "Above ₹2 Crore ($240K+)"]
    if budget_range in high_budgets:
        return "high"
    if budget_range in low_budgets:
        return "low"
    return "medium"


def _get_timeline(timeline: str) -> str:
    mapping = {
        "ASAP (within 1 month)": "4-6 weeks",
        "1-3 months": "1-3 months",
        "3-6 months": "3-6 months",
        "6-12 months": "6-12 months",
        "More than 12 months": "12+ months",
        "Flexible": "3-6 months",
    }
    return mapping.get(timeline, "3-6 months")


def generate_recommendations(
    selected_services: list[str],
    industry: str,
    business_goals: list[str],
    digital_presence: str,
    challenges: list[str],
    project_requirements: dict,
    budget_range: str,
    timeline: str,
    **kwargs: Any,
) -> list[dict]:
    recs: list[Recommendation] = []
    complexity = _get_complexity(budget_range)
    tl = _get_timeline(timeline)
    goals_lower = [g.lower() for g in business_goals]
    challenges_lower = [c.lower() for c in challenges]

    # AI & Automation
    if "ai_automation" in selected_services or any(
        kw in " ".join(goals_lower + challenges_lower)
        for kw in ["automat", "manual", "repetitiv"]
    ):
        recs.append(
            Recommendation(
                solution_name="AI Workflow Automation Platform",
                recommended_service="AI & Automation",
                reasoning=(
                    "Your inputs indicate manual or repetitive processes that can be significantly "
                    "optimized with intelligent workflow automation and AI-assisted decision-making."
                ),
                suggested_features=[
                    "Process automation with rule-based triggers",
                    "AI-assisted data extraction and classification",
                    "Workflow orchestration dashboard",
                    "Integration with existing tools (email, CRM, ERP)",
                    "Real-time monitoring and alerting",
                    "Audit trail and compliance reporting",
                ],
                suggested_tech_stack=["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "React"],
                indicative_timeline=tl,
                complexity_level=complexity,
                implementation_roadmap=[
                    "Phase 1: Process audit and automation opportunity mapping (2 weeks)",
                    "Phase 2: Core automation engine and workflow builder (4-6 weeks)",
                    "Phase 3: AI model integration and training on domain data (3-4 weeks)",
                    "Phase 4: Integration with existing systems (2-3 weeks)",
                    "Phase 5: Testing, UAT, and deployment (2 weeks)",
                ],
            )
        )

    # Website Development
    if "website_development" in selected_services or digital_presence in [
        "No digital presence yet",
        "Basic website only",
    ]:
        recs.append(
            Recommendation(
                solution_name="Professional Website Development",
                recommended_service="Website Development",
                reasoning=(
                    "A modern, responsive website is essential for digital credibility. "
                    "Your current digital presence indicates significant opportunity for improvement."
                ),
                suggested_features=[
                    "Responsive design for all devices",
                    "SEO-optimised page structure",
                    "Content Management System (CMS)",
                    "Contact and inquiry forms",
                    "Performance-optimised asset delivery",
                    "Analytics integration",
                ],
                suggested_tech_stack=["Next.js", "React", "Tailwind CSS", "Headless CMS (Sanity/Strapi)", "PostgreSQL"],
                indicative_timeline=tl if tl != "12+ months" else "3-6 months",
                complexity_level="low" if complexity == "high" else complexity,
                implementation_roadmap=[
                    "Phase 1: UX research, wireframing and design (2 weeks)",
                    "Phase 2: Frontend development and CMS setup (3-4 weeks)",
                    "Phase 3: Content migration and SEO setup (1-2 weeks)",
                    "Phase 4: Testing, performance audit and launch (1 week)",
                ],
            )
        )

    # E-Commerce
    if "ecommerce_development" in selected_services:
        recs.append(
            Recommendation(
                solution_name="E-Commerce Platform",
                recommended_service="E-Commerce Development",
                reasoning=(
                    "An e-commerce solution will enable direct online sales, expand your market reach "
                    "and provide customers with a seamless purchasing experience."
                ),
                suggested_features=[
                    "Product catalogue and inventory management",
                    "Secure payment gateway integration (Razorpay/Stripe)",
                    "Order tracking and fulfilment workflow",
                    "Customer accounts and wishlist",
                    "Mobile-first shopping experience",
                    "Discount and coupon management",
                ],
                suggested_tech_stack=["Next.js", "Node.js", "PostgreSQL", "Redis", "Razorpay/Stripe", "AWS S3"],
                indicative_timeline=tl,
                complexity_level=complexity,
                implementation_roadmap=[
                    "Phase 1: Requirements, platform selection and design (2-3 weeks)",
                    "Phase 2: Product catalogue and inventory system (3-4 weeks)",
                    "Phase 3: Payment integration and checkout flow (2 weeks)",
                    "Phase 4: Order management and notifications (2 weeks)",
                    "Phase 5: Testing, security audit and launch (2 weeks)",
                ],
            )
        )

    # Mobile App
    if "mobile_development" in selected_services:
        recs.append(
            Recommendation(
                solution_name="Cross-Platform Mobile Application",
                recommended_service="Mobile App Development",
                reasoning=(
                    "A mobile application will improve customer engagement and provide "
                    "convenient, on-the-go access to your services."
                ),
                suggested_features=[
                    "iOS and Android support from a single codebase",
                    "Push notifications",
                    "Offline capability with local caching",
                    "Biometric authentication",
                    "In-app analytics and crash reporting",
                    "App Store and Play Store deployment",
                ],
                suggested_tech_stack=["React Native", "Expo", "Node.js/FastAPI", "PostgreSQL", "Firebase Cloud Messaging"],
                indicative_timeline=tl,
                complexity_level=complexity,
                implementation_roadmap=[
                    "Phase 1: UX design and prototyping (2-3 weeks)",
                    "Phase 2: Core screens and navigation (4-5 weeks)",
                    "Phase 3: API integration and state management (2-3 weeks)",
                    "Phase 4: Push notifications and device features (1-2 weeks)",
                    "Phase 5: Testing on devices, store submission (2 weeks)",
                ],
            )
        )

    # Custom Software
    if "custom_software" in selected_services:
        recs.append(
            Recommendation(
                solution_name="Custom Enterprise Software Platform",
                recommended_service="Custom Software Development",
                reasoning=(
                    "A bespoke software solution tailored to your specific business processes "
                    "will provide competitive advantage and operational efficiency."
                ),
                suggested_features=[
                    "Role-based access control (RBAC)",
                    "Custom workflow engine",
                    "Reporting and analytics dashboard",
                    "API integrations with third-party tools",
                    "Audit logs and compliance features",
                    "Multi-tenant architecture (if required)",
                ],
                suggested_tech_stack=["FastAPI/Django", "React", "PostgreSQL", "Redis", "Docker", "AWS/GCP"],
                indicative_timeline=tl,
                complexity_level="high" if complexity != "low" else "medium",
                implementation_roadmap=[
                    "Phase 1: Requirements gathering and system architecture (3 weeks)",
                    "Phase 2: Database design and core backend (4-6 weeks)",
                    "Phase 3: Frontend dashboard and user interfaces (4-5 weeks)",
                    "Phase 4: Integration, reporting and advanced features (3-4 weeks)",
                    "Phase 5: UAT, security audit and production deployment (2 weeks)",
                ],
            )
        )

    # CRM/ERP
    if "crm_erp" in selected_services:
        recs.append(
            Recommendation(
                solution_name="Integrated CRM & Business Management System",
                recommended_service="CRM & ERP Solutions",
                reasoning=(
                    "A CRM/ERP system will centralise your customer data, streamline operations "
                    "and provide management visibility across your business."
                ),
                suggested_features=[
                    "Customer lifecycle management",
                    "Sales pipeline and opportunity tracking",
                    "Inventory and procurement management",
                    "Financial reporting and invoicing",
                    "Employee and HR module",
                    "Mobile access for field teams",
                ],
                suggested_tech_stack=["Odoo (open-source)", "or Custom FastAPI + React", "PostgreSQL", "Redis", "Docker"],
                indicative_timeline=tl,
                complexity_level=complexity,
                implementation_roadmap=[
                    "Phase 1: Business process mapping and CRM requirements (2 weeks)",
                    "Phase 2: Core CRM and lead management module (4 weeks)",
                    "Phase 3: ERP modules (inventory, finance, HR) (4-6 weeks)",
                    "Phase 4: Integrations and data migration (2-3 weeks)",
                    "Phase 5: Training, go-live support and stabilisation (2 weeks)",
                ],
            )
        )

    # Cloud Solutions
    if "cloud_solutions" in selected_services:
        recs.append(
            Recommendation(
                solution_name="Cloud Infrastructure & Migration",
                recommended_service="Cloud Solutions",
                reasoning=(
                    "Moving to the cloud will improve scalability, reliability and cost-efficiency "
                    "for your infrastructure."
                ),
                suggested_features=[
                    "Cloud architecture design and planning",
                    "Containerisation with Docker and Kubernetes",
                    "CI/CD pipeline setup",
                    "Auto-scaling and load balancing",
                    "Database migration to managed cloud services",
                    "Cost optimisation and monitoring",
                ],
                suggested_tech_stack=["AWS/GCP/Azure", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
                indicative_timeline=tl,
                complexity_level=complexity,
                implementation_roadmap=[
                    "Phase 1: Infrastructure audit and cloud design (2 weeks)",
                    "Phase 2: Environment setup and containerisation (3 weeks)",
                    "Phase 3: Data migration and testing (2-3 weeks)",
                    "Phase 4: CI/CD and monitoring setup (1-2 weeks)",
                    "Phase 5: Cutover, optimisation and training (1 week)",
                ],
            )
        )

    # Digital Marketing
    if "digital_marketing" in selected_services or any(
        kw in " ".join(goals_lower) for kw in ["lead", "brand", "market"]
    ):
        recs.append(
            Recommendation(
                solution_name="Digital Marketing & SEO Platform",
                recommended_service="Digital Marketing & SEO",
                reasoning=(
                    "A structured digital marketing approach will improve your online visibility, "
                    "generate qualified leads and build long-term brand authority."
                ),
                suggested_features=[
                    "SEO audit and keyword strategy",
                    "Content marketing system",
                    "Social media management integration",
                    "Email marketing automation",
                    "Lead capture and nurturing",
                    "Analytics and ROI reporting",
                ],
                suggested_tech_stack=["Next.js (SEO-optimised)", "Mailchimp/SendGrid", "Google Analytics 4", "Search Console"],
                indicative_timeline="3-6 months",
                complexity_level="low",
                implementation_roadmap=[
                    "Phase 1: SEO audit, competitor analysis and content strategy (2 weeks)",
                    "Phase 2: On-page SEO, metadata and technical fixes (2 weeks)",
                    "Phase 3: Content creation and campaign setup (ongoing)",
                    "Phase 4: Performance tracking and optimisation (ongoing)",
                ],
            )
        )

    # Not sure / General
    if "not_sure" in selected_services or not recs:
        recs.append(
            Recommendation(
                solution_name="Digital Transformation Strategy & Roadmap",
                recommended_service="Consultation & Discovery",
                reasoning=(
                    "Before committing to a specific technology, a structured discovery engagement "
                    "will help identify the highest-impact digital investment for your business."
                ),
                suggested_features=[
                    "Current state technology audit",
                    "Business process mapping",
                    "Digital maturity assessment",
                    "Technology roadmap development",
                    "ROI analysis per initiative",
                    "Vendor and technology recommendations",
                ],
                suggested_tech_stack=["To be determined based on discovery findings"],
                indicative_timeline="4-6 weeks",
                complexity_level="low",
                implementation_roadmap=[
                    "Week 1-2: Stakeholder interviews and current state assessment",
                    "Week 2-3: Process mapping and gap analysis",
                    "Week 3-4: Technology evaluation and recommendations",
                    "Week 4-6: Roadmap presentation and prioritisation workshop",
                ],
            )
        )

    return [r.to_dict() for r in recs]
