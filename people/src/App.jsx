import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [inputValue, setInputValue] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear() + '/' + 
           String(date.getMonth() + 1).padStart(2, '0') + '/' + 
           String(date.getDate()).padStart(2, '0');
  }

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true)
    setError(null)
    setSelectedCandidate(null)
    
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

  const renderCandidateList = () => {
    if (!searchResult?.results?.length) return null;

    return (
      <div className="candidates-list">
        {searchResult.results.map((candidate, index) => (
          <div 
            key={index} 
            className={`candidate-card ${selectedCandidate === candidate ? 'selected' : ''}`}
            onClick={() => setSelectedCandidate(candidate)}
          >
            <h3>{candidate.first_name} {candidate.last_name}</h3>
            <div className="candidate-brief">
              <p><strong>Position:</strong> {candidate.position}</p>
              <p><strong>Experience:</strong> {candidate.company}</p>
              <p><strong>Skills:</strong> {candidate.skills}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderCandidateDetails = () => {
    if (!selectedCandidate) return (
      <div className="no-selection">
        Please select a candidate from the list to view details
      </div>
    );

    return (
      <div className="candidate-details">
        <h2>{selectedCandidate.first_name} {selectedCandidate.last_name}</h2>
        <div className="details-section">
          <h3>Basic Information</h3>
          <p><strong>Gender:</strong> {selectedCandidate.gender}</p>
          <p><strong>Age:</strong> {selectedCandidate.age}</p>
          <p><strong>Birth Date:</strong> {formatDate(selectedCandidate.birth_date)}</p>
          <p><strong>Nationality:</strong> {selectedCandidate.nationality}</p>
          <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
          <p><strong>Email:</strong> {selectedCandidate.email}</p>
          <p><strong>Address:</strong> {selectedCandidate.address}</p>
        </div>
        
        <div className="details-section">
          <h3>Education</h3>
          <p><strong>Degree:</strong> {selectedCandidate.degree}</p>
          <p><strong>University:</strong> {selectedCandidate.university}</p>
          <p><strong>Major:</strong> {selectedCandidate.major}</p>
          <p><strong>Study Period:</strong> {formatDate(selectedCandidate.education_start_date)} - {selectedCandidate.education_end_date ? formatDate(selectedCandidate.education_end_date) : 'Present' }</p>
          <p><strong>GPA:</strong> {selectedCandidate.gpa}</p>
        </div>

        <div className="details-section">
          <h3>Work Experience</h3>
          <p><strong>Company:</strong> {selectedCandidate.company}</p>
          <p><strong>Position:</strong> {selectedCandidate.position}</p>
          <p><strong>Employment Period:</strong> {formatDate(selectedCandidate.work_start_date)} - {selectedCandidate.work_end_date ? formatDate(selectedCandidate.work_end_date) : 'Present'}</p>
          <p><strong>Responsibilities:</strong> {selectedCandidate.responsibilities}</p>
        </div>

        <div className="details-section">
          <h3>Skills</h3>
          <p>{selectedCandidate.skills}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="search-section">
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
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {searchResult && (
        searchResult.results.length === 0 ? (
          <div className="no-results">
            No candidates found matching your criteria.
          </div>
        ) : (
          <div className="results-container">
            <div className="results-left">
              {renderCandidateList()}
            </div>
            <div className="results-right">
              {renderCandidateDetails()}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default App
