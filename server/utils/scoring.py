import math

def calculate_relevance_score(rating, review_count, distance):
    """
    Custom relevance formula: (score = rating × log(review_count + 1)) / (distance + 0.1)
    Added 0.1 to distance to prevent division by zero for highly localized places.
    """
    rating = float(rating) if rating else 0.0
    review_count = float(review_count) if review_count else 0.0
    distance = float(distance) if distance else 0.0
    
    safe_distance = distance + 0.1
    
    score = (rating * math.log10(review_count + 1.0)) / safe_distance
    return score
