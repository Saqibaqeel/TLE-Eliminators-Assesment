import React, { useState } from 'react';

const FiltersSidebar = ({ darkMode, filterPlatform, setFilterPlatform, filterStatus, setFilterStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const platformOptions = [
    { label: 'All', value: '' },
    { label: 'Leetcode', value: 'Leetcode' },
    { label: 'Codechef', value: 'Codechef' },
    { label: 'Codeforces', value: 'Codeforces' },
  ];

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Running', value: 'running' },
    { label: 'Past', value: 'past' },
  ];

  // Conditionally style the sidebar based on dark mode
  const sidebarClass = darkMode ? 'p-3 bg-secondary text-light' : 'p-3 bg-light';

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        className="btn btn-secondary d-lg-none w-100 mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-filter me-2"></i>
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      {/* Sidebar content: always visible on large screens, toggleable on mobile */}
      <div className={`${sidebarClass} ${isOpen ? 'd-block' : 'd-none d-lg-block'}`}>
        <h4 className="mb-4">
          <i className="fas fa-filter me-2"></i>
          Filters
        </h4>
        
        <div className="mb-4">
          <h5>
            <i className="fas fa-code me-2"></i>
            Platform
          </h5>
          <div className="btn-group-vertical" role="group" aria-label="Platform filters">
            {platformOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn ${filterPlatform === option.value ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilterPlatform(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h5>
            <i className="fas fa-calendar-alt me-2"></i>
            Status
          </h5>
          <div className="btn-group-vertical" role="group" aria-label="Status filters">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn ${filterStatus === option.value ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
