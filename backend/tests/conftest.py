import pytest
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


@pytest.fixture
def ai_discovery_input():
    return dict(
        selected_services=["ai_automation"],
        industry="Technology",
        business_goals=["Automate Manual Processes", "Reduce Operational Costs"],
        digital_presence="Website + social media",
        challenges=["Manual & repetitive processes", "Inefficient workflows"],
        project_requirements={"project_description": "We need to automate our invoice processing and data entry workflows."},
        budget_range="₹25-75 Lakhs ($30K-$90K)",
        timeline="3-6 months",
    )


@pytest.fixture
def website_discovery_input():
    return dict(
        selected_services=["website_development"],
        industry="Retail & E-Commerce",
        business_goals=["Build Brand Awareness", "Generate More Leads"],
        digital_presence="No digital presence yet",
        challenges=["Poor online presence"],
        project_requirements={"project_description": "Need a new professional website for our retail business."},
        budget_range="₹5-25 Lakhs ($6K-$30K)",
        timeline="1-3 months",
    )


@pytest.fixture
def multi_service_input():
    return dict(
        selected_services=["ecommerce_development", "digital_marketing", "mobile_development"],
        industry="Retail & E-Commerce",
        business_goals=["Increase Revenue", "Generate More Leads"],
        digital_presence="Basic website only",
        challenges=["Poor customer engagement", "Poor online presence"],
        project_requirements={"project_description": "Full digital presence including online store and marketing."},
        budget_range="₹75L-2Cr ($90K-$240K)",
        timeline="6-12 months",
    )


@pytest.fixture
def not_sure_input():
    return dict(
        selected_services=["not_sure"],
        industry="Healthcare",
        business_goals=[],
        digital_presence="Basic website only",
        challenges=[],
        project_requirements={},
        budget_range="Unsure / To be discussed",
        timeline="Flexible",
    )
