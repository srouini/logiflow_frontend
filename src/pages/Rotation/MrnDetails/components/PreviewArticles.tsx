import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { StatisticCard } from '@ant-design/pro-components';

interface Article {
  numero: string;
  groupage: boolean;
  bl: string;
  designation: string;
  client: string;
}

interface Props {
  data: Article[];
  loading?: boolean;
  summary?: {
    total: number;
    new: number;
    skipped: number;
  };
}

const PreviewArticles: React.FC<Props> = ({ data, loading, summary }) => {
  const columns: ColumnsType<Article> = [
    {
      title: 'Numéro',
      dataIndex: 'numero',
      key: 'numero',
      width:100
    },
    {
      title: 'Groupage',
      dataIndex: 'groupage',
      key: 'groupage',
      render: (record) => record === true ? <Tag color='green'>Groupage</Tag>: <Tag>Ordinaire</Tag>,
      width:150
    },
    {
      title: 'BL',
      dataIndex: 'bl',
      key: 'bl',
      width:150
    },
    {
      title: 'Désignation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
  ];

  return (
    <>
    <div>
      <StatisticCard.Group>
        <StatisticCard
          statistic={{
            title: 'Total Articles',
            value: summary?.total || 0,
            status: 'processing',
          }}
        />
        <StatisticCard
          statistic={{
            title: 'New Articles',
            value: summary?.new || 0,
            status: 'success',
          }}
        />
        <StatisticCard
          statistic={{
            title: 'Existing Articles (will be skipped)',
            value: summary?.skipped || 0,
            status: 'warning',
          }}
        />
      </StatisticCard.Group>
    </div>
    <Table<Article>
      columns={columns}
      dataSource={data.map((item, index) => ({ ...item, key: index }))}
      loading={loading}
      size="small"
      pagination={false}
      scroll={{ y: 240, x:"max-content" }}
    />
    </>
  );
};

export default PreviewArticles;
