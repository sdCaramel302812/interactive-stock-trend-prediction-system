import { time } from 'console';
import TimeSeriesData from '../type/TimeSeriesData';

export function convertToTimeSeriesData(price: number[], date: string[]): TimeSeriesData[] {
  if (price.length !== date.length) {
    return [];
  }
  const timeSeriesData = [];
  for (let i of Array(price.length).fill(0).map((x, index) => index)) {
    timeSeriesData.push({
      x: date[i],
      y: price[i]
    });
  }
  return timeSeriesData;
}