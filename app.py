"""Flask source for Vikas Kumar's static portfolio."""

from flask import Flask, render_template

app = Flask(__name__)
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

DATA = {
    "name": "Vikas Kumar",
    "title": "Data Engineer · Applied AI",
    "email": "vikaskumar.ran@gmail.com",
    "linkedin": "https://www.linkedin.com/in/vikas-kumar-98bb52104/",
    "github": "https://github.com/itsvikas",
    "medium": "https://medium.com/@vikaskumar.ran",
    "medium_feed": "https://medium.com/feed/@vikaskumar.ran",
    "hero_summary": (
        "From Spark and streaming systems to prompt engineering and LoRA fine-tuning — "
        "I take data and AI ideas all the way to production."
    ),
    "exploring": ["embedding models", "LLM fine-tuning", "AI-driven data quality"],
    "phrases": ["data pipelines.", "LLM workflows.", "reliable platforms."],
    "stats": [
        {"value": 85, "suffix": "%", "label": "LLM classification accuracy"},
        {"value": 5, "suffix": "", "label": "Platforms delivered"},
        {"value": 4, "suffix": "", "label": "Articles published"},
    ],
    "skills_intro": "Data engineering foundations paired with hands-on applied AI and cloud delivery.",
    "skills": [
        {"id": "data", "label": "Data", "title": "Data engineering & programming", "items": ["Spark", "Python", "APIs", "SQL", "NoSQL"]},
        {"id": "platforms", "label": "Platforms", "title": "Data platforms", "items": ["ETL", "Data Lakes", "Data Warehousing", "Hive", "Hudi", "BigQuery", "Bigtable"]},
        {"id": "ai", "label": "AI / ML", "title": "AI & machine learning", "items": ["LLMs", "Prompt Engineering", "Model Fine-Tuning", "LoRA", "Vector Databases"]},
        {"id": "cloud", "label": "Cloud", "title": "Cloud & platform engineering", "items": ["Airflow", "Kafka", "Elasticsearch", "GCP", "Azure", "CI/CD", "DevOps"]},
    ],
    "projects_intro": "What I'm building now, and what I've shipped before.",
    "featured_project": {
        "title": "DCC · LLM-based classification",
        "summary": "An end-to-end classification initiative combining data curation, prompt engineering, model fine-tuning, and production deployment.",
        "meta": "Current project · Data engineering & applied AI",
        "accuracy": [
            {"label": "Baseline prompt", "value": 30},
            {"label": "Refined prompt", "value": 50},
            {"label": "LoRA fine-tuned", "value": 85},
        ],
        "highlights": [
            "Improved prompt-based classification accuracy from 30% to 50% through prompt refinement.",
            "Fine-tuned LLaMA and Gemma models with LoRA, increasing accuracy from 50% to 85%.",
            "Owned the workflow from manual and synthetic data curation through fine-tuning and deployment.",
        ],
        "tags": ["LLMs", "LoRA", "LLaMA", "Gemma", "Model Deployment"],
    },
    "previous_projects": [
        {
            "title": "DQ · Automated Rule Suggestions",
            "summary": "Improved LLM-generated data-quality rules and built an evaluation framework to measure their quality consistently.",
            "meta": "Prompt engineering · Evaluation framework",
            "highlights": [
                "Rebuilt the ARS system prompt with confidence tiers, dimension coverage, and rule-quality guidelines.",
                "Designed practical workarounds for LLM limitations and unreliable output patterns.",
                "Developed an evaluation framework that scores generated rules across multiple metrics.",
            ],
            "tags": ["LLMs", "Prompt Engineering", "Evaluation", "Data Quality"],
        },
        {
            "title": "IRR · Privacy Rights Platform",
            "summary": "Onboarded and supported privacy assets serving US DSAR, MHMD, and GEP regulations across opt-out, deletion, and data-correction rights.",
            "meta": "Technical delivery · Production support · Team leadership",
            "highlights": [
                "Established CI/CD pipelines, Airflow workflows, Kafka integrations, and other platform foundations.",
                "Designed reusable file, API-integration, and Kafka-based approaches for asset ticket processing.",
                "Supported production jobs within SLA while coordinating day-to-day team delivery and technical guidance.",
            ],
            "tags": ["Airflow", "Kafka", "CI/CD", "APIs", "Privacy Engineering"],
        },
        {
            "title": "Dedup · Data Processing Platform",
            "summary": "Built scalable data ingestion and processing workflows and prepared search indexes for downstream use.",
            "meta": "Data engineering · Platform enablement",
            "highlights": [
                "Developed Spark jobs for data ingestion and transformation.",
                "Created jobs to load Elasticsearch indexes and established the project's CI/CD pipelines.",
            ],
            "tags": ["Spark", "Elasticsearch", "Data Ingestion", "CI/CD"],
        },
        {
            "title": "BigID · Asset Onboarding & Automation",
            "summary": "Expanded platform coverage by onboarding new assets and exploring repeatable automation opportunities.",
            "meta": "Platform onboarding · Automation",
            "highlights": [
                "Onboarded new data assets to the BigID platform.",
                "Identified automation opportunities and built initial versions of selected automations.",
            ],
            "tags": ["BigID", "Automation", "Data Governance"],
        },
    ],
    "experience_intro": "8+ years in data engineering, building large-scale pipelines and, more recently, AI-driven data solutions.",
    "employers": [
        {
            "name": "Walmart Global Tech",
            "period": "Mar 2023 – Present",
            "current": True,
            "roles": [
                {"title": "Senior Software Engineer", "period": "Oct 2026 – Present", "current": True, "summary": "Leading LLM-based classification work: data curation, LoRA fine-tuning, and production deployment."},
                {"title": "Software Engineer III", "period": "Mar 2023 – Sep 2026", "current": False, "summary": "Built privacy, data-quality, and data-processing platforms with Spark, Airflow, Kafka, and GCP."},
            ],
        },
        {
            "name": "Fractal",
            "period": "Aug 2021 – Mar 2023",
            "current": False,
            "roles": [
                {"title": "Data Engineer", "period": "Aug 2021 – Mar 2023", "location": "Bengaluru, Karnataka, India", "current": False, "summary": "Worked on data engineering with Python and SQL, building and supporting data workflows.", "skills": ["Python", "SQL", "ETL", "Data Engineering"]},
            ],
        },
        {
            "name": "Cognizant",
            "period": "Feb 2021 – Aug 2021",
            "current": False,
            "roles": [
                {"title": "Senior Associate", "period": "Feb 2021 – Aug 2021", "location": "Pune Division, Maharashtra, India", "current": False, "summary": "Contributed to SQL and ETL development for enterprise data workflows.", "skills": ["SQL", "ETL"]},
            ],
        },
        {
            "name": "Infosys",
            "period": "Oct 2017 – Jan 2021",
            "current": False,
            "roles": [
                {"title": "Senior System Engineer", "period": "Oct 2019 – Jan 2021", "location": "Greater Hyderabad Area", "current": False, "summary": "Developed data integration and engineering solutions using Informatica and Python.", "skills": ["Informatica", "Python", "SQL"]},
                {"title": "Systems Engineer", "period": "Apr 2018 – Oct 2019", "location": "Greater Hyderabad Area", "current": False, "summary": "Built and maintained data integration workflows using Informatica and SQL.", "skills": ["Informatica", "SQL"]},
                {"title": "Systems Engineer Trainee", "period": "Oct 2017 – Mar 2018", "location": "India", "current": False, "summary": "Completed systems engineering training with a focus on SQL.", "skills": ["SQL"]},
            ],
        },
    ],
    "education": {
        "degree": "Bachelor's degree, Computer Science",
        "school": "C.V. Raman College of Engineering · 2013 – 2017",
    },
    "certifications": [
        {"name": "Microsoft Certified: Azure Data Engineer Associate", "issuer": "Microsoft", "date": "Oct 2022", "id": ""},
        {"name": "Microsoft Certified: Azure Fundamentals", "issuer": "Microsoft", "date": "Oct 2021", "id": "H998-1557"},
        {"name": "Microsoft Certified: Azure Data Fundamentals", "issuer": "Microsoft", "date": "Sep 2021", "id": "H977-6286"},
        {"name": "SQL (Intermediate)", "issuer": "HackerRank", "date": "Jul 2021", "id": "B558A691B81E"},
        {"name": "Apache Spark Programming with Databricks", "issuer": "Databricks", "date": "Jun 2021", "id": ""},
    ],
    "articles_intro": "Practical notes on LLM fine-tuning, data engineering, SQL, and modern data platforms.",
    "articles": [
        {"title": "How to Fine-Tune an LLM", "summary": "A practical introduction to adapting large language models for task-specific needs.", "url": "https://medium.com/@vikaskumar.ran/how-to-fine-tune-an-llm-cf251ca41ad2"},
        {"title": "Start Your Data Engineering Hands-On Experience with These Free Resources", "summary": "A curated path for building practical data engineering skills with accessible resources.", "url": "https://medium.com/@vikaskumar.ran/start-your-data-engineering-hands-on-experience-with-these-free-resources-which-are-more-than-4f743e611b6f"},
        {"title": "SQL Window Functions", "summary": "A clear guide to using window functions for expressive analytical SQL.", "url": "https://medium.com/@vikaskumar.ran/sql-window-functions-dc30c8c23480"},
        {"title": "Delta Lake & Delta Tables: All You Need to Know", "summary": "An overview of Delta Lake concepts and the capabilities of Delta tables.", "url": "https://medium.com/@vikaskumar.ran/delta-lake-delta-table-all-you-need-to-know-2779c2969366"},
    ],
}


@app.route("/")
def index():
    return render_template("index.html", **DATA)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
