import React, { useEffect, useState } from 'react';
import './style/App.css';
import StockPredictionChart from './component/StockPredictionChart';
import mockStockPredictionData from './mock/mockStockPredictionData';
import CoefficientChart from './component/CoefficientChart';
import mockCoefficientData from './mock/mockCoefficientData';
import { Chart } from 'chart.js';
import { ChangeCoefficientRequest } from './type/CoefficientData';
import { mockPostCoefficientChangeRequest, mockGetCoefficientData, mockGetStockPredictionData } from './mock/mockApi';

Chart.defaults.color = '#EEE';

const predictionApi = '/prediction';
const coefficientApi = '/coefficient';
const coefficientChangeApi = '/coefficient-change';

async function get(api: string) {
  const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + api, {method: 'GET'});
  return await response.json();
}

function App() {
  const [stockPredictionData, setStockPredictionData] = useState(mockStockPredictionData);
  const [coefficientData, setCoefficientData] = useState(mockCoefficientData);

  const postCoefficientChangeRequest = async (requestBody: ChangeCoefficientRequest) => {
    const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + coefficientChangeApi,
      {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
    return await response.json();
  };

  const getStockPredictionData = async () => {
    const toJson = await get(predictionApi);
    setStockPredictionData({
      trainingPrice: [...toJson.trainingPrice],
      trainingDate: [...toJson.trainingDate],
      predictedPrice: [...toJson.predictionPrice],
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
    mockGetStockPredictionData();
    mockGetCoefficientData();
  }, []);

  const updatePrediction = (newPrice: number[]) => {
    setStockPredictionData({
      trainingPrice: [...stockPredictionData.trainingPrice],
      trainingDate: [...stockPredictionData.trainingDate],
      predictedPrice: [...newPrice],
      realPrice: [...stockPredictionData.realPrice],
      predictedDate: [...stockPredictionData.predictedDate]
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <StockPredictionChart {...stockPredictionData} />
        <CoefficientChart 
          coefficientData={coefficientData}
          onRerun={async (coefficientChanges: number[]) => {
            const response = await mockPostCoefficientChangeRequest({coefficients: coefficientChanges});
            updatePrediction(response.predictedPrice);
          }}
        />
      </header>
    </div>
  );
}

export default App;
