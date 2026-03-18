from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import FavoriteModel
from services.google_places import fetch_places
from utils.geo import haversine_formula
from utils.scoring import calculate_relevance_score
import time

places_bp = Blueprint('places', __name__)

cache = {}
CACHE_TTL = 300  # 5 minutes in seconds

@places_bp.route('/places', methods=['GET'])
def get_places():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    mood = request.args.get('mood')
    max_distance = request.args.get('max_distance', 5000, type=int)
    min_rating = request.args.get('min_rating', 0, type=float)
    price_level = request.args.get('price_level', -1, type=int)
    sort_by = request.args.get('sort', 'relevance')
    
    if not lat or not lng or not mood:
        return jsonify({"error": "Missing required parameters: lat, lng, mood"}), 400
        
    cache_key = (lat, lng, mood, max_distance, min_rating, price_level, sort_by)
    current_time = time.time()
    
    if cache_key in cache:
        cache_time, cache_data = cache[cache_key]
        if current_time - cache_time < CACHE_TTL:
            return jsonify({"source": "cache", "data": cache_data})
            
    try:
        raw_places = fetch_places(lat, lng, mood, max_distance)
        
        processed_places = []
        for place in raw_places:
            p_lat = place['geometry']['location']['lat']
            p_lng = place['geometry']['location']['lng']
            distance = haversine_formula(lat, lng, p_lat, p_lng)
            
            if distance > (max_distance / 1000):
                continue
                
            rating = place.get('rating', 0)
            if rating < min_rating:
                continue
                
            p_level = place.get('price_level', -1)
            if price_level != -1 and p_level != -1 and p_level > price_level:
                continue
                
            review_count = place.get('user_ratings_total', 0)
            relevance = calculate_relevance_score(rating, review_count, distance)
            
            photos = place.get('photos', [])
            photo_ref = photos[0]['photo_reference'] if photos else None
            
            processed_place = {
                'id': place.get('place_id'),
                'name': place.get('name'),
                'distance': round(distance, 2),
                'rating': rating,
                'review_count': review_count,
                'open_now': place.get('opening_hours', {}).get('open_now', False),
                'price_level': p_level,
                'relevance_score': relevance,
                'photo_reference': photo_ref,
                'vicinity': place.get('vicinity'),
                'types': place.get('types', [])
            }
            
            processed_places.append(processed_place)
            
        if sort_by == 'distance':
            processed_places.sort(key=lambda x: x['distance'])
        elif sort_by == 'rating':
            processed_places.sort(key=lambda x: x['rating'], reverse=True)
        else: # relevance
            processed_places.sort(key=lambda x: x['relevance_score'], reverse=True)
            
        cache[cache_key] = (current_time, processed_places)
        
        return jsonify({"source": "api", "data": processed_places})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@places_bp.route('/geocode', methods=['GET'])
def geocode_location():
    address = request.args.get('address')
    if not address:
        return jsonify({"error": "Missing address parameter"}), 400
        
    import os
    import requests
    api_key = os.environ.get('GOOGLE_GEOCODING_API_KEY', os.environ.get('GOOGLE_PLACES_API_KEY'))
    if not api_key:
        return jsonify({"error": "Google API Key is not configured."}), 500
        
    try:
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            'address': address,
            'key': api_key
        }
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get('status') == 'OK' and len(data.get('results', [])) > 0:
            location = data['results'][0]['geometry']['location']
            formatted_address = data['results'][0]['formatted_address']
            return jsonify({
                "lat": location['lat'],
                "lng": location['lng'],
                "address": formatted_address
            })
        else:
            return jsonify({"error": f"Geocoding failed: {data.get('status', 'Unknown error')}"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@places_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favs = FavoriteModel.get_user_favorites(user_id)
    return jsonify({"favorites": favs}), 200

@places_bp.route('/favorites', methods=['POST'])
@jwt_required()
def toggle_favorite():
    user_id = get_jwt_identity()
    data = request.json
    
    if not data or not data.get('place'):
        return jsonify({"error": "Missing place data"}), 400
        
    place = data['place']
    # Action can be 'add' or 'remove'
    action = data.get('action', 'add') 
    
    if action == 'add':
        success = FavoriteModel.add_favorite(user_id, place)
        return jsonify({"message": "Added to favorites", "success": success}), 200
    else:
        success = FavoriteModel.remove_favorite(user_id, place['id'])
        return jsonify({"message": "Removed from favorites", "success": success}), 200
