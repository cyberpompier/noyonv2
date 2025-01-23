import React from 'react';

    function HomePage({ onGoClick }) {
      return (
        <div className="home-page">
          <header className="app-header">
            <h1>Ma remise APP</h1>
            <button onClick={onGoClick}>GO!</button>
          </header>
        </div>
      );
    }

    export default HomePage;
