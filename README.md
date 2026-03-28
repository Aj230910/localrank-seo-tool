#  LocalRank — Local SEO Ranking Analyzer

LocalRank is a **full-stack SEO analytics tool** that analyzes Google Maps local search rankings for businesses.
It helps understand **local competition, ratings, reviews, and SEO strength** for any search keyword.

Built with **React, Node.js, Google Places API, and Google Maps**.

---

## 🌍 Live Demo

https://your-vercel-link.vercel.app


---

##  Features

*  **Keyword Search**

  * Analyze local business rankings for any keyword
  * Example: `best gym in chennai`

*  **SEO Ranking Table**

  * Rank
  * Business Name
  * Address
  * Rating
  * Reviews
  * SEO Score

*  **Interactive Map**

  * Click any business to view location on map

*  **SEO Score Algorithm**

  * Calculates SEO competitiveness based on:
  * Google rating
  * Number of reviews

*  **Real-Time Data**

  * Fetches business data from Google Places API

---

##  Architecture

User Search
↓
React Frontend (Vercel)
↓
Node.js API (Render)
↓
Google Places API
↓
Results + Map Visualization

---

## 🛠️ Tech Stack

Frontend

* React.js
* Axios
* Google Maps API

Backend

* Node.js
* Express.js
* Google Places API

Deployment

* Vercel (Frontend)
* Render (Backend)

Tools

* Git
* VS Code
* Figma

---

##  Project Structure

```
localrank-seo-tool
│
├── backend
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── README.md
```

---

##  Installation

Clone the repository

```
git clone https://github.com/Aj230910/localrank-seo-tool.git
cd localrank-seo-tool
```

Install backend dependencies

```
cd backend
npm install
```

Run backend

```
node server.js
```

Install frontend dependencies

```
cd ../frontend
npm install
```

Run frontend

```
npm start
```

---

##  Environment Variables

Backend `.env`

```
GOOGLE_API_KEY=your_google_places_api_key
```

Frontend `.env`

```
REACT_APP_MAP_KEY=your_google_maps_api_key
```


---

## 👨‍💻 Author

**Ambrish Jeyan T**

LinkedIn
https://www.linkedin.com/in/ambrish-jeyan-t/

---

⭐ If you found this project useful, consider giving it a **star**!
