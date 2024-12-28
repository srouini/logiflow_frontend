import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Article {
  numero: string;
  groupage: string;
  bl: string;
  designation: string;
  client: string;
}

interface Props {
  data: Article[];
  loading?: boolean;
}

const PreviewArticles: React.FC<Props> = ({ data, loading }) => {
  const columns: ColumnsType<Article> = [
    {
      title: 'Numéro',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Groupage',
      dataIndex: 'groupage',
      key: 'groupage',
      render: (record) => record === true ? <Tag color='green'>Groupage</Tag>: <Tag>Ordinaire</Tag>,
    },
    {
      title: 'BL',
      dataIndex: 'bl',
      key: 'bl',
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

  console.log(data);
  return (
    <Table<Article>
      columns={columns}
      dataSource={data.map((item, index) => ({ ...item, key: index }))}
      loading={loading}
      size="small"
      pagination={false}
      scroll={{ y: 240 }}
    />
  );
};

export default PreviewArticles;
