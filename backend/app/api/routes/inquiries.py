import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.inquiry import InquiryCreate, InquiryResponse, InquiryDetail, InquiryStatusUpdate
from app.services.recommendation import generate_recommendations
from app.services.qualification import calculate_qualification
from app.repositories.inquiry_repo import (
    create_inquiry,
    get_inquiry_by_id,
    get_inquiry_by_idempotency_key,
    list_inquiries,
    update_inquiry_status,
)
from app.utils.id_gen import generate_reference_id
from app.api.deps import get_current_admin

router = APIRouter(tags=["Inquiries"])


@router.post("/inquiries", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)):
    # Idempotency check
    existing = get_inquiry_by_idempotency_key(db, payload.idempotency_key)
    if existing:
        return existing

    # Recompute recommendation server-side
    recommendations = generate_recommendations(
        selected_services=payload.selected_services,
        industry=payload.industry,
        business_goals=payload.business_goals,
        digital_presence=payload.digital_presence,
        challenges=payload.challenges,
        project_requirements=payload.project_requirements,
        budget_range=payload.budget_range,
        timeline=payload.timeline,
    )

    # Compute qualification score
    score, breakdown, priority = calculate_qualification(
        budget_range=payload.budget_range,
        timeline=payload.timeline,
        project_requirements=payload.project_requirements,
        business_goals=payload.business_goals,
        challenges=payload.challenges,
        business_stage=payload.business_stage,
        digital_presence=payload.digital_presence,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        company_name=payload.company_name,
    )

    inquiry = create_inquiry(
        db,
        {
            "reference_id": generate_reference_id(),
            "idempotency_key": payload.idempotency_key,
            "full_name": payload.full_name,
            "email": str(payload.email),
            "phone": payload.phone,
            "company_name": payload.company_name,
            "industry": payload.industry,
            "business_size": payload.business_size,
            "digital_presence": payload.digital_presence,
            "business_stage": payload.business_stage,
            "selected_services": payload.selected_services,
            "business_goals": payload.business_goals,
            "project_requirements": payload.project_requirements,
            "budget_range": payload.budget_range,
            "timeline": payload.timeline,
            "urgency": payload.urgency,
            "project_readiness": payload.project_readiness,
            "recommendation": recommendations,
            "qualification_score": score,
            "qualification_breakdown": breakdown,
            "priority": priority,
            "status": "new",
            "consent": payload.consent,
        },
    )
    return inquiry


@router.get("/inquiries", response_model=list[InquiryResponse])
def list_inquiries_route(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: str | None = Query(None),
    priority: str | None = Query(None),
    search: str | None = Query(None, max_length=100),
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return list_inquiries(db, skip=skip, limit=limit, status=status, priority=priority, search=search)


@router.get("/inquiries/{inquiry_id}", response_model=InquiryDetail)
def get_inquiry_route(
    inquiry_id: uuid.UUID,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    inquiry = get_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.patch("/inquiries/{inquiry_id}", response_model=InquiryResponse)
def update_inquiry_status_route(
    inquiry_id: uuid.UUID,
    payload: InquiryStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    inquiry = get_inquiry_by_id(db, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return update_inquiry_status(db, inquiry, payload.status)
