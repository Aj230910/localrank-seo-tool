import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ExternalLink, Loader2, BarChart2, Map as MapIcon, Target, SearchIcon, Lightbulb, Star, Users, Award, Sun, Moon } from "lucide-react";
import "./App.css";

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
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`seo-badge ${level}`}
    >
      <span className="seo-dot"></span>
      {score}
    </motion.span>
  );
}

/* ===== SKELETON LOADER ===== */
function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {[...Array(6)].map((_, i) => (
        <motion.div 
          className="skeleton-row" 
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <div className="skeleton-block skeleton-circle" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="skeleton-block skeleton-line" style={{ width: `${60 + Math.random() * 30}%` }} />
            <div className="skeleton-block skeleton-line-sm" style={{ width: `${40 + Math.random() * 20}%` }} />
          </div>
          <div className="skeleton-block skeleton-line" style={{ width: "48px", height: "24px", borderRadius: "8px" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "40px", height: "24px", borderRadius: "8px" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "52px", height: "24px", borderRadius: "12px" }} />
        </motion.div>
      ))}
    </div>
  );
}

/* ===== STATS BAR ===== */
function StatsBar({ results }) {
  const avgRating = results.length > 0
    ? (results.reduce((sum, r) => sum + r.rating, 0) / results.length).toFixed(1)
    : "–";
  
  const totalReviews = results.length > 0
    ? results.reduce((sum, r) => sum + r.reviews, 0).toLocaleString()
    : "–";
  
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.seoScore, 0) / results.length)
    : "–";

  const stats = [
    { icon: <BarChart2 size={20} />, label: "Total Results", value: results.length, iconClass: "icon-primary" },
    { icon: <Star size={20} />, label: "Avg Rating", value: avgRating, iconClass: "icon-amber" },
    { icon: <Users size={20} />, label: "Total Reviews", value: totalReviews, iconClass: "icon-cyan" },
    { icon: <Award size={20} />, label: "Avg SEO Score", value: avgScore, iconClass: "icon-green" },
  ];

  return (
    <motion.div 
      className="stats-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="stat-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
        >
          <div className={`stat-icon ${stat.iconClass}`}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ===== THEME TOGGLE BUTTON ===== */
function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Sun size={18} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Moon size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ===== GOOGLE MAP STYLES ===== */
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0c0c14" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0c0c14" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5e5e78" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#a78bfa" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f0f1a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#5e5e78" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e1e35" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#06060a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3e3e54" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#0c0c14" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] }
];

const lightMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#4f46e5" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d6ff" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] }
];

