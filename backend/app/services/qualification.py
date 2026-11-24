from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class QualificationBreakdown:
    budget_readiness: int = 0
    timeline_clarity: int = 0
    requirement_clarity: int = 0
    business_readiness: int = 0
    contact_completeness: int = 0
    notes: list[str] = field(default_factory=list)

    def total(self) -> int:
        return (
            self.budget_readiness
            + self.timeline_clarity
            + self.requirement_clarity
            + self.business_readiness
            + self.contact_completeness
        )

    def to_dict(self) -> dict:
        return {
            "budget_readiness": self.budget_readiness,
            "budget_max": 25,
            "timeline_clarity": self.timeline_clarity,
            "timeline_max": 20,
            "requirement_clarity": self.requirement_clarity,
            "requirement_max": 25,
            "business_readiness": self.business_readiness,
            "business_max": 20,
            "contact_completeness": self.contact_completeness,
            "contact_max": 10,
            "total": self.total(),
            "notes": self.notes,
        }


UNDEFINED_BUDGET = {"Unsure / To be discussed", "", None}
FLEXIBLE_TIMELINE = {"Flexible", "", None}

STAGE_SCORES = {
    "Established (3-10 years)": 20,
    "Mature / Enterprise (10+ years)": 20,
    "Growth stage (1-3 years)": 15,
    "Early stage (< 1 year)": 10,
    "Pre-launch / Idea stage": 5,
}

PRESENCE_SCORES = {
    "Full digital presence": 20,
    "E-commerce active": 18,
    "Website + social media": 14,
    "Basic website only": 10,
    "No digital presence yet": 5,
}


def calculate_qualification(
    budget_range: str,
    timeline: str,
    project_requirements: dict,
    business_goals: list[str],
    challenges: list[str],
    business_stage: str,
    digital_presence: str,
    full_name: str,
    email: str,
    phone: str | None,
    company_name: str,
    **kwargs: Any,
) -> tuple[int, dict, str]:
    """Return (score, breakdown_dict, priority)."""
    bd = QualificationBreakdown()

    # --- Budget Readiness (max 25) ---
    if budget_range not in UNDEFINED_BUDGET:
        bd.budget_readiness = 25
        bd.notes.append(f"Defined budget range: {budget_range}")
    else:
        bd.budget_readiness = 10
        bd.notes.append("Budget not yet defined — reduced score")

    # --- Timeline Clarity (max 20) ---
    if timeline not in FLEXIBLE_TIMELINE:
        bd.timeline_clarity = 20
        bd.notes.append(f"Defined timeline: {timeline}")
    else:
        bd.timeline_clarity = 10
        bd.notes.append("Flexible timeline — partial score")

    # --- Requirement Clarity (max 25) ---
    clarity_score = 0
    description = project_requirements.get("project_description", "")
    if description and len(description) > 100:
        clarity_score += 10
        bd.notes.append("Detailed project description provided")
    elif description and len(description) > 30:
        clarity_score += 5

    if business_goals:
        clarity_score += min(len(business_goals) * 2, 8)
    if challenges:
        clarity_score += min(len(challenges) * 1, 7)

    bd.requirement_clarity = min(clarity_score, 25)

    # --- Business Readiness (max 20) ---
    stage_score = STAGE_SCORES.get(business_stage, 10)
    presence_score = PRESENCE_SCORES.get(digital_presence, 10)
    bd.business_readiness = min(round((stage_score + presence_score) / 2), 20)
    bd.notes.append(f"Business stage: {business_stage}")

    # --- Contact Completeness (max 10) ---
    if phone and phone.strip():
        bd.contact_completeness = 10
        bd.notes.append("Full contact details provided (name, email, phone)")
    elif email and full_name:
        bd.contact_completeness = 7
        bd.notes.append("Email and name provided")
    else:
        bd.contact_completeness = 3

    score = bd.total()

    # Priority
    if score >= 75:
        priority = "high"
    elif score >= 40:
        priority = "medium"
    else:
        priority = "low"

    return score, bd.to_dict(), priority
