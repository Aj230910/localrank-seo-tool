require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GOOGLE_API_KEY;

/*
Route: /search
Example:
http://localhost:5000/search?keyword=best gym in chennai
*/

app.get("/search", async (req, res) => {
  try {

    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({
        error: "Keyword is required"
      });
    }

    const encodedKeyword = encodeURIComponent(keyword);

    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedKeyword}&key=${API_KEY}`;

    const response = await axios.get(url);

    const places = response.data.results;

    // Clean results
    const cleanedResults = places.map((place, index) => {

      const rating = place.rating || 0;
      const reviews = place.user_ratings_total || 0;

      // SEO score formula
      const seoScore =
        Math.round((rating * 20) + Math.log(reviews + 1));

      return {
        rank: index + 1,
        name: place.name,
        rating: rating,
        reviews: reviews,
        address: place.formatted_address,
        seoScore: seoScore,
        location: place.geometry.location
      };

    });

    res.json({
      keyword: keyword,
      totalResults: cleanedResults.length,
      results: cleanedResults
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: "Failed to fetch data from Google Places API"
    });

  }
});


/*
Health check
*/

app.get("/", (req, res) => {
  res.json({
    message: "Local SEO Ranking API running 🚀"
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});