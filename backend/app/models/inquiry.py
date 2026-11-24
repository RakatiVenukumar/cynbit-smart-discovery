import uuid
from sqlalchemy import String, Boolean, DateTime, Integer, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.db.base import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    reference_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    idempotency_key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    # Contact
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)

    # Business Profile
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    business_size: Mapped[str] = mapped_column(String(100), nullable=False)
    digital_presence: Mapped[str] = mapped_column(String(100), nullable=False)
    business_stage: Mapped[str] = mapped_column(String(100), nullable=False)

    # Discovery Data (JSONB)
    selected_services: Mapped[dict] = mapped_column(JSONB, nullable=False)
    business_goals: Mapped[dict] = mapped_column(JSONB, nullable=False)
    project_requirements: Mapped[dict] = mapped_column(JSONB, nullable=False)

    # Constraints
    budget_range: Mapped[str] = mapped_column(String(100), nullable=False)
    timeline: Mapped[str] = mapped_column(String(100), nullable=False)
    urgency: Mapped[str] = mapped_column(String(100), nullable=False)
    project_readiness: Mapped[str] = mapped_column(String(100), nullable=False)

    # Results
    recommendation: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    qualification_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    qualification_breakdown: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="low", index=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="new", index=True)

    # Meta
    consent: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )
