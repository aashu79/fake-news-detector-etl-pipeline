# fakenews_etl/cli.py
from etl.extract import extract_data

def main():
    print("Starting fake news extraction...")
    extract_data()

if __name__ == "__main__":
    main()