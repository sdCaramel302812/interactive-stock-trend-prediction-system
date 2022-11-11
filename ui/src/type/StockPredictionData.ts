interface StockPredictionData {
  trainingPrice: number[];
  trainingDate: string[];
  predictedPrice: number[];
  realPrice: number[];
  predictedDate: string[];
};

export default StockPredictionData;