// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContestList from './components/ContestList';
import FiltersSidebar from './components/FiltersSidebar';
import ContestListSkeleton from './pages/ContestListSkeleton';
import UpdateContestForm from './components/UpdateContestForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewSolutions from './components/ViewSolutions';


function MainApp({
  darkMode,
  setDarkMode,
  contests,
  filteredContests,
  filterPlatform,
  setFilterPlatform,
  filterStatus,
  setFilterStatus,
}) {
  return (
    <div
      className={`container-fluid vh-100 overflow-hidden ${
        darkMode ? 'bg-dark text-light' : 'bg-light text-dark'
      }`}
    >
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-2 p-0 border-end position-sticky h-100 top-0">
          <FiltersSidebar
            darkMode={darkMode}
            filterPlatform={filterPlatform}
            setFilterPlatform={setFilterPlatform}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>

        {/* Main Content */}
        <div className="col-10 h-100 overflow-auto p-4">
          <div className="mb-4 d-flex justify-content-end">
            <button
              className={`btn ${darkMode ? 'btn-warning' : 'btn-dark'}`}
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? (
                <>
                  <i className="fas fa-sun me-2"></i>Light Mode
                </>
              ) : (
                <>
                  <i className="fas fa-moon me-2"></i>Dark Mode
                </>
              )}
            </button>
          </div>
          <ContestList contests={filteredContests} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dark mode state with localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });

  // Filter state for platform and status
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Save dark mode preference to localStorage on change
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Fetch contests data from the API
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contests/');
        setContests(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch contests');
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  if (loading) return <ContestListSkeleton />;
  if (error)
    return (
      <div className="alert alert-danger text-center my-5" role="alert">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </div>
    );

  // Filter contests based on selected platform and status
  const filteredContests = contests.filter((contest) => {
    const platformMatch = filterPlatform ? contest.platform === filterPlatform : true;
    const statusMatch = filterStatus ? contest.status === filterStatus : true;
    return platformMatch && statusMatch;
  });

  return (
 
      <Routes>
        {/* Main App Route */}
        <Route
          path="/"
          element={
            <MainApp
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              contests={contests}
              filteredContests={filteredContests}
              filterPlatform={filterPlatform}
              setFilterPlatform={setFilterPlatform}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          }
        />
        {/* Update Form Route */}
        <Route path="/update/:contestId" element={<UpdateContestForm />} />
        <Route path="/solution/:id" element={<ViewSolutions/>} />
      </Routes>
 
  );
}

export default App;
