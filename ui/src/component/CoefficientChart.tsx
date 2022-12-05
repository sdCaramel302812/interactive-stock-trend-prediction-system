import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useRef, useState } from 'react';
import 'chartjs-plugin-dragdata';
import { CoefficientData } from '../type/CoefficientData';


function CoefficientChart(coefficientData: CoefficientData) {
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

  const [coefficientNames, setCoefficientNames] = useState<string[]>([...coefficientData.name]);
  const [coefficientValues, setCoefficientValues] = useState<number[]>([...coefficientData.value]);
  const [chartData, setChartData] = useState<any>(getChartData(coefficientNames, coefficientValues));

  const options = {
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
        onDragEnd: () => {
          setChartData(getChartData(coefficientNames, coefficientValues));
        }
      }
    }
  };

  return (
    <div>
      <Bar 
        ref={ref} 
        data={chartData}
        // @ts-ignore
        options={options}
        style={{width: '800px', height: '300px'}}
      />
    </div>
  );
}

export default CoefficientChart;