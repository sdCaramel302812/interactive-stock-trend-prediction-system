import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useRef } from 'react';
import 'chartjs-plugin-dragdata';


function CoefficientChart() {
  const ref = useRef();
  const chartData = {
    labels: ['coefficient1', 'coefficient2', 'coefficient3'],
    datasets: [
      {
        label: 'coefficient',
        data: [0.1, 0.2, 0.3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      },
    ],
    dragData: true
  };

  const options = {
    scale: {
      y: {
        max: 1,
        min: 0
      }
    },
    plugins: {
      dragData: {
        onDragStart: () => {},
        onDrag: () => {},
        onDragEnd: () => {}
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
        style={{width: '600px', height: '300px'}}
      />
    </div>
  );
}

export default CoefficientChart;