import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Container {
  tc: string;
  tar: string | number;
  poids: string | number;
  article: string;
  type_tc: string;
  dangereux: boolean;
  frigo: boolean;
}

interface Props {
  data: Container[];
  loading?: boolean;
}

const PreviewContainers: React.FC<Props> = ({ data, loading }) => {
  const columns: ColumnsType<Container> = [
    {
      title: 'TC',
      dataIndex: 'tc',
      key: 'tc',
    },
    {
      title: 'TAR',
      dataIndex: 'tar',
      key: 'tar',
    },
    {
      title: 'Poids',
      dataIndex: 'poids',
      key: 'poids',
    },
    {
      title: 'Article',
      dataIndex: 'article',
      key: 'article',
    },
    {
      title: 'Type TC',
      dataIndex: 'type_tc',
      key: 'type_tc',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <>
          {record.dangereux && <Tag color="red">Dangereux</Tag>}
          {record.frigo && <Tag color="blue">Frigo</Tag>}
        </>
      ),
    },
  ];

  return (
    <Table<Container>
      columns={columns}
      dataSource={data.map((item, index) => ({ ...item, key: index }))}
      loading={loading}
      size="small"
      pagination={false}
      scroll={{ y: 240 }}
    />
  );
};

export default PreviewContainers;
