import React, { useEffect, useState } from 'react';
import './style/App.css';
import StockPredictionChart from './component/StockPredictionChart';
import mockStockPredictionData from './mock/mockStockPredictionData';
import CoefficientChart from './component/CoefficientChart';
import mockCoefficientData from './mock/mockCoefficientData';
import { Chart } from 'chart.js';
import { ChangeCoefficientRequest, CoefficientData } from './type/CoefficientData';
import StockPredictionData from './type/StockPredictionData';
import SearchBar from './component/SearchBar';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

Chart.defaults.color = '#111';

const predictionApi = '/GetStockData';
const coefficientApi = '/GetCoefficient';
const coefficientChangeApi = '/Rerun';

async function get(api: string) {
  const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + api, {method: 'GET'});
  return await response.json();
}

function App() {
  const [stockPredictionData, setStockPredictionData] = useState(mockStockPredictionData);
  const [coefficientData, setCoefficientData] = useState<any>(null);

  const postCoefficientChangeRequest = async (requestBody: ChangeCoefficientRequest) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + coefficientChangeApi,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    return await response.json();
  };

  const getStockPredictionData = async () => {
    const toJson = await get(predictionApi);
    setStockPredictionData({
      trainingPrice: [...toJson.trainingPrice],
      trainingDate: [...toJson.trainingDate],
      predictedPrice: [...toJson.predictedPrice],
      realPrice: [...toJson.realPrice],
      predictedDate: [...toJson.predictedDate]
    });
  };

  const getCoefficientData = async () => {
    const toJson = await get(coefficientApi);
    setCoefficientData({
      name: [...toJson.name],
      value: [...toJson.value]
    });
  };

  useEffect(() => {
    getStockPredictionData();
    getCoefficientData();
  }, []);

  const updatePrediction = (newPrice: number[]) => {
    setStockPredictionData({
      trainingPrice: [...stockPredictionData!.trainingPrice],
      trainingDate: [...stockPredictionData!.trainingDate],
      predictedPrice: [...newPrice],
      realPrice: [...stockPredictionData!.realPrice],
      predictedDate: [...stockPredictionData!.predictedDate]
    });
  };

  return (
    <div className="App">
      <body 
        className="App-header"
      >
        <h2>
          Interactive Stock Price Prediction System
        </h2>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <SearchBar/>
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="refresh"
            onClick={() => {
              getStockPredictionData();
              getCoefficientData();
            }}
          ><RefreshIcon/></IconButton>
        </div>
        <StockPredictionChart {...stockPredictionData} />
        {coefficientData && <CoefficientChart
          coefficientData={coefficientData}
          onRerun={async (coefficientChanges: number[]) => {
            const newCoefficients = [...coefficientChanges];
            const response = await postCoefficientChangeRequest({coefficients: newCoefficients});
            updatePrediction(response.predictedPrice);
          }}
        />}
      </body>
    </div>
  );
}

export default App;
