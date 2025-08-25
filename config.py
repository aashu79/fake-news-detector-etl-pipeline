import os

DATA_DIR = os.getenv("DATA_DIR", "data")
FAKE_NEWS_DATASET = os.getenv("FAKE_NEWS_DATASET", "clmentbisaillon/fake-and-real-news-dataset")
FAKE_CSV = os.path.join(DATA_DIR, "Fake.csv")
TRUE_CSV = os.path.join(DATA_DIR, "True.csv")
TRAIN_CSV = os.path.join(DATA_DIR, "train.csv")
TEST_CSV = os.path.join(DATA_DIR, "test.csv")
MODEL_PATH = os.getenv("MODEL_PATH", "model/fake_news_detector.pkl")
POSTGRES_URL = os.getenv("POSTGRES_URL", "jdbc:postgresql://localhost:5432/fake_news_db")
POSTGRES_USER = os.getenv("POSTGRES_USER", "aashu")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "Password112")
VECTORIZER_PATH = "model/vectorizer.pkl"