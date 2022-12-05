import StockPredictionData from '../type/StockPredictionData';
import { convertToTimeSeriesData } from '../utils/convertStockPriceData';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useRef } from 'react';

function StockPredictionChart(priceData: StockPredictionData) {
  const ref = useRef();
  const chartData = {
    labels: priceData.trainingDate.concat(priceData.predictedDate),
    datasets: [
      {
        label: 'training data',
        data: convertToTimeSeriesData(priceData.trainingPrice, priceData.trainingDate),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        pointRadius: 1,
      },
      {
        label: 'predicted price',
        data: convertToTimeSeriesData(priceData.predictedPrice, priceData.predictedDate),
        fill: false,
        borderColor: 'rgba(192,192,75,1)',
        pointRadius: 1,
      },
      {
        label: 'actual price',
        data: convertToTimeSeriesData(priceData.realPrice, priceData.predictedDate),
        fill: false,
        borderColor: 'rgba(192,75,75,1)',
        pointRadius: 1,
      },
    ],
  };

  return (
    <div>
      <Line 
        ref={ref} 
        data={chartData}
        style={{width: '800px', height: '300px'}}
      />
    </div>
  );
}

export default StockPredictionChart;