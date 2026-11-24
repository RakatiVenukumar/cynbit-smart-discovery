from fastapi import APIRouter
from app.schemas.inquiry import DiscoveryInput
from app.services.recommendation import generate_recommendations

router = APIRouter(tags=["Recommendations"])


@router.post("/recommend")
def recommend(payload: DiscoveryInput):
    recs = generate_recommendations(
        selected_services=payload.selected_services,
        industry=payload.industry,
        business_goals=payload.business_goals,
        digital_presence=payload.digital_presence,
        challenges=payload.challenges,
        project_requirements=payload.project_requirements,
        budget_range=payload.budget_range,
        timeline=payload.timeline,
    )
    return {"recommendations": recs, "count": len(recs)}
