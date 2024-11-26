import React from "react";
import PropTypes from "prop-types";

const SearchResults = ({ results, searchTime, isSearching, searchType }) => {
  if (isSearching) {
    return <div>Searching...</div>;
  }

  if (!results || results.length === 0) {
    return <div>No results found for the current search.</div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results ({searchType})</h2>
      <p>Search completed in {searchTime} ms</p>
      <ul>
        {results.map((result, index) => (
          <li key={index} className="result-item">
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            {result.category && <p><strong>Category:</strong> {result.category}</p>}
            {result.price && <p><strong>Price:</strong> ${result.price}</p>}
            {result.highlights && (
              <div className="highlights">
                <strong>Highlights:</strong>
                {result.highlights.map((highlight, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: highlight }} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.number,
      highlights: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  searchTime: PropTypes.string.isRequired, // Expected to be in milliseconds (as string)
  isSearching: PropTypes.bool.isRequired,
  searchType: PropTypes.string.isRequired,
};

SearchResults.defaultProps = {
  results: [],
  searchTime: "0",
  isSearching: false,
};

export default SearchResults;