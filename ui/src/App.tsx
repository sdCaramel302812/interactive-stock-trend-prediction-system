import React from 'react';
import logo from './logo.svg';
import './style/App.css';
import StockPredictionChart from './component/StockPredictionChart';
import mockStockPredictionData from './mock/mockStockPredictionData';
import CoefficientChart from './component/CoefficientChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <StockPredictionChart {...mockStockPredictionData} />
        <CoefficientChart/>
        <p>
          stock prediction chart
        </p>
      </header>
    </div>
  );
}

export default App;
