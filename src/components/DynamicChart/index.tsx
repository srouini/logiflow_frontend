import React from 'react';
import {
  Line,
  Area,
  Column,
  Bar,
  Pie,
  DualAxes,
  Radar,
  Rose,
  Gauge,
  Liquid,
  Bullet,
  Scatter,
  Heatmap,
  Box,
  Stock,
  Funnel,
  Waterfall,
  Sunburst,
  WordCloud,
} from '@ant-design/charts';
import { Empty } from 'antd';

export type ChartType =
  | 'line'
  | 'area'
  | 'column'
  | 'bar'
  | 'pie'
  | 'dual-axes'
  | 'radar'
  | 'rose'
  | 'gauge'
  | 'liquid'
  | 'bullet'
  | 'scatter'
  | 'heatmap'
  | 'box'
  | 'stock'
  | 'funnel'
  | 'waterfall'
  | 'sunburst'
  | 'wordcloud';

interface DynamicChartProps {
  type: ChartType;
  data: any[];
  config?: any;
  height?: number;
  loading?: boolean;
}

const DynamicChart: React.FC<DynamicChartProps> = ({
  type,
  data,
  config = {},
  height = 400,
  loading = false,
}) => {
  if (!data || data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const commonProps = {
    data,
    loading,
    height,
    ...config,
  };

  const chartComponents = {
    line: Line,
    area: Area,
    column: Column,
    bar: Bar,
    pie: Pie,
    'dual-axes': DualAxes,
    radar: Radar,
    rose: Rose,
    gauge: Gauge,
    liquid: Liquid,
    bullet: Bullet,
    scatter: Scatter,
    heatmap: Heatmap,
    box: Box,
    stock: Stock,
    funnel: Funnel,
    waterfall: Waterfall,
    sunburst: Sunburst,
    wordcloud: WordCloud,
  };

  const ChartComponent = chartComponents[type];

  if (!ChartComponent) {
    return <Empty description={`Chart type "${type}" not supported`} />;
  }

  return <ChartComponent {...commonProps} />;
};

export default DynamicChart;

// Example usage:
/*
import DynamicChart from '@/components/DynamicChart';

// Line Chart
const lineConfig = {
  xField: 'year',
  yField: 'value',
  seriesField: 'category',
};

<DynamicChart 
  type="line"
  data={[
    { year: '2020', value: 100, category: 'A' },
    { year: '2021', value: 200, category: 'A' },
    { year: '2020', value: 150, category: 'B' },
    { year: '2021', value: 250, category: 'B' },
  ]}
  config={lineConfig}
/>

// Pie Chart
const pieConfig = {
  angleField: 'value',
  colorField: 'type',
};

<DynamicChart 
  type="pie"
  data={[
    { type: 'A', value: 27 },
    { type: 'B', value: 25 },
    { type: 'C', value: 18 },
  ]}
  config={pieConfig}
/>

// Bar Chart
const barConfig = {
  xField: 'value',
  yField: 'category',
};

<DynamicChart 
  type="bar"
  data={[
    { category: 'A', value: 100 },
    { category: 'B', value: 200 },
    { category: 'C', value: 300 },
  ]}
  config={barConfig}
/>

// Column Chart
const columnConfig = {
  xField: 'category',
  yField: 'value',
};

<DynamicChart 
  type="column"
  data={[
    { category: 'A', value: 100 },
    { category: 'B', value: 200 },
    { category: 'C', value: 300 },
  ]}
  config={columnConfig}
/>

// Area Chart
const areaConfig = {
  xField: 'date',
  yField: 'value',
  seriesField: 'category',
};

<DynamicChart 
  type="area"
  data={[
    { date: '2020-01', value: 100, category: 'A' },
    { date: '2020-02', value: 200, category: 'A' },
    { date: '2020-01', value: 150, category: 'B' },
    { date: '2020-02', value: 250, category: 'B' },
  ]}
  config={areaConfig}
/>

// Dual Axes Chart
const dualAxesConfig = {
  xField: 'date',
  yField: ['value1', 'value2'],
};

<DynamicChart 
  type="dual-axes"
  data={[
    { date: '2020-01', value1: 100, value2: 800 },
    { date: '2020-02', value1: 200, value2: 600 },
  ]}
  config={dualAxesConfig}
/>

// Gauge Chart
const gaugeConfig = {
  percent: 0.75,
  range: {
    color: ['l(0) 0:#B8E1FF 1:#3D76DD'],
  },
  startAngle: Math.PI,
  endAngle: 2 * Math.PI,
};

<DynamicChart 
  type="gauge"
  data={[{ value: 0.75 }]}
  config={gaugeConfig}
/>

// Radar Chart
const radarConfig = {
  xField: 'item',
  yField: 'score',
  seriesField: 'user',
  meta: {
    score: {
      alias: 'Score',
      min: 0,
      max: 80,
    },
  },
};

<DynamicChart 
  type="radar"
  data={[
    { item: 'Design', user: 'A', score: 70 },
    { item: 'Development', user: 'A', score: 60 },
    { item: 'Marketing', user: 'A', score: 50 },
    { item: 'Design', user: 'B', score: 60 },
    { item: 'Development', user: 'B', score: 70 },
    { item: 'Marketing', user: 'B', score: 40 },
  ]}
  config={radarConfig}
/>
*/
