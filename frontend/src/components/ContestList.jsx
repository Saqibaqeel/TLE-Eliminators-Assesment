// ContestList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContestListSkeleton from '../pages/ContestListSkeleton';

const ContestList = ({ contests, darkMode, toggleDarkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem('contestBookmarks')) || []
  );

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contestBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleBookmark = (contestId) => {
    setBookmarks((currentBookmarks) =>
      currentBookmarks.includes(contestId)
        ? currentBookmarks.filter((id) => id !== contestId)
        : [...currentBookmarks, contestId]
    );
  };

  const getContestTiming = (startTime, duration) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 1000);
    const timeLeft = start - currentTime;
    
    return {
      endTime: end,
      days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
      hasStarted: timeLeft < 0
    };
  };

  // Optionally filter contests by bookmarks
  const filteredContests = showBookmarked
    ? contests.filter((contest) => bookmarks.includes(contest.contestId))
    : contests;

  if (!contests.length) return <ContestListSkeleton />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-trophy me-2"></i>
          Coding Contests
        </h1>
        <div className="btn-group">
          <button 
            className={`btn ${!showBookmarked ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowBookmarked(false)}
          >
            All Contests
          </button>
          <button 
            className={`btn ${showBookmarked ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setShowBookmarked(true)}
          >
            <i className="fas fa-star me-2"></i>
            Bookmarks ({bookmarks.length})
          </button>
        </div>
      </div>

      <div className="row">
        {filteredContests.map((contest) => {
          const timing = getContestTiming(contest.startTime, contest.duration);
          const isBookmarked = bookmarks.includes(contest.contestId);
          return (
            <div key={contest.contestId} className="col-md-6 col-lg-4 mb-4">
              <div className={`card h-100 shadow-sm ${darkMode ? 'bg-dark text-light' : ''}`}>
                <div className="card-body position-relative">
                  {/* Update Icon (bottom center) */}
                  <Link
                    to={`/update/${contest.contestId}`}
                    className="btn btn-link position-absolute bottom-0 start-50 translate-middle-x mb-2"
                    title="Update Solution URL"
                    style={{ zIndex: 2 }}
                  >
                    <i className="fas fa-plus-circle text-info fs-5"></i>
                  </Link>

                  {/* Bookmark Button (top-right) */}
                  <button 
                    className="btn btn-link position-absolute top-0 end-0 mt-2 me-2"
                    onClick={() => toggleBookmark(contest.contestId)}
                    style={{ zIndex: 2 }}
                  >
                    <i className={`${isBookmarked ? 'fas text-warning' : 'far text-secondary'} fa-star fs-5`}></i>
                  </button>

                  {/* Contest Content */}
                  <h5 className="card-title">
                    <i className={`fas ${
                      contest.platform === 'Leetcode' ? 'fa-code' :
                      contest.platform === 'Codechef' ? 'fa-utensils' : 
                      'fa-laptop-code'
                    } me-2`}></i>
                    {contest.name}
                  </h5>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Start:</span>
                      <span>{new Date(contest.startTime).toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">End:</span>
                      <span>{timing.endTime.toLocaleString()}</span>
                    </div>
                  </div>

                  {contest.status === 'upcoming' && (
                    <div className="alert alert-warning p-2 mb-3 text-center">
                      {timing.hasStarted ? (
                        <span>Contest Running</span>
                      ) : (
                        <>
                          <div className="fw-bold mb-1">Time Remaining</div>
                          <div className="d-flex justify-content-center gap-2">
                            <span>{timing.days}d</span>
                            <span>{timing.hours}h</span>
                            <span>{timing.minutes}m</span>
                            <span>{timing.seconds}s</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Join
                    </a>
                    <span className={`badge ${contest.status === 'upcoming' ? 'bg-success' : 'bg-secondary'}`}>
                      {contest.status}
                    </span>
                  </div>

                  {contest.solutionUrl && (
                    <div className="mt-2">
                     
                      <Link
  to={`/solution/${contest._id}`}
  className="text-decoration-none small"
  title="View Solutions"
>
  <i className="fas fa-book me-1"></i>
  View Solutions
</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContestList;
