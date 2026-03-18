import os
import requests

MOOD_MAPPING = {
    'Work': 'cafe|library|coworking_space',
    'Date': 'restaurant|bar|movie_theater',
    'Quick Bite': 'fast_food|bakery',
    'Budget': 'grocery_or_supermarket|convenience_store'
}

def fetch_places(lat, lng, mood, radius=5000):
    api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
    if not api_key:
        raise ValueError("Google Places API Key is not configured.")
        
    types = MOOD_MAPPING.get(mood, 'restaurant')
    
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        'location': f"{lat},{lng}",
        'radius': radius,
        'keyword': types.replace('|', ' '),
        'key': api_key
    }
    
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"Google API Error: {response.text}")
        
    data = response.json()
    if data.get('status') not in ['OK', 'ZERO_RESULTS']:
        raise Exception(f"Google API Status: {data.get('status')}")
        
    return data.get('results', [])
