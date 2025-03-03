import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [inputValue, setInputValue] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true)
    setError(null)
    
    fetch(`${API_URL}/people`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requirement: inputValue
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('data:', data)
      setSearchResult(data)
      setIsLoading(false)
    })
    .catch((error) => {
      console.error("error:", error)
      setError("An error occurred during search. Please try again later.")
      setIsLoading(false)
    });    
  }

  const renderSearchResult = () => {
    if (!searchResult) return null;

    return (
      <div className="result-container">
        <div className="result-header">
          <h2>Search Results</h2>
          <p className="search-query">Search: {searchResult.requirement}</p>
        </div>

        {searchResult.results.length === 0 ? (
          <div className="no-results">
            No candidates found matching your criteria.
          </div>
        ) : (
          <div className="candidates-list">
            {searchResult.results.map((candidate, index) => (
              <div key={index} className="candidate-card">
                <h3>{candidate.name}</h3>
                <div className="candidate-details">
                  <div className="detail-item">
                    <strong>Experience:</strong> {candidate.experience} years
                  </div>
                  <div className="detail-item">
                    <strong>Skills:</strong> {candidate.skills}
                  </div>
                  <div className="detail-item">
                    <strong>Introduction:</strong> {candidate.introduction}
                  </div>
                  <div className="detail-item">
                    <strong>Job Preference:</strong> {candidate.job_preference}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>People</h1>
      <div className="search-box">
        <input 
          type="text" 
          placeholder='Enter search criteria (e.g., "search for full-time Java engineers with 3+ years experience")'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {renderSearchResult()}
    </div>
  )
}

export default App
