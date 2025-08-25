import os
import logging
from kaggle.api.kaggle_api_extended import KaggleApi
from config import DATA_DIR, FAKE_NEWS_DATASET

logging.basicConfig(level=logging.INFO)

def download_and_extract_kaggle_dataset(dataset, dest_dir):
    api = KaggleApi()
    api.authenticate()
    logging.info(f"Downloading {dataset} to {dest_dir}")
    api.dataset_download_files(dataset, path=dest_dir, unzip=True)
    logging.info("Extraction complete.")

def verify_files_exist(dest_dir):
    expected_files = ["Fake.csv", "True.csv"]
    for f in expected_files:
        if not os.path.exists(os.path.join(dest_dir, f)):
            raise FileNotFoundError(f"{f} not found in {dest_dir}")

def main():
    os.makedirs(DATA_DIR, exist_ok=True)
    download_and_extract_kaggle_dataset(FAKE_NEWS_DATASET, DATA_DIR)
    verify_files_exist(DATA_DIR)
    logging.info("Extraction step completed successfully.")

if __name__ == "__main__":
    main()