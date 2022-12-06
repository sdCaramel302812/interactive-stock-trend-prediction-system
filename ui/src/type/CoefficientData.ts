export interface CoefficientData {
  name: string[],
  value: number[]
};

export interface ChangeCoefficientRequest {
  coefficients: number[]
};

export interface ChangeCoefficientResponse {
  predictedPrice: number[]
};