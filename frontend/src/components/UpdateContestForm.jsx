// UpdateContestForm.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateContestForm = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [solutionUrl, setSolutionUrl] = useState('');
  // Initial solution list with default playlists
  const [solutionList, setSolutionList] = useState([
    "https://youtube.com/playlist?list=YOUR_PLAYLIST_ID_1",
    "https://youtube.com/playlist?list=YOUR_PLAYLIST_ID_2"
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Use the API endpoint that matches your server route.
      await axios.put(`http://localhost:8000/api/contests/update/${contestId}`, { solutionUrl });
      alert('Solution URL updated successfully!');
      // Add the updated solution URL to the list if it's not already there.
      if (solutionUrl && !solutionList.includes(solutionUrl)) {
        setSolutionList([...solutionList, solutionUrl]);
      }
      navigate('/'); // Navigate back to the contest list
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Update Contest Solution URL</h2>
        </div>
        <div className="card-body">
          <p className="mb-4">
            Contest ID: <strong>{contestId}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="solutionUrl" className="form-label">Solution URL</label>
              <input 
                type="url"
                id="solutionUrl"
                className="form-control"
                placeholder="Enter the YouTube playlist URL"
                value={solutionUrl}
                onChange={(e) => setSolutionUrl(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex">
              <button type="submit" className="btn btn-success me-2" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </form>
          <hr className="my-4" />
          <div>
            <h5>Available YouTube Playlists</h5>
            <ul className="list-group">
              {solutionList.map((url, index) => (
                <li key={index} className="list-group-item">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateContestForm;
