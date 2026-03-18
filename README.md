# Nearify - Smart Nearby Places Recommender

Nearify is a production-quality, full-stack web application designed to help you find nearby places based on your current mood (Work, Date, Quick Bite, Budget). Built with a modern, glassmorphic UI using React, Tailwind CSS, and Framer Motion, and powered by a robust Python Flask backend integrated with the Google Places API.

## Features
- **Mood-Based Discovery:** Get tailored recommendations based on what you feel like doing.
- **Smart Filtering & Sorting:** Filter by distance, rating, and price. Sort by relevance, distance, or rating.
- **Custom Relevance Scoring:** Intelligent ranking using `(rating × log(review_count + 1)) / distance`.
- **High-Performance Architecture:** Debounced frontend requests, fast in-memory backend caching (5-minute TTL).
- **Premium UI/UX:** Responsive glassmorphism design, dark mode sync, micro-animations, and skeleton loaders.
- **Favorites System:** Save places to your favorites (persisted safely to localStorage).

## Tech Stack
**Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios, Lucide Icons  
**Backend:** Python 3, Flask, Flask-CORS, python-dotenv, requests

---

## Setup Instructions

### 1. Google Places API Key Setup
You need a valid Google Maps API Key with the **Places API** enabled.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the **Places API**.
3. Generate an API Key under **APIs & Services > Credentials**.

### 2. Backend Setup (Flask)
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Rename `.env.example` to `.env`
   - Add your Google Places API Key: `GOOGLE_PLACES_API_KEY=your_api_key_here`
5. Run the Flask server:
   ```bash
   python app.py
   ```
   *The server will start on `http://localhost:5000`*

### 3. Frontend Setup (React / Vite)
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Rename `.env.example` to `.env`
   - Confirm backend URL is pointing to `http://localhost:5000/api`
   - Define `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here` if you want Place Image photos to load correctly.
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be running at `http://localhost:5173`*

## Architecture Notes
- The Flask backend acts as a secure proxy to the Google Places API, ensuring your API key is never exposed to the client interface.
- Results are dynamically scored using the custom relevance formula in the backend before being sorted and sent to the client.
- Rapid duplicate requests will instantly hit the Flask in-memory dictionary cache, protecting Google API quota limits.
