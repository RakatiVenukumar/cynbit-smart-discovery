from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.inquiry_repo import get_analytics
from app.api.deps import get_current_admin
from app.schemas.inquiry import InquiryResponse

router = APIRouter(tags=["Analytics"])


@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    data = get_analytics(db)
    # Serialize recent inquiries
    recent_serialized = []
    for inq in data["recent"]:
        recent_serialized.append(
            {
                "id": str(inq.id),
                "reference_id": inq.reference_id,
                "full_name": inq.full_name,
                "company_name": inq.company_name,
                "industry": inq.industry,
                "selected_services": inq.selected_services,
                "qualification_score": inq.qualification_score,
                "priority": inq.priority,
                "status": inq.status,
                "created_at": inq.created_at.isoformat() if inq.created_at else None,
                "email": inq.email,
            }
        )
    return {
        "total": data["total"],
        "new": data["new"],
        "high_priority": data["high_priority"],
        "converted": data["converted"],
        "by_service": data["by_service"],
        "by_priority": data["by_priority"],
        "by_status": data["by_status"],
        "recent": recent_serialized,
    }
