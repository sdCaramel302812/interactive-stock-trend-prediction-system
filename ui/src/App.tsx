import React, { useEffect, useState } from 'react';
import './style/App.css';
import StockPredictionChart from './component/StockPredictionChart';
import mockStockPredictionData from './mock/mockStockPredictionData';
import CoefficientChart from './component/CoefficientChart';
import mockCoefficientData from './mock/mockCoefficientData';
import { Chart } from 'chart.js';
import { ChangeCoefficientRequest, CoefficientData } from './type/CoefficientData';
import StockPredictionData from './type/StockPredictionData';

Chart.defaults.color = '#EEE';

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
      <header 
        className="App-header"
        style={{ paddingTop: '20px', paddingBottom: '20px' }}
      >
        <StockPredictionChart {...stockPredictionData} />
        {coefficientData && <CoefficientChart
          coefficientData={coefficientData}
          onRerun={async (coefficientChanges: number[]) => {
            const response = await postCoefficientChangeRequest({coefficients: coefficientChanges});
            updatePrediction(response.predictedPrice);
          }}
        />}
      </header>
    </div>
  );
}

export default App;
