import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.recommendation import generate_recommendations


def test_ai_automation_recommendation(ai_discovery_input):
    recs = generate_recommendations(**ai_discovery_input)
    assert len(recs) >= 1
    services = [r["recommended_service"] for r in recs]
    assert "AI & Automation" in services


def test_website_development_recommendation(website_discovery_input):
    recs = generate_recommendations(**website_discovery_input)
    assert len(recs) >= 1
    services = [r["recommended_service"] for r in recs]
    assert "Website Development" in services


def test_multi_service_produces_multiple_recommendations(multi_service_input):
    recs = generate_recommendations(**multi_service_input)
    assert len(recs) >= 3


def test_not_sure_produces_general_recommendation(not_sure_input):
    recs = generate_recommendations(**not_sure_input)
    assert len(recs) >= 1
    services = [r["recommended_service"] for r in recs]
    assert "Consultation & Discovery" in services


def test_different_inputs_produce_different_recommendations(ai_discovery_input, website_discovery_input):
    recs_ai = generate_recommendations(**ai_discovery_input)
    recs_web = generate_recommendations(**website_discovery_input)
    names_ai = {r["solution_name"] for r in recs_ai}
    names_web = {r["solution_name"] for r in recs_web}
    # They should not be identical sets
    assert names_ai != names_web


def test_recommendation_has_required_fields(ai_discovery_input):
    recs = generate_recommendations(**ai_discovery_input)
    for rec in recs:
        assert "solution_name" in rec
        assert "recommended_service" in rec
        assert "reasoning" in rec
        assert "suggested_features" in rec
        assert "suggested_tech_stack" in rec
        assert "indicative_timeline" in rec
        assert "complexity_level" in rec
        assert "implementation_roadmap" in rec


def test_complexity_level_matches_budget(ai_discovery_input):
    ai_discovery_input["budget_range"] = "Above ₹2 Crore ($240K+)"
    recs = generate_recommendations(**ai_discovery_input)
    complexities = [r["complexity_level"] for r in recs]
    assert "high" in complexities


def test_ecommerce_recommendation():
    recs = generate_recommendations(
        selected_services=["ecommerce_development"],
        industry="Retail & E-Commerce",
        business_goals=["Increase Revenue"],
        digital_presence="Basic website only",
        challenges=[],
        project_requirements={},
        budget_range="₹25-75 Lakhs ($30K-$90K)",
        timeline="3-6 months",
    )
    services = [r["recommended_service"] for r in recs]
    assert "E-Commerce Development" in services


def test_no_selected_services_returns_general():
    recs = generate_recommendations(
        selected_services=[],
        industry="Technology",
        business_goals=[],
        digital_presence="No digital presence yet",
        challenges=[],
        project_requirements={},
        budget_range="Unsure / To be discussed",
        timeline="Flexible",
    )
    # Should return website rec (no digital presence) or general
    assert len(recs) >= 1
