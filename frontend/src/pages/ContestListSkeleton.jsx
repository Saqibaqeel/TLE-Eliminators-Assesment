import React from 'react';

const ContestListSkeleton = () => {
  return (
    <div className="container my-5">
    
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="placeholder col-3" style={{height: "2rem"}}></h1>
        </div>
      </div>

      
      <div className="row">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm placeholder-glow">
              <div className="card-body">
                <h5 className="card-title placeholder col-8"></h5>
                <p className="card-text placeholder col-10"></p>
                <p className="card-text placeholder col-6"></p>
                <span className="placeholder col-3"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestListSkeleton;