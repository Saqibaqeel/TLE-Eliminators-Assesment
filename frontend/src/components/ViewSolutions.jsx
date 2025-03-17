// ViewSolutions.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';



const embedPlaylist = (playlistUrl) => {
  try {
    const url = new URL(playlistUrl);
    const playlistId = url.searchParams.get("list");
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  } catch (error) {
   
  }
};

const ViewSolutions = () => {
  const { id } = useParams(); 
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/contests/view/solutionurl/${id}`);
        const data = response.data.data;
     
        setSolutions(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [id]);


  if (error)
    return (
      <div className="alert alert-danger text-center mt-4" role="alert">
        {error}
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Solutions for Contest ID: {id}</h2>
      {solutions.length === 0 ? (
        <p>No solutions available.</p>
      ) : (
        <div className="row">
          {solutions.map((solution, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Solution {index + 1}</h5>
                  <div className="ratio ratio-16x9 mb-2">
                    <iframe 
                      title={`Playlist ${index + 1}`}
                      src={embedPlaylist(solution)}
                      allowFullScreen
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <p>
                    <a href={solution} target="_blank" rel="noopener noreferrer">
                      View on YouTube
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link to="/" className="btn btn-secondary mt-3">
        Back to Contests
      </Link>
    </div>
  );
};

export default ViewSolutions;
