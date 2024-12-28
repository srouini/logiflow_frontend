import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface SubArticle {
  numero: string;
  tc: string;
  bl: string;
  volume: string | number;
  dangereux: string | boolean;
  nombre_colis: string | number;
  description: string;
  surface: string | number;
  quantite: string | number;
  poids: string | number;
  client: string;
}

interface Props {
  data: SubArticle[];
  loading?: boolean;
}

const PreviewSubArticles: React.FC<Props> = ({ data, loading }) => {
  const columns: ColumnsType<SubArticle> = [
    {
      title: 'Numéro',
      dataIndex: 'numero',
      key: 'numero',
      width: 100,
    },
    {
      title: 'TC',
      dataIndex: 'tc',
      key: 'tc',
      width: 100,
    },
    {
      title: 'BL',
      dataIndex: 'bl',
      key: 'bl',
      width: 100,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      width: 150,
    },
    {
      title: 'Détails',
      key: 'details',
      width: 300,
      render: (_, record) => (
        <>
          <div>Volume: {record.volume}</div>
          <div>Surface: {record.surface}</div>
          <div>Quantité: {record.quantite}</div>
          <div>Poids: {record.poids}</div>
          <div>Nombre colis: {record.nombre_colis}</div>
          {record.dangereux && <Tag color="red">Dangereux</Tag>}
        </>
      ),
    },
  ];

  return (
    <Table<SubArticle>
      columns={columns}
      dataSource={data.map((item, index) => ({ ...item, key: index }))}
      loading={loading}
      size="small"
      pagination={false}
      scroll={{ y: 240, x: 1000 }}
    />
  );
};

export default PreviewSubArticles;
