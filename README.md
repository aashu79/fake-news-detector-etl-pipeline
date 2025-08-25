# Fake News Detector ETL Pipeline (Poetry Managed)

## Overview

A modular ETL pipeline using PySpark and PostgreSQL for Fake News Detection, followed by model training and FastAPI serving. **Poetry** manages all dependencies and environments.

## Features

-   **Extract**: Download and extract datasets from Kaggle.
-   **Transform**: Clean, preprocess, label, and split using PySpark.
-   **Load**: Write processed data to PostgreSQL via Spark JDBC.
-   **Train**: Train ML model with scikit-learn.
-   **Serve**: FastAPI for model inference.

## Setup

### 1. Install Poetry

```sh
curl -sSL https://install.python-poetry.org | python3 -
```

### 2. Install Project Dependencies

```sh
poetry install
```

### 3. Activate Poetry Shell

```sh
poetry shell
```

### 4. Download NLTK Data (once)

```python
import nltk
nltk.download('stopwords')
```

### 5. Kaggle API Credentials

Place your Kaggle API key in `~/.kaggle/kaggle.json`.

### 6. PostgreSQL

Set up your PostgreSQL instance. Update credentials in `config.py` or via environment variables.

## Usage

All scripts can be run inside the Poetry environment:

```sh
poetry run fakenews-extract
poetry run fakenews-transform
poetry run fakenews-load
poetry run fakenews-train
poetry run uvicorn api.main:app --reload
```

## API

-   **POST /predict**
    -   Request: `{ "text": "news article text" }`
    -   Response: `{ "prediction": "Fake", "probability": 0.95 }`

## Notes

-   All dependencies/environments managed by Poetry.
-   PySpark for scalable ETL.
-   Clean code, modular structure, ready for extension.
