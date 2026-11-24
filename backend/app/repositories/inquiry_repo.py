import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_
from app.models.inquiry import Inquiry


def create_inquiry(db: Session, data: dict) -> Inquiry:
    inquiry = Inquiry(**data)
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


def get_inquiry_by_id(db: Session, inquiry_id: uuid.UUID) -> Inquiry | None:
    return db.get(Inquiry, inquiry_id)


def get_inquiry_by_idempotency_key(db: Session, key: str) -> Inquiry | None:
    return db.scalar(select(Inquiry).where(Inquiry.idempotency_key == key))


def list_inquiries(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    status: str | None = None,
    priority: str | None = None,
    search: str | None = None,
) -> list[Inquiry]:
    q = select(Inquiry).order_by(Inquiry.created_at.desc())
    if status:
        q = q.where(Inquiry.status == status)
    if priority:
        q = q.where(Inquiry.priority == priority)
    if search:
        term = f"%{search}%"
        q = q.where(
            or_(
                Inquiry.full_name.ilike(term),
                Inquiry.company_name.ilike(term),
                Inquiry.email.ilike(term),
            )
        )
    q = q.offset(skip).limit(limit)
    return list(db.scalars(q))


def update_inquiry_status(db: Session, inquiry: Inquiry, status: str) -> Inquiry:
    inquiry.status = status
    db.commit()
    db.refresh(inquiry)
    return inquiry


def get_analytics(db: Session) -> dict:
    total = db.scalar(select(func.count(Inquiry.id))) or 0
    new_count = db.scalar(select(func.count(Inquiry.id)).where(Inquiry.status == "new")) or 0
    high_prio = db.scalar(select(func.count(Inquiry.id)).where(Inquiry.priority == "high")) or 0
    converted = db.scalar(select(func.count(Inquiry.id)).where(Inquiry.status == "converted")) or 0

    # By priority
    by_priority = {}
    for p in ["high", "medium", "low"]:
        by_priority[p] = db.scalar(select(func.count(Inquiry.id)).where(Inquiry.priority == p)) or 0

    # By status
    by_status = {}
    for s in ["new", "contacted", "in_progress", "converted", "closed"]:
        by_status[s] = db.scalar(select(func.count(Inquiry.id)).where(Inquiry.status == s)) or 0

    # Recent 5
    recent_rows = list(
        db.scalars(select(Inquiry).order_by(Inquiry.created_at.desc()).limit(5))
    )

    # By service (approximate from JSONB)
    service_counts: dict[str, int] = {}
    all_inquiries = list(db.scalars(select(Inquiry)))
    for inq in all_inquiries:
        for svc in (inq.selected_services or []):
            service_counts[svc] = service_counts.get(svc, 0) + 1

    by_service = sorted(
        [{"service": k, "count": v} for k, v in service_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )

    return {
        "total": total,
        "new": new_count,
        "high_priority": high_prio,
        "converted": converted,
        "by_service": by_service,
        "by_priority": by_priority,
        "by_status": by_status,
        "recent": recent_rows,
    }
