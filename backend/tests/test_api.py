import sys
import os
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app
from app.db.session import SessionLocal
from app.models.inquiry import Inquiry
from app.models.admin import Administrator
from app.core.security import hash_password

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "version" in data


def test_recommend_endpoint():
    payload = {
        "selected_services": ["ai_automation"],
        "industry": "Technology",
        "business_size": "Medium (11-50)",
        "digital_presence": "Website + social media",
        "business_stage": "Growth stage (1-3 years)",
        "business_goals": ["Automate Manual Processes"],
        "challenges": ["Manual & repetitive processes"],
        "project_requirements": {"project_description": "Automate invoice workflows"},
        "budget_range": "₹25-75 Lakhs ($30K-$90K)",
        "timeline": "3-6 months",
        "urgency": "High — significant impact",
        "project_readiness": "Ready to start immediately",
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1
    assert len(data["recommendations"]) >= 1


def test_recommend_validation_error():
    res = client.post("/api/recommend", json={"selected_services": []})
    assert res.status_code == 422


def test_inquiry_consent_required():
    payload = {
        "selected_services": ["website_development"],
        "industry": "Retail & E-Commerce",
        "business_size": "Small (2-10)",
        "digital_presence": "No digital presence yet",
        "business_stage": "Early stage (< 1 year)",
        "business_goals": ["Build Brand Awareness"],
        "challenges": ["Poor online presence"],
        "project_requirements": {},
        "budget_range": "₹5-25 Lakhs ($6K-$30K)",
        "timeline": "1-3 months",
        "urgency": "Medium — planned initiative",
        "project_readiness": "Ready to start immediately",
        "full_name": "Test Evaluator",
        "email": "test@example.com",
        "company_name": "Test Co",
        "consent": False,
        "idempotency_key": str(uuid.uuid4()),
    }
    res = client.post("/api/inquiries", json=payload)
    assert res.status_code == 422


def test_inquiry_persistence_and_idempotency():
    idem_key = f"test-idem-{uuid.uuid4()}"
    payload = {
        "selected_services": ["ai_automation", "custom_software"],
        "industry": "Technology",
        "business_size": "Medium (11-50)",
        "digital_presence": "Website + social media",
        "business_stage": "Established (3-10 years)",
        "business_goals": ["Automate Manual Processes", "Improve Data & Analytics"],
        "challenges": ["Manual & repetitive processes"],
        "project_requirements": {
            "project_description": "We want to automate internal reporting and customer onboarding across departments."
        },
        "budget_range": "₹25-75 Lakhs ($30K-$90K)",
        "timeline": "3-6 months",
        "urgency": "High — significant impact",
        "project_readiness": "Ready to start immediately",
        "full_name": "Pytest Evaluator",
        "email": "pytest@example.com",
        "phone": "+91 98765 00000",
        "company_name": "Pytest Corp",
        "consent": True,
        "idempotency_key": idem_key,
    }

    res1 = client.post("/api/inquiries", json=payload)
    assert res1.status_code == 201
    data1 = res1.json()
    assert data1["reference_id"].startswith("CSD-")
    assert data1["qualification_score"] >= 75
    assert data1["priority"] == "high"

    # Duplicate submission with same idempotency key should return existing record without creating a duplicate
    res2 = client.post("/api/inquiries", json=payload)
    assert res2.status_code == 201
    data2 = res2.json()
    assert data2["id"] == data1["id"]
    assert data2["reference_id"] == data1["reference_id"]

    # Clean up test inquiry
    db = SessionLocal()
    try:
        row = db.get(Inquiry, uuid.UUID(data1["id"]))
        if row:
            db.delete(row)
            db.commit()
    finally:
        db.close()


def test_unauthorized_admin_routes():
    assert client.get("/api/inquiries").status_code == 401
    assert client.get("/api/analytics").status_code == 401
    assert client.get(f"/api/inquiries/{uuid.uuid4()}").status_code == 401
    assert client.patch(f"/api/inquiries/{uuid.uuid4()}", json={"status": "contacted"}).status_code == 401


def test_invalid_admin_login():
    res = client.post("/api/auth/login", json={"email": "nonexistent@example.com", "password": "wrongpassword"})
    assert res.status_code == 401


def test_admin_auth_and_status_update():
    test_email = f"testadmin-{uuid.uuid4().hex[:8]}@example.com"
    test_password = "TestPassword123!"
    idem_key = f"test-admin-inq-{uuid.uuid4()}"

    db = SessionLocal()
    admin = Administrator(email=test_email, password_hash=hash_password(test_password))
    db.add(admin)
    db.commit()
    db.refresh(admin)
    admin_id = admin.id
    db.close()

    inquiry_id = None
    try:
        # Login
        login_res = client.post("/api/auth/login", json={"email": test_email, "password": test_password})
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # /auth/me
        me_res = client.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200
        assert me_res.json()["email"] == test_email

        # Create inquiry
        inq_res = client.post(
            "/api/inquiries",
            json={
                "selected_services": ["website_development"],
                "industry": "Education",
                "business_size": "Small (2-10)",
                "digital_presence": "Basic website only",
                "business_stage": "Growth stage (1-3 years)",
                "business_goals": ["Generate More Leads"],
                "challenges": ["Poor online presence"],
                "project_requirements": {},
                "budget_range": "₹5-25 Lakhs ($6K-$30K)",
                "timeline": "1-3 months",
                "urgency": "Medium — planned initiative",
                "project_readiness": "Ready to start immediately",
                "full_name": "Admin Flow Test",
                "email": "flow@example.com",
                "company_name": "Flow Edu",
                "consent": True,
                "idempotency_key": idem_key,
            },
        )
        assert inq_res.status_code == 201
        inquiry_id = inq_res.json()["id"]

        # List inquiries
        list_res = client.get("/api/inquiries", headers=headers)
        assert list_res.status_code == 200
        assert any(i["id"] == inquiry_id for i in list_res.json())

        # Get inquiry detail
        detail_res = client.get(f"/api/inquiries/{inquiry_id}", headers=headers)
        assert detail_res.status_code == 200
        assert detail_res.json()["company_name"] == "Flow Edu"

        # Update status
        patch_res = client.patch(
            f"/api/inquiries/{inquiry_id}",
            json={"status": "contacted"},
            headers=headers,
        )
        assert patch_res.status_code == 200
        assert patch_res.json()["status"] == "contacted"

        # Analytics
        an_res = client.get("/api/analytics", headers=headers)
        assert an_res.status_code == 200
        assert an_res.json()["total"] >= 1
    finally:
        db = SessionLocal()
        try:
            if inquiry_id:
                inq = db.get(Inquiry, uuid.UUID(inquiry_id))
                if inq:
                    db.delete(inq)
            adm = db.get(Administrator, admin_id)
            if adm:
                db.delete(adm)
            db.commit()
        finally:
            db.close()
