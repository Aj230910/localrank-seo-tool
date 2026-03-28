import { useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import "./App.css";

/* ===== SVG ICON COMPONENTS ===== */
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

/* ===== STAR RATING COMPONENT ===== */
function StarRating({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i === fullStars && hasHalf) {
      stars.push(<span key={i} className="star filled" style={{ opacity: 0.5 }}>★</span>);
    } else {
      stars.push(<span key={i} className="star">★</span>);
    }
  }

  return <div className="stars-container">{stars}</div>;
}

/* ===== SEO SCORE BADGE ===== */
function SeoBadge({ score }) {
  let level = "score-low";
  if (score >= 80) level = "score-high";
  else if (score >= 60) level = "score-medium";

  return (
    <span className={`seo-badge ${level}`}>
      <span className="seo-dot"></span>
      {score}
    </span>
  );
}

/* ===== SKELETON LOADER ===== */
function SkeletonLoader() {
  return (
    <div>
      {[...Array(6)].map((_, i) => (
        <div className="skeleton-row" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="skeleton-block skeleton-circle" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <div className="skeleton-block skeleton-line" style={{ width: `${60 + Math.random() * 30}%` }} />
            <div className="skeleton-block skeleton-line-sm" style={{ width: `${40 + Math.random() * 20}%` }} />
          </div>
          <div className="skeleton-block skeleton-line" style={{ width: "48px", height: "24px" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "40px", height: "24px" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "52px", height: "24px" }} />
        </div>
      ))}
    </div>
  );
}

/* ===== MAIN APP ===== */
function App() {

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY
  });

  const search = async () => {

    if (!keyword) return;

    setLoading(true);
    setSearched(true);
    setSelectedLocation(null);
    setActiveIndex(null);

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    
    const res = await axios.get(
      `${apiUrl}/search?keyword=${keyword}`
    );

    setResults(res.data.results);
    setLoading(false);

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  const handleRowClick = (place, index) => {
    setSelectedLocation(place.location);
    setActiveIndex(index);
  };

  const quickSearches = [
    "best gym in chennai",
    "restaurants near me",
    "dentist in bangalore",
    "spa in mumbai"
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ===== NAVBAR ===== */}
      <nav className="navbar" id="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">📍</div>
          <div>
            <div className="navbar-title">Local<span>Rank</span></div>
          </div>
          <span className="navbar-badge">SEO Analyzer</span>
        </div>

        <div className="navbar-right">
          {results.length > 0 && (
            <div className="navbar-stat">
              <span className="navbar-stat-label">Results Found</span>
              <span className="navbar-stat-value">{results.length} businesses</span>
            </div>
          )}
        </div>
      </nav>

      {/* ===== SEARCH SECTION ===== */}
      <section className="search-hero" id="search-section">
        <h1 className="search-hero-title">Analyze Local SEO Rankings</h1>
        <p className="search-hero-subtitle">
          Discover how businesses rank on Google Maps for any keyword
        </p>

        <div className="search-container">
          <div className="search-input-wrapper">
            <div className="search-icon">
              <SearchIcon />
            </div>
            <input
              id="search-input"
              type="text"
              className="search-input"
              placeholder="Search keyword (e.g., best gym in chennai)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              id="search-btn"
              onClick={search}
              className={`search-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? <LoaderIcon /> : <SearchIcon />}
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          <div className="search-tags">
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-tertiary)", fontWeight: 500 }}>Try:</span>
            {quickSearches.map((q) => (
              <span
                key={q}
                className="search-tag"
                onClick={() => {
                  setKeyword(q);
                }}
              >
                {q}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      {(searched || results.length > 0) && (
        <main className="main-content" id="results-section">
          <div className="dashboard-grid">

            {/* ===== TABLE PANEL ===== */}
            <div className="results-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  <MapPinIcon />
                  Ranking Results
                </h2>
                {results.length > 0 && (
                  <span className="panel-count">{results.length} found</span>
                )}
              </div>

              <div className="results-card">
                {loading ? (
                  <SkeletonLoader />
                ) : results.length > 0 ? (
                  <div className="table-responsive">
                    <table className="results-table" id="results-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Business</th>
                        <th>Rating</th>
                        <th>Reviews</th>
                        <th>SEO Score</th>
                        <th>Map</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((place, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(place, index)}
                          className={`${activeIndex === index ? "active-row" : ""} ${index === 0 ? "top-rank" : ""}`}
                          style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
                        >
                          <td>
                            <span className={`rank-badge ${index < 3 ? `rank-${index + 1}` : ""}`}>
                              {place.rank}
                            </span>
                          </td>
                          <td>
                            <div className="business-info">
                              <span className="business-name">{place.name}</span>
                              <span className="business-address" title={place.address}>
                                {place.address}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="rating-cell">
                              <StarRating rating={place.rating} />
                              <span className="rating-number">{place.rating}</span>
                            </div>
                          </td>
                          <td>
                            <span className="reviews-count">
                              {place.reviews.toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <SeoBadge score={place.seoScore} />
                          </td>
                          <td>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="map-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalIcon />
                              Open
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📊</div>
                    <div className="empty-state-title">No results found</div>
                    <div className="empty-state-text">
                      Try a different keyword or check your search term for typos.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ===== MAP PANEL ===== */}
            <div className="map-panel">
              <div className="panel-header">
                <h2 className="panel-title">
                  📍 Business Location
                </h2>
                {selectedLocation && <span className="map-card-dot"></span>}
              </div>

              <div className="map-card">
                <div className="map-card-header">
                  <MapPinIcon />
                  <span className="map-card-title">
                    {selectedLocation ? "Viewing location on map" : "Select a business to view"}
                  </span>
                </div>

                {selectedLocation && isLoaded ? (
                  <div className="map-container" key={`${selectedLocation.lat}-${selectedLocation.lng}`} style={{ animation: "scaleIn 0.3s ease-out" }}>
                    <GoogleMap
                      zoom={14}
                      center={selectedLocation}
                      mapContainerStyle={{
                        width: "100%",
                        height: "380px"
                      }}
                      options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: true,
                        styles: [
                          { featureType: "poi", stylers: [{ visibility: "simplified" }] },
                          { featureType: "water", stylers: [{ color: "#d4e8f7" }] }
                        ]
                      }}
                    >
                      <Marker position={selectedLocation} />
                    </GoogleMap>
                  </div>
                ) : (
                  <div className="map-placeholder">
                    <div className="map-placeholder-icon">🗺️</div>
                    <div className="map-placeholder-text">No location selected</div>
                    <div className="map-placeholder-sub">
                      Click on any business in the table to view its location on the map
                    </div>
                  </div>
                )}
              </div>

              <div className="map-tip">
                <div className="map-tip-title">💡 Pro Tip</div>
                <div className="map-tip-text">
                  Businesses with higher SEO scores rank better on Google Maps. Focus on reviews and ratings to improve your local ranking.
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        LocalRank SEO Analyzer · Built for local business insights
      </footer>

    </div>
  );
}

export default App;