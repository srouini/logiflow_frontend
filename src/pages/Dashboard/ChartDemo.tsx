import React from 'react';
import { Card, Col, Row, Select } from 'antd';
import DynamicChart, { ChartType } from '@/components/DynamicChart';

const { Option } = Select;

const ChartDemo: React.FC = () => {
  const [selectedChart, setSelectedChart] = React.useState<ChartType>('line');

  // Sample data for different chart types
  const chartData = {
    line: {
      data: [
        { year: '2020', value: 100, category: 'A' },
        { year: '2021', value: 200, category: 'A' },
        { year: '2020', value: 150, category: 'B' },
        { year: '2021', value: 250, category: 'B' },
      ],
      config: {
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
      },
    },
    column: {
      data: [
        { category: 'A', value: 100 },
        { category: 'B', value: 200 },
        { category: 'C', value: 300 },
      ],
      config: {
        xField: 'category',
        yField: 'value',
      },
    },
    bar: {
      data: [
        { category: 'A', value: 100 },
        { category: 'B', value: 200 },
        { category: 'C', value: 300 },
      ],
      config: {
        xField: 'value',
        yField: 'category',
      },
    },
    pie: {
      data: [
        { type: 'A', value: 27 },
        { type: 'B', value: 25 },
        { type: 'C', value: 18 },
      ],
      config: {
        angleField: 'value',
        colorField: 'type',
      },
    },
    area: {
      data: [
        { date: '2020-01', value: 100, category: 'A' },
        { date: '2020-02', value: 200, category: 'A' },
        { date: '2020-01', value: 150, category: 'B' },
        { date: '2020-02', value: 250, category: 'B' },
      ],
      config: {
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
      },
    },
    'dual-axes': {
      data: [
        { date: '2020-01', value1: 100, value2: 800 },
        { date: '2020-02', value1: 200, value2: 600 },
      ],
      config: {
        xField: 'date',
        yField: ['value1', 'value2'],
      },
    },
    gauge: {
      data: [{ value: 0.75 }],
      config: {
        percent: 0.75,
        range: {
          color: ['l(0) 0:#B8E1FF 1:#3D76DD'],
        },
        startAngle: Math.PI,
        endAngle: 2 * Math.PI,
      },
    },
    radar: {
      data: [
        { item: 'Design', user: 'A', score: 70 },
        { item: 'Development', user: 'A', score: 60 },
        { item: 'Marketing', user: 'A', score: 50 },
        { item: 'Design', user: 'B', score: 60 },
        { item: 'Development', user: 'B', score: 70 },
        { item: 'Marketing', user: 'B', score: 40 },
      ],
      config: {
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
      },
    },
    rose: {
      data: [
        { type: 'A', value: 27, category: '1' },
        { type: 'B', value: 25, category: '1' },
        { type: 'C', value: 18, category: '1' },
        { type: 'A', value: 15, category: '2' },
        { type: 'B', value: 20, category: '2' },
        { type: 'C', value: 22, category: '2' },
      ],
      config: {
        xField: 'type',
        yField: 'value',
        seriesField: 'category',
        radius: 0.9,
      },
    },
    liquid: {
      data: [0.65],
      config: {
        percent: 0.65,
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
      },
    },
    bullet: {
      data: [
        {
          title: 'Progress',
          ranges: [100],
          measures: [80],
          target: 85,
        },
      ],
      config: {
        measureField: 'measures',
        rangeField: 'ranges',
        targetField: 'target',
        xField: 'title',
      },
    },
    scatter: {
      data: [
        { x: 1, y: 4.181 },
        { x: 2, y: 4.665 },
        { x: 3, y: 5.296 },
        { x: 4, y: 5.365 },
        { x: 5, y: 5.448 },
      ],
      config: {
        xField: 'x',
        yField: 'y',
        size: 5,
        pointStyle: {
          fill: '#5B8FF9',
        },
      },
    },
    heatmap: {
      data: [
        { x: 'A', y: '1', value: 10 },
        { x: 'B', y: '1', value: 20 },
        { x: 'C', y: '1', value: 30 },
        { x: 'A', y: '2', value: 40 },
        { x: 'B', y: '2', value: 50 },
        { x: 'C', y: '2', value: 60 },
      ],
      config: {
        xField: 'x',
        yField: 'y',
        colorField: 'value',
        color: ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#c52a1a'],
      },
    },
    box: {
      data: [
        { x: 'A', low: 20, q1: 30, median: 35, q3: 40, high: 50 },
        { x: 'B', low: 25, q1: 35, median: 40, q3: 45, high: 55 },
        { x: 'C', low: 30, q1: 40, median: 45, q3: 50, high: 60 },
      ],
      config: {
        xField: 'x',
        yField: ['low', 'q1', 'median', 'q3', 'high'],
      },
    },
    funnel: {
      data: [
        { stage: 'Visits', value: 5000 },
        { stage: 'Cart', value: 4000 },
        { stage: 'Checkout', value: 3000 },
        { stage: 'Purchase', value: 2000 },
      ],
      config: {
        xField: 'stage',
        yField: 'value',
        dynamicHeight: true,
      },
    },
    waterfall: {
      data: [
        { type: 'Initial', value: 100 },
        { type: 'A', value: 20 },
        { type: 'B', value: -30 },
        { type: 'C', value: 40 },
      ],
      config: {
        xField: 'type',
        yField: 'value',
      },
    },
    sunburst: {
      data: {
        name: 'root',
        children: [
          {
            name: 'A',
            value: 10,
            children: [
              { name: 'A1', value: 4 },
              { name: 'A2', value: 6 },
            ],
          },
          {
            name: 'B',
            value: 15,
            children: [
              { name: 'B1', value: 7 },
              { name: 'B2', value: 8 },
            ],
          },
        ],
      },
      config: {
        innerRadius: 0.3,
        interactions: [{ type: 'element-active' }],
      },
    },
    wordcloud: {
      data: [
        { name: 'React', value: 100 },
        { name: 'TypeScript', value: 80 },
        { name: 'Ant Design', value: 70 },
        { name: 'Charts', value: 60 },
        { name: 'Data', value: 50 },
        { name: 'Visualization', value: 40 },
      ],
      config: {
        wordField: 'name',
        weightField: 'value',
        colorField: 'name',
        wordStyle: {
          fontFamily: 'Verdana',
          fontSize: [12, 32],
          rotation: 0,
        },
      },
    },
  };

  const chartTypes: ChartType[] = [
    'line',
    'column',
    'bar',
    'pie',
    'area',
    'dual-axes',
    'gauge',
    'radar',
    'rose',
    'liquid',
    'bullet',
    'scatter',
    'heatmap',
    'box',
    'funnel',
    'waterfall',
    'sunburst',
    'wordcloud',
  ];

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Select
            style={{ width: 200 }}
            value={selectedChart}
            onChange={setSelectedChart}
          >
            {chartTypes.map((type) => (
              <Option key={type} value={type}>
                {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Chart
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={24}>
          <DynamicChart
            type={selectedChart}
            data={chartData[selectedChart].data}
            config={chartData[selectedChart].config}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ChartDemo;
