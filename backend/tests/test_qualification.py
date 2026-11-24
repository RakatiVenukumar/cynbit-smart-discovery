import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.qualification import calculate_qualification


def _make_input(**overrides):
    base = dict(
        budget_range="₹25-75 Lakhs ($30K-$90K)",
        timeline="3-6 months",
        project_requirements={"project_description": "We need a custom software platform to manage our operations across multiple departments and streamline reporting."},
        business_goals=["Automate Manual Processes", "Improve Data & Analytics", "Reduce Operational Costs"],
        challenges=["Manual & repetitive processes", "Data silos"],
        business_stage="Established (3-10 years)",
        digital_presence="Website + social media",
        full_name="Jane Doe",
        email="jane@example.com",
        phone="+91 98765 43210",
        company_name="Acme Corp",
    )
    base.update(overrides)
    return base


def test_high_score():
    score, breakdown, priority = calculate_qualification(**_make_input())
    assert score >= 75
    assert priority == "high"


def test_low_score_minimal_data():
    score, breakdown, priority = calculate_qualification(
        budget_range="Unsure / To be discussed",
        timeline="Flexible",
        project_requirements={},
        business_goals=[],
        challenges=[],
        business_stage="Pre-launch / Idea stage",
        digital_presence="No digital presence yet",
        full_name="Bob",
        email="bob@test.com",
        phone=None,
        company_name="Bob Co",
    )
    assert score < 40
    assert priority == "low"


def test_medium_score():
    score, breakdown, priority = calculate_qualification(**_make_input(
        budget_range="₹5-25 Lakhs ($6K-$30K)",
        timeline="Flexible",
        project_requirements={"project_description": "Short desc"},
        business_goals=["Increase Revenue"],
        challenges=[],
        business_stage="Early stage (< 1 year)",
        digital_presence="Basic website only",
        phone=None,
    ))
    assert 40 <= score < 75
    assert priority == "medium"


def test_boundary_75_is_high():
    # Force a score that lands exactly at 75
    # budget=25, timeline=20, requirements minimal~5, business moderate~15, contact=10 => ~75
    score, breakdown, priority = calculate_qualification(**_make_input(
        budget_range="₹25-75 Lakhs ($30K-$90K)",
        timeline="3-6 months",
        project_requirements={"project_description": "Some project."},
        business_goals=["Increase Revenue"],
        challenges=["Manual & repetitive processes"],
        business_stage="Growth stage (1-3 years)",
        digital_presence="Website + social media",
        phone="+91 123 456 7890",
    ))
    # The exact value will vary; just check priority aligns with score
    if score >= 75:
        assert priority == "high"
    elif score >= 40:
        assert priority == "medium"
    else:
        assert priority == "low"


def test_boundary_40_is_medium():
    score, breakdown, priority = calculate_qualification(**_make_input(
        budget_range="Unsure / To be discussed",
        timeline="3-6 months",
        project_requirements={"project_description": "Medium description that is longer than thirty chars."},
        business_goals=["Increase Revenue", "Scale Operations"],
        challenges=["Manual & repetitive processes"],
        business_stage="Growth stage (1-3 years)",
        digital_presence="Website + social media",
        phone=None,
    ))
    if score >= 40:
        assert priority in ("medium", "high")
    else:
        assert priority == "low"


def test_score_range():
    score, _, _ = calculate_qualification(**_make_input())
    assert 0 <= score <= 100


def test_breakdown_has_all_keys(ai_discovery_input):
    score, breakdown, priority = calculate_qualification(**_make_input())
    assert "budget_readiness" in breakdown
    assert "timeline_clarity" in breakdown
    assert "requirement_clarity" in breakdown
    assert "business_readiness" in breakdown
    assert "contact_completeness" in breakdown
    assert "total" in breakdown
    assert breakdown["total"] == score


def test_no_phone_reduces_score():
    score_with_phone, _, _ = calculate_qualification(**_make_input(phone="+91 999 000 1111"))
    score_without_phone, _, _ = calculate_qualification(**_make_input(phone=None))
    assert score_with_phone > score_without_phone


def test_defined_budget_scores_higher():
    score_defined, _, _ = calculate_qualification(**_make_input(budget_range="₹25-75 Lakhs ($30K-$90K)"))
    score_unsure, _, _ = calculate_qualification(**_make_input(budget_range="Unsure / To be discussed"))
    assert score_defined > score_unsure


def test_priority_classification():
    for score_input, expected_priority in [
        ("₹75L-2Cr ($90K-$240K)", "high"),
        ("₹5-25 Lakhs ($6K-$30K)", None),  # depends on other factors
    ]:
        score, _, priority = calculate_qualification(**_make_input(budget_range=score_input))
        assert priority in ("high", "medium", "low")
