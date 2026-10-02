"""
Portfolio Website — Flask Application
Edit the DATA dict below to update your portfolio content.
"""

from flask import Flask, render_template

app = Flask(__name__)

# ──────────────────────────────────────────────
# EDIT YOUR PORTFOLIO DATA HERE
# ──────────────────────────────────────────────
DATA = {
    "name": "Vikas Kumar",
    "title": "Senior Data Engineer",
    "tagline": "Building scalable data pipelines & AI-driven solutions",
    "bio": (
        "Experienced Data Engineer with 8+ years specializing in large-scale data pipelines "
        "and distributed processing. I architect end-to-end data solutions using Spark, SQL, "
        "Python, and cloud platforms like GCP and Azure. Currently exploring AI-driven data "
        "solutions — from fine-tuning LLMs and embedding models to deploying intelligent "
        "classification systems."
    ),
    "experience_years": 8,
    "email": "vikaskumar.ran@gmail.com",
    "linkedin": "https://www.linkedin.com/in/vikas-kumar-98bb52104/",
    "github": "https://github.com/itsvikas",
    "medium": "https://medium.com/@vikaskumar.ran",
    "medium_feed": "https://medium.com/feed/@vikaskumar.ran",
    "resume_url": "#",

    "skills": {
        "Data Engineering": [
            "Apache Spark", "Apache Kafka", "Apache Airflow",
            "ETL / ELT Pipelines", "Data Warehousing", "Data Modeling",
            "dbt", "Delta Lake",
        ],
        "Cloud & Infrastructure": [
            "Google Cloud Platform", "Microsoft Azure",
            "BigQuery", "Dataflow", "Azure Data Factory",
            "Terraform", "Docker", "Kubernetes",
        ],
        "Programming & Databases": [
            "Python", "SQL", "PySpark",
            "PostgreSQL", "MongoDB", "Redis",
            "Scala", "Bash",
        ],
        "AI / ML": [
            "LLM Fine-tuning", "Embedding Models",
            "RAG Systems", "Text Classification",
            "scikit-learn", "Hugging Face", "LangChain",
        ],
    },

    "projects": [
        {
            "title": "Real-Time Streaming Pipeline",
            "description": (
                "Designed and deployed a real-time data pipeline processing 500K+ events/sec "
                "using Kafka, Spark Structured Streaming, and Delta Lake on GCP."
            ),
            "tags": ["Spark", "Kafka", "GCP", "Delta Lake"],
            "link": "#",
        },
        {
            "title": "Cloud Data Warehouse Migration",
            "description": (
                "Led migration of legacy on-prem data warehouse to BigQuery, reducing query "
                "latency by 70% and cutting infrastructure costs by 40%."
            ),
            "tags": ["BigQuery", "dbt", "Airflow", "Terraform"],
            "link": "#",
        },
        {
            "title": "Intelligent Document Classifier",
            "description": (
                "Built an AI-powered document classification system using fine-tuned "
                "embedding models and RAG, achieving 95%+ accuracy on enterprise data."
            ),
            "tags": ["LLM", "RAG", "Python", "Hugging Face"],
            "link": "#",
        },
        {
            "title": "ETL Orchestration Platform",
            "description": (
                "Architected an internal ETL orchestration platform with Airflow and "
                "Azure Data Factory, processing 10TB+ daily across 200+ pipelines."
            ),
            "tags": ["Airflow", "Azure", "Python", "Docker"],
            "link": "#",
        },
        {
            "title": "Data Quality Framework",
            "description": (
                "Developed a reusable data quality framework with automated anomaly "
                "detection, schema validation, and Slack alerting for data pipelines."
            ),
            "tags": ["Python", "Great Expectations", "SQL", "dbt"],
            "link": "#",
        },
        {
            "title": "ML Feature Store",
            "description": (
                "Designed and implemented a centralized feature store serving real-time "
                "and batch features to ML models across multiple teams."
            ),
            "tags": ["Feast", "Redis", "Spark", "Kubernetes"],
            "link": "#",
        },
    ],
}


@app.route("/")
def index():
    return render_template("index.html", **DATA)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
