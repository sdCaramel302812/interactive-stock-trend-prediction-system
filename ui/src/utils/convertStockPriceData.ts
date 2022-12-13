import TimeSeriesData from '../type/TimeSeriesData';

export function timeFormatting(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return year.toString().concat('-').concat((month + 1).toString()).concat('-').concat((day + 1).toString());
}

export function convertToTimeSeriesData(prices: number[], dates: string[]): TimeSeriesData[] {
  if (prices.length !== dates.length) {
    return [];
  }
  const formattedDates = dates.map((value) => timeFormatting(new Date(value)));
  const timeSeriesData = [];
  for (let i of Array(prices.length).fill(0).map((x, index) => index)) {
    timeSeriesData.push({
      x: formattedDates[i],
      y: prices[i]
    });
  }
  return timeSeriesData;
}