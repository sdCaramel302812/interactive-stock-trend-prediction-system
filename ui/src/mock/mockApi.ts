import { ChangeCoefficientRequest } from '../type/CoefficientData';
import mockCoefficientData from './mockCoefficientData';
import mockStockPredictionData from './mockStockPredictionData';

export const mockPostCoefficientChangeRequest = async (requestBody: ChangeCoefficientRequest) => {
  return {
    predictedPrice: Array(20).fill(0).map((x, index) => -index + 100)
  };
};

export const mockGetStockPredictionData = async () => {
  return mockStockPredictionData;
};

export const mockGetCoefficientData = async () => {
  return mockCoefficientData;
};