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
      width: 300,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      width: 150,
    },
    {
      title: 'Dangereux',
      dataIndex: 'dangereux',
      key: 'dangereux',
      width: 150,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      width: 150,
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      width: 150,
    },
    {
      title: 'Surface',
      dataIndex: 'surface',
      key: 'surface',
      width: 150,
    },
    {
      title: 'Quantite',
      dataIndex: 'quantite',
      key: 'quantite',
      width: 150,
    },
    {
      title: 'Poids',
      dataIndex: 'poids',
      key: 'poids',
      width: 150,
    },
    {
      title: 'Nombre de colis',
      dataIndex: 'nombre_colis',
      key: 'nombre_colis',
      width: 150,
    },
  ];

  return (
    <Table<SubArticle>
      columns={columns}
      dataSource={data.map((item, index) => ({ ...item, key: index }))}
      loading={loading}
      size="small"
      pagination={false}
      scroll={{ y: 240, x: "max-content" }}
    />
  );
};

export default PreviewSubArticles;
            