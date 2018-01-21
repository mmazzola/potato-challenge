import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  