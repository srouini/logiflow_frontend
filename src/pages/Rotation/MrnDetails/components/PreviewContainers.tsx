import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { StatisticCard } from '@ant-design/pro-components';
import { processBooleanValue } from '@/utils/functions';

interface Container {
  tc: string;
  article: string;
  type_tc: string;
  dangereux: boolean;
  frigo: boolean;
}

interface Props {
  data: Container[];
  loading?: boolean;
  summary?: {
    total: number;
    new: number;
    skipped: number;
    invalid: number;
  };
}

const PreviewContainers: React.FC<Props> = ({ data, loading, summary }) => {
  const columns: ColumnsType<Container> = [
    {
      title: 'TC',
      dataIndex: 'tc',
      key: 'tc',
      width: 100,
    },
    {
      title: 'Article',
      dataIndex: 'article',
      key: 'article',
      width: 100,
    },
    {
      title: 'Type TC',
      dataIndex: 'type_tc',
      key: 'type_tc',
      width: 150,
    },
    {
      title: 'Nature',
      key: 'status',
      width: 200,
      render: (_, record) => (
        <>
          {processBooleanValue(record.dangereux) && <Tag color="red">DGX</Tag>}
          {processBooleanValue(record.frigo) && <Tag color="blue">Frigo</Tag>}
        </>
      ),
    },
  ];

  return (
    <>
      <div>
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: 'Total Containers',
              value: summary?.total || 0,
              status: 'processing',
            }}
          />
          <StatisticCard
            statistic={{
              title: 'New Containers',
              value: summary?.new || 0,
              status: 'success',
            }}
          />
          <StatisticCard
            statistic={{
              title: 'Existing Containers (will be skipped)',
              value: summary?.skipped || 0,
              status: 'warning',
            }}
          />
          {summary?.invalid > 0 && (
            <StatisticCard
              statistic={{
                title: 'Invalid (No Article)',
                value: summary?.invalid,
                status: 'error',
              }}
            />
          )}
        </StatisticCard.Group>
      </div>
      <Table<Container>
        columns={columns}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ y: 240, x: "max-content" }}
      />
    </>
  );
};

export default PreviewContainers;
