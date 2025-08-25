# Fake News Detector ETL Pipeline – Manual

## Project Overview

This project is a full-stack pipeline for detecting fake news. It combines Python and JavaScript technologies to create an end-to-end solution that can automatically process, analyze, and classify news articles as fake or real. The pipeline is designed to be modular and scalable, so you can easily extend it or use it as a reference for similar data processing and ML tasks.

**Key technologies:**
- **PySpark:** For distributed, scalable data processing (extract, clean, transform).
- **PostgreSQL:** Stores processed and labeled news data for modeling or further analysis.
- **Scikit-learn & SetFit:** Used to train a machine learning model for text classification.
- **FastAPI:** Provides a REST API for model inference and health checks.
- **Poetry:** Handles Python dependency management and scripts.
- **Next.js:** Interactive frontend for users to test news authenticity.

### Typical Workflow

1. **Extract:** Download and unzip Kaggle datasets (fake and real news).
2. **Transform:** Clean text, preprocess, label, and split data for training/testing.
3. **Load:** Write processed datasets to a PostgreSQL table for easy access.
4. **Train:** Build and evaluate a machine learning model to distinguish fake vs. real news.
5. **Serve:** Launch an API server to expose the prediction model.
6. **Frontend:** User-facing web app lets anyone paste news text and get predictions.

---

## Step-by-Step Guide

### Prerequisites

- Python 3.8+
- Poetry (dependency manager)
- PostgreSQL running locally (update credentials in `config.py` if needed)
- Kaggle API key (for data download)

---

### 1. Install Poetry (if not installed yet)
```sh
curl -sSL https://install.python-poetry.org | python3 -
```

### 2. Install Python Dependencies
```sh
poetry install
```

### 3. Activate Poetry Shell
```sh
poetry shell
```

### 4. Download NLTK Data (one-time)
Start a Python shell and run:
```python
import nltk
nltk.download('stopwords')
```

### 5. Kaggle API Credentials
Put your Kaggle API key in `~/.kaggle/kaggle.json`.

### 6. PostgreSQL Setup
Make sure PostgreSQL is running. Update connection info in `config.py` or as environment variables.

---

## Run the ETL Pipeline and Train Model

All commands below should be run inside the Poetry shell:

1. **Extract Data from Kaggle**
    ```sh
    poetry run fakenews-extract
    ```

2. **Transform Data (clean, label, split)**
    ```sh
    poetry run fakenews-transform
    ```

3. **Load Data to PostgreSQL**
    ```sh
    poetry run fakenews-load
    ```

4. **Train the ML Model**
    ```sh
    poetry run fakenews-train
    ```

---

## Run the API Server

> **Recommended:** Use the script command already defined in your `pyproject.toml` file (do not run uvicorn manually).

```sh
poetry run fakenews-api
```
- The API will be available at: `http://localhost:8000`
- Main endpoint: `POST /predict` with payload like `{ "text": "some news article" }`
- Returns: `{ "prediction": "Fake" | "Real", "probability": 0.95, ... }`

---

## Start the Frontend (Next.js Web App)

Change into the frontend directory:
```sh
cd fake-news-web
```

Install all required Node.js dependencies:
```sh
npm install
```

Run the development server:
```sh
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Enter news text and get instant AI-based analysis. The web app talks to the API above.

---

## How It Works

- **ETL Pipeline:** Downloads a public fake news dataset, cleans and labels every article, and loads it into a local database so the model can learn.
- **Model Training:** Uses transformer-based ML models to learn patterns in fake vs. real news.
- **API:** A web endpoint where you send text and get a prediction ("Fake" or "Real") with a confidence score.
- **Frontend:** A web page to interact with the API—just paste your news and get results.

### Notes
- All Python dependencies and scripts are managed by Poetry.
- You need Kaggle API access for the dataset.
- The frontend uses Next.js for a fast and modern UI.
- The model is a helpful tool, but always cross-check news with multiple sources.

---