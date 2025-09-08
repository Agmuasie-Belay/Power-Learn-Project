import requests
import os
from urllib.parse import urlparse
import hashlib

def fetch_image(url, directory="Fetched_Images", existing_hashes=set()):
    """
    Fetch an image from a URL and save it to the specified directory.
    Prevents duplicates based on image content hash.
    """
    try:
        # Fetch the image with a timeout and headers
        headers = {
            "User-Agent": "UbuntuImageFetcher/1.0 (+https://example.com/)"
        }
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()  # Raise exception for bad HTTP codes

        # Ensure content type is an image
        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('image'):
            print(f"✗ URL does not point to an image: {url}")
            return existing_hashes

        # Create directory if it doesn't exist
        os.makedirs(directory, exist_ok=True)

        # Extract filename from URL or generate one
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        if not filename or '.' not in filename:
            filename = "downloaded_image.jpg"

        # Check for duplicate using content hash
        image_hash = hashlib.md5(response.content).hexdigest()
        if image_hash in existing_hashes:
            print(f"⚠ Duplicate image detected, skipping: {filename}")
            return existing_hashes

        # Save the image
        filepath = os.path.join(directory, filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)

        print(f"✓ Successfully fetched: {filename}")
        print(f"✓ Image saved to {filepath}\n")
        existing_hashes.add(image_hash)

    except requests.exceptions.RequestException as e:
        print(f"✗ Connection error for URL {url}: {e}")
    except Exception as e:
        print(f"✗ An error occurred for URL {url}: {e}")

    return existing_hashes

def main():
    print("Welcome to the Ubuntu Image Fetcher")
    print("A tool for mindfully collecting images from the web\n")

    # Prompt user for multiple URLs (comma-separated)
    urls = input("Please enter image URLs (comma-separated if multiple): ")
    url_list = [url.strip() for url in urls.split(",") if url.strip()]

    # Track existing image hashes to prevent duplicates
    existing_hashes = set()

    for url in url_list:
        existing_hashes = fetch_image(url, existing_hashes=existing_hashes)

    print("Connection strengthened. Community enriched.")

if __name__ == "__main__":
    main()
