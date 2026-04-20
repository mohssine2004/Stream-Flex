import os
from minio import Minio
from urllib.parse import urlparse

def get_minio_client():
    minio_url = os.getenv("MINIO_BASE_URL", "http://localhost:9000/test-vedio")
    parsed_url = urlparse(minio_url)
    
    # Extract endpoint (host:port)
    endpoint = parsed_url.netloc
    
    # Extract bucket from path (e.g., /test-vedio -> test-vedio)
    bucket_name = parsed_url.path.strip("/")
    
    access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    
    # Use secure=False for local development (http)
    client = Minio(
        endpoint,
        access_key=access_key,
        secret_key=secret_key,
        secure=parsed_url.scheme == "https"
    )
    
    # Ensure bucket exists
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)
        
    return client, bucket_name
