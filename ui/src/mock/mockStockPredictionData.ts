import { timeFormatting } from '../utils/convertStockPriceData';

const beginDate = new Date(2010, 1);

const mockStockPredictionData = {
  trainingPrice: Array(100).fill(0).map((x, index) => index),
  trainingDate: Array(100).fill('').map((x, index) => {
    const date = new Date().setDate(beginDate.getDate() + index);
    return timeFormatting(new Date(date));
  }),
  predictedPrice: Array(20).fill(0).map((x, index) => index + 100),
  realPrice: Array(20).fill(0).map((x, index) => 2 * index + 100),
  predictedDate: Array(20).fill('').map((x, index) => {
    const date = new Date().setDate(beginDate.getDate() + index + 100);
    return timeFormatting(new Date(date));
  }),
};

export default mockStockPredictionData;