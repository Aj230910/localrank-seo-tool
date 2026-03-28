<div align="center">

# 📍 LocalRank SEO Analyzer 

**A Modern SaaS Dashboard for Local SEO Insights**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps-API-FBBC05.svg)](https://developers.google.com/maps)

</div>

---

Welcome to **LocalRank**! Ever wonder how local businesses stack up against each other on Google Maps? Whether you're a local business owner checking your competition or an SEO specialist running audits for clients, LocalRank delivers instant, actionable insights wrapped in a beautiful, professional dashboard. 

## ✨ Why LocalRank?

Local SEO isn't just about showing up—it's about understanding *why* your competitors are ranking higher. LocalRank takes a standard search query (e.g., `"best gym in chennai"`) and processes the data through a custom algorithm to generate an easy-to-read **SEO Score**. 

By combining ratings, review volume, and positioning, LocalRank tells you exactly who the heavy hitters are in your local neighborhood.

## 🚀 Features

* 🔍 **Instant Keyword Analysis**: Search any query and instantly pull real-world Google Maps ranking data.
* 📈 **Custom SEO Scoring**: We calculate a unique SEO score for every business based on rating and review density.
* 🗺️ **Interactive Maps**: A built-in Google map lets you visualize exactly where the top-ranking competitors are located.
* 💅 **Premium SaaS UI**: A completely custom, responsive, and blazing-fast interface built with modern design principles (think Ahrefs or SEMrush).
* ⚡ **Live Animations**: Skeleton loaders, smooth transitions, and hover effects make navigating the data a joy.

## 🛠️ Built With

* **Frontend**: React.js, Custom CSS Design System, `@react-google-maps/api`
* **Backend**: Node.js, Express, Axios
* **API**: Google Places API

---

## 🏃‍♂️ Getting Started

Want to run LocalRank on your own machine? It's easy. Here's how to get it up and running in minutes:

### Prerequisites

You'll need a couple of things before you start:
1. **Node.js** installed on your computer.
2. A **Google Maps API Key** (Make sure to enable the Places API and Maps JavaScript API).

### 1. Installation

First, clone the repository and install the dependencies for both the frontend and backend.

```bash
# Clone the repo
git clone https://github.com/Aj230910/localrank-seo-tool.git
cd localrank-seo-tool

# Install Backend packages
cd backend
npm install

# Install Frontend packages
cd ../frontend
npm install
```

### 2. Environment Variables

You need to tell the app your Google API Key. 

**Backend (`/backend/.env`)**
Create a `.env` file in the `backend` folder and add:
```env
PORT=5000
GOOGLE_API_KEY=your_google_api_key_here
```

**Frontend (`/frontend/.env`)**
Create a `.env` file in the `frontend` folder and add:
```env
REACT_APP_MAP_KEY=your_google_api_key_here
```

### 3. Fire it up! 🔥

You'll need to run both the backend server and the frontend React app. 

**Terminal 1 (Backend):**
```bash
cd backend
npm start  # or: node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

The app will automatically open in your browser at `http://localhost:3000`. 

## 💡 How to Use

1. **Enter a Keyword**: Type something like *"dentist in bangalore"* or *"vegan restaurants near me"* into the search bar.
2. **Analyze Results**: Review the generated table. Look for businesses with the highest **SEO Score**—these are the ones dominating the local search results!
3. **View on Map**: Click on any business row to immediately pinpoint their location on the interactive map panel.

---

<div align="center">
  <i>Built with ❤️ for SEOs, Local Businesses, and Data Nerds.</i>
</div>
