from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, recommend, inquiries, auth, analytics

app = FastAPI(
    title="Cynbit Smart Discovery API",
    version="1.0.0",
    description=(
        "Intelligent Project Discovery & Lead Qualification System. "
        "Independent assessment prototype for Cynbit Technologies."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(recommend.router, prefix="/api")
app.include_router(inquiries.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Cynbit Smart Discovery API", "docs": "/docs", "health": "/api/health"}
