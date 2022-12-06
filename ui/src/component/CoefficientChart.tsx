import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import 'chartjs-plugin-dragdata';
import { CoefficientData } from '../type/CoefficientData';
import { Button } from '@mui/material';

interface CoefficientChartProps {
  coefficientData: CoefficientData;
  onRerun: (coefficientChanges: number[]) => void;
}

function CoefficientChart(props: CoefficientChartProps) {
  const ref = useRef();

  const getBackgroundColor = (coefficient: number[]): string[] => {
    return coefficient.map((value) => {
      if (value >= 0) {
        return 'rgba(75, 192, 75, 0.2)';
      }
      return 'rgba(255, 99, 132, 0.2)';
    });
  };

  const getBorderColor = (coefficient: number[]): string[] => {
    return coefficient.map((value) => {
      if (value >= 0) {
        return 'rgb(75, 192, 75)';
      }
      return 'rgb(255, 99, 132)';
    });
  };

  const [coefficientNames, setCoefficientNames] = useState<string[]>([...props.coefficientData.name]);
  const [coefficientValues, setCoefficientValues] = useState<number[]>([...props.coefficientData.value]);


  useEffect(() => {
    const names = [...props.coefficientData.name];
    const values = [...props.coefficientData.value];
    setCoefficientNames(names);
    setCoefficientValues(values);
  }, []);

  return (
    <div>
      <Bar 
        ref={ref} 
        data={{
          labels: props.coefficientData.name,
          datasets: [
            {
              label: 'drag to modify coefficient',
              data: props.coefficientData.value,
              backgroundColor: getBackgroundColor(props.coefficientData.value),
              borderColor: getBorderColor(props.coefficientData.value),
              borderWidth: 1
            },
          ],// @ts-ignore
          dragData: true
        }}
        // @ts-ignore
        options={{
          scale: {
            y: {
              max: 20,
              min: -20
            }
          },
          plugins: {// @ts-ignore
            dragData: {
              onDragStart: () => {},
              onDrag: () => {},
              onDragEnd: (e: any, datasetIndex: any, index: number, value: number) => {
                let newCoefficients = [...props.coefficientData.value];
                newCoefficients[index] = value;
                setCoefficientValues(newCoefficients);
              }
            }
          }
        }}
        style={{width: '1200px', height: '300px'}}
      />
      <Button
        style={{ marginTop: '10px' }}
        variant="contained"
        color="success"
        onClick={() => {
          props.onRerun(coefficientValues);
        }}
      >Rerun</Button>
    </div>
  );
}

export default CoefficientChart;