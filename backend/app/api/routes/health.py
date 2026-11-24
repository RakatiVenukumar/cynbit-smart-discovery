from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "environment": settings.environment,
        "service": "Cynbit Smart Discovery API",
    }
