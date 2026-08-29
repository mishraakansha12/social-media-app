import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SearchUsers.css";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const res = await axios.get(
        `http://localhost:5000/api/user/search?query=${encodeURIComponent(
          query.trim()
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">

      <div className="search-box">

        {/* HEADER */}

        <div className="search-header">
          <div className="search-icon">⌕</div>

          <div>
            <h2>Discover People</h2>
            <p>Find people and connect with them</p>
          </div>
        </div>


        {/* SEARCH FORM */}

        <form
          onSubmit={handleSearch}
          className="search-form"
        >
          <div className="search-input-wrapper">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search username or email..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />

            {query && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setSearched(false);
                }}
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            className="search-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>


        {/* RESULTS */}

        <div className="search-results">

          {loading ? (

            <div className="search-message">
              <div className="search-spinner"></div>
              <p>Finding people...</p>
            </div>

          ) : searched && results.length === 0 ? (

            <div className="search-message">
              <div className="no-result-icon">🔎</div>

              <h3>No users found</h3>

              <p>
                Try searching with another username
                or email.
              </p>
            </div>

          ) : !searched ? (

            <div className="search-message">
              <div className="discover-icon">✨</div>

              <h3>Discover new people</h3>

              <p>
                Search for a username or email to
                find people.
              </p>
            </div>

          ) : (

            <>
              <div className="results-title">
                {results.length}{" "}
                {results.length === 1
                  ? "person"
                  : "people"}{" "}
                found
              </div>

              {results.map((user) => (

                <Link
                  key={user._id}
                  to={`/user/${user._id}`}
                  className="user-card"
                >

                  <div className="user-avatar">
                    {user.username
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div className="user-details">

                    <strong>
                      {user.username}
                    </strong>

                    <span>
                      {user.email}
                    </span>

                  </div>

                  <span className="user-arrow">
                    →
                  </span>

                </Link>

              ))}
            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default SearchUsers;