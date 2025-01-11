import requests
import logging
from pymongo import MongoClient
from datetime import datetime
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("etl_pipeline.log"),
        logging.StreamHandler()
    ]
)

# Constants
XANO_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:WVrFdUAc/cassandra_leaves"
MONGO_URI = "mongodb+srv://user:user1234*@cluster0.4l4fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# MongoDB setup
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client["cassandra-data"]
mongo_collection = mongo_db["useful_data"]

# Extract data from API
def extract_data(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        logging.info("Data extraction successful.")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error during data extraction: {e}")
        return []

# Transform data for Xano and MongoDB
def transform_data(data):
    metadata = []
    useful_data = []
    for record in data:
        try:
            # Prepare metadata for Xano
            metadata.append({
                "id": record.get("id"),
                "domain_name": record.get("domain_name"),
                "language": record.get("language"),
                "tags": record.get("tags"),
                "http_status": record.get("http_status"),
                "published_by": record.get("published_by"),
                "user_email": record.get("user_email"),
            })
            # Prepare useful data for MongoDB
            useful_data.append({
                "id": record.get("id"),
                "title": record.get("title"),
                "url": record.get("url"),
                "preview_picture": record.get("preview_picture"),
                "content": clean_html(record.get("content", "")),
                "last_sourced": record.get("last_sourced_from_wallabag"),
            })
        except Exception as e:
            logging.error(f"Error transforming record {record.get('id')}: {e}")
    return metadata, useful_data

# Clean HTML content
def clean_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text().strip()

# Load metadata to Xano
def load_to_xano(metadata):
    for record in metadata:
        try:
            payload = {
                "domain_name": record["domain_name"],
                "language": record["language"],
                "tags": record["tags"],
                "http_status": record["http_status"],
                "published_by": record["published_by"],
                "user_email": record["user_email"]
            }
            response = requests.post(XANO_API_URL, json=payload)
            if response.status_code == 200 or response.status_code == 201:
                logging.info(f"Metadata {record['id']} loaded successfully to Xano.")
            else:
                logging.warning(f"Failed to load metadata {record['id']} to Xano: {response.text}")
        except Exception as e:
            logging.error(f"Error loading metadata {record['id']} to Xano: {e}")

# Load useful data to MongoDB
def load_to_mongodb(useful_data):
    try:
        mongo_collection.insert_many(useful_data)
        logging.info(f"{len(useful_data)} records loaded successfully to MongoDB.")
    except Exception as e:
        logging.error(f"Error loading useful data to MongoDB: {e}")

# Main ETL process
def main():
    API_URL = "http://167.172.142.105:5000/cassandra-leaves"

    # Step 1: Extract data
    data = extract_data(API_URL)
    if not data:
        logging.error("No data extracted. Exiting pipeline.")
        return

    # Step 2: Transform data
    metadata, useful_data = transform_data(data)

    # Step 3: Load data
    load_to_xano(metadata)
    load_to_mongodb(useful_data)

if __name__ == "__main__":
    main()
