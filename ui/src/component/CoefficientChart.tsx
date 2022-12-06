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

  const getChartData = (coefficientNames: string[], coefficientValues: number[]) => {
    return {
      labels: coefficientNames,
      datasets: [
        {
          label: 'drag to modify coefficient',
          data: coefficientValues,
          backgroundColor: getBackgroundColor(coefficientValues),
          borderColor: getBorderColor(coefficientValues),
          borderWidth: 1
        },
      ],
      dragData: true
    };
  };

  const getChartOption = () => {
    return {
      scale: {
        y: {
          max: 20,
          min: -20
        }
      },
      plugins: {
        dragData: {
          onDragStart: () => {},
          onDrag: () => {},
          onDragEnd: (e: any, datasetIndex: any, index: number, value: number) => {
            setCoefficientValues(coefficientValues.map((oldValue, oldIndex) => {
              if (oldIndex === index) {
                return value;
              }
              return oldValue;
            }));
            setChartData(getChartData(coefficientNames, coefficientValues));
          }
        }
      }
    };
  };

  const [coefficientNames, setCoefficientNames] = useState<string[]>([...props.coefficientData.name]);
  const [coefficientValues, setCoefficientValues] = useState<number[]>([...props.coefficientData.value]);
  const [chartData, setChartData] = useState<any>(getChartData(coefficientNames, coefficientValues));
  const [chartOption, setChartOption] = useState<any>(getChartOption());

  useEffect(() => {
    setCoefficientNames([...props.coefficientData.name]);
    setCoefficientValues([...props.coefficientData.value]);
    setChartData(getChartData(coefficientNames, coefficientValues));
    
    setChartOption(getChartOption());
  }, [props]);

  return (
    <div>
      <Bar 
        ref={ref} 
        data={chartData}
        // @ts-ignore
        options={chartOption}
        style={{width: '1200px', height: '300px'}}
      />
      <Button
        style={{ marginTop: '10px' }}
        variant="contained"
        color="success"
        onClick={() => { 
          console.log(coefficientValues);
          props.onRerun(coefficientValues); }}
      >Rerun</Button>
    </div>
  );
}

export default CoefficientChart;