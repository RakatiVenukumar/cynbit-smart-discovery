from pydantic import BaseModel, EmailStr, Field
from typing import Any
import uuid


class DiscoveryInput(BaseModel):
    selected_services: list[str] = Field(..., min_length=1)
    industry: str = Field(..., min_length=1, max_length=100)
    business_size: str = Field(..., min_length=1, max_length=100)
    digital_presence: str = Field(..., min_length=1, max_length=100)
    business_stage: str = Field(..., min_length=1, max_length=100)
    business_goals: list[str] = Field(default_factory=list)
    challenges: list[str] = Field(default_factory=list)
    project_requirements: dict[str, Any] = Field(default_factory=dict)
    budget_range: str = Field(..., min_length=1, max_length=100)
    timeline: str = Field(..., min_length=1, max_length=100)
    urgency: str = Field(default="", max_length=100)
    project_readiness: str = Field(default="", max_length=100)


class InquiryCreate(DiscoveryInput):
    full_name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    company_name: str = Field(..., min_length=1, max_length=200)
    consent: bool
    idempotency_key: str = Field(..., min_length=10, max_length=100)

    def model_post_init(self, __context: Any) -> None:
        if not self.consent:
            raise ValueError("Consent is required to submit an inquiry.")


class InquiryStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|contacted|in_progress|converted|closed)$")


class InquiryResponse(BaseModel):
    id: uuid.UUID
    reference_id: str
    full_name: str
    email: str
    company_name: str
    industry: str
    selected_services: Any
    qualification_score: int | None
    priority: str
    status: str
    created_at: Any

    model_config = {"from_attributes": True}


class InquiryDetail(InquiryResponse):
    phone: str | None
    business_size: str
    digital_presence: str
    business_stage: str
    business_goals: Any
    project_requirements: Any
    budget_range: str
    timeline: str
    urgency: str
    project_readiness: str
    recommendation: Any
    qualification_breakdown: Any
    updated_at: Any | None

    model_config = {"from_attributes": True}