/* ===== MAIN APP ===== */
function App() {

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // Theme state — persisted to localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("localrank-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("localrank-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY
  });

  const search = async () => {

    if (!keyword) return;

    setLoading(true);
    setSearched(true);
    setSelectedLocation(null);
    setActiveIndex(null);

    const apiUrl = process.env.REACT_APP_API_URL || "https://localrank-seo-tool.onrender.com";
    
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", overflowX: "hidden", transition: "background 350ms ease" }}>

      {/* ===== NAVBAR ===== */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="navbar" 
        id="navbar"
      >
        <div className="navbar-brand">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="navbar-logo"
          >
            <MapPin size={20} color="white" />
          </motion.div>
          <div>
            <div className="navbar-title">Local<span>Rank</span></div>
          </div>
          <span className="navbar-badge">SEO Analyzer</span>
        </div>

        <div className="navbar-right">
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="navbar-stat"
              >
                <span className="navbar-stat-label">Results</span>
                <span className="navbar-stat-value">{results.length} found</span>
              </motion.div>
            )}
          </AnimatePresence>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </motion.nav>

      {/* ===== SEARCH SECTION ===== */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="search-hero" 
        id="search-section"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="hero-badge"
        >
          <Target size={14} className="hero-badge-icon"/> Google Maps Intelligence
        </motion.div>
        
        <h1 className="search-hero-title">Analyze Local SEO Rankings</h1>
        <p className="search-hero-subtitle">
          Discover how businesses rank on Google Maps for any keyword in real-time
        </p>

        <div className="search-container">
          <motion.div 
            whileFocus="focus"
            className="search-input-wrapper"
          >
            <div className="search-icon">
              <Search size={20} />
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              id="search-btn"
              onClick={search}
              className={`search-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? "Analyzing..." : "Analyze"}
            </motion.button>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="search-tags"
          >
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Trending:</span>
            {quickSearches.map((q, idx) => (
              <motion.span
                variants={fadeIn}
                key={q}
                className="search-tag"
                onClick={() => {
                  setKeyword(q);
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {q}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ===== MAIN CONTENT ===== */}
      <AnimatePresence>
        {(searched || results.length > 0) && (
          <motion.main 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
            className="main-content flex-grow" 
            id="results-section"
          >
            {/* Stats Bar */}
            {results.length > 0 && <StatsBar results={results} />}

            <div className="dashboard-grid">

              {/* ===== TABLE PANEL ===== */}
              <div className="results-panel">
                <div className="panel-header">
                  <h2 className="panel-title">
                    <BarChart2 size={20} className="text-primary" />
                    Ranking Results
                  </h2>
                  {results.length > 0 && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="results-count-badge"
                    >
                      {results.length} businesses
                    </motion.span>
                  )}
                </div>

                <div className="results-card glass-panel">
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
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {results.map((place, index) => (
                              <motion.tr
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.04, duration: 0.3 }}
                                key={index}
                                onClick={() => handleRowClick(place, index)}
                                className={`${activeIndex === index ? "active-row" : ""} ${index === 0 ? "top-rank" : ""}`}
                              >
                                <td>
                                  <motion.span 
                                    whileHover={{ scale: 1.1 }}
                                    className={"rank-badge " + (index < 3 ? "rank-" + (index + 1) : "")}
                                  >
                                    {place.rank}
                                  </motion.span>
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
                                  <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="map-link"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink size={13} />
                                    View
                                  </motion.a>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="empty-state"
                    >
                      <div className="empty-state-icon">
                        <SearchIcon size={28} className="text-tertiary" />
                      </div>
                      <div className="empty-state-title">No results found</div>
                      <div className="empty-state-text">
                        Try a different keyword or check your search term for typos to discover new rankings.
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ===== MAP PANEL ===== */}
              <div className="map-panel">
                <div className="panel-header">
                  <h2 className="panel-title">
                    <MapIcon size={20} className="text-primary"/> Business Location
                  </h2>
                  {selectedLocation && (
                    <motion.span 
                      animate={{ opacity: [1, 0.5, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="map-card-dot"
                    />
                  )}
                </div>

                <div className="map-card glass-panel">
                  <div className="map-card-header">
                    <MapPin size={15} className="text-tertiary" />
                    <span className="map-card-title">
                      {selectedLocation ? "Viewing spot on map" : "Select a business to reveal"}
                    </span>
                  </div>

                  {selectedLocation && isLoaded ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="map-container" 
                      key={`${selectedLocation.lat}-${selectedLocation.lng}-${theme}`}
                    >
                      <GoogleMap
                        zoom={14}
                        center={selectedLocation}
                        mapContainerStyle={{
                          width: "100%",
                          height: "440px"
                        }}
                        options={{
                          disableDefaultUI: false,
                          zoomControl: true,
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: true,
                          styles: theme === "dark" ? darkMapStyles : lightMapStyles
                        }}
                      >
                        <Marker position={selectedLocation} />
                      </GoogleMap>
                    </motion.div>
                  ) : (
                    <div className="map-placeholder">
                      <div className="map-placeholder-icon">
                        <MapIcon size={24} className="text-tertiary" />
                      </div>
                      <div className="map-placeholder-text">Waiting for selection...</div>
                      <div className="map-placeholder-sub">
                        Click any business in the table to instantly view its exact location.
                      </div>
                    </div>
                  )}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="map-tip"
                >
                  <div className="map-tip-title"><Lightbulb size={12} style={{display: 'inline', marginRight: '4px'}}/> Pro Tip</div>
                  <div className="map-tip-text">
                    Businesses with higher SEO scores rank better on Google Maps. Consistent reviews boost the score dramatically.
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <MapPin size={12} />
            LocalRank SEO Analyzer
          </div>
          <p>Crafted for high-end local business insights</p>
        </div>
      </footer>

    </div>
  );
}

export default App;