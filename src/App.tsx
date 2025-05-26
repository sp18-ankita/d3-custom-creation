import { useState } from 'react';
import './App.css';
import { ChartRenderer } from './components/ChartRenderer';
import type { ChartType, DataPoint } from './enums/ChartType';

function App() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dataInput, setDataInput] = useState(
    JSON.stringify(
      [
        { label: 'A', value: 30 },
        { label: 'B', value: 70 },
      ],
      null,
      2,
    ),
  );

  const [chartData, setChartData] = useState<DataPoint[]>([]);

  const handleRender = () => {
    try {
      const parsed = JSON.parse(dataInput);
      if (Array.isArray(parsed)) {
        setChartData(parsed);
      } else {
        alert('Data must be an array of objects with label and value');
      }
    } catch {
      alert('Invalid JSON');
    }
  };

  return (
    <div className="app-container">
      <h1>D3 Chart Viewer</h1>

      <div>
        <label>
          Chart Type:&nbsp;
          <select value={chartType} onChange={e => setChartType(e.target.value as ChartType)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="speedometer">Speedometer</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Data (JSON):
          <textarea
            rows={6}
            cols={50}
            value={dataInput}
            onChange={e => setDataInput(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleRender} style={{ marginTop: 10 }}>
        Render Chart
      </button>

      <ChartRenderer type={chartType} data={chartData} />
    </div>
  );
}

export default App;
