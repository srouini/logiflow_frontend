import { Button, Modal, Table, Card, List } from 'antd';
import { useState, useMemo } from 'react';
import useData from '@/hooks/useData';
import { API_CONTENEURS_ENDPOINT } from '@/api/api';

interface TcDetailsButtonProps {
  bulletinId: string | undefined;
}

interface ProcessedData {
  uniqueGros: string[];
  uniqueArticles: string[];
  uniqueScelles: string[];
}

const TcDetailsButton: React.FC<TcDetailsButtonProps> = ({ bulletinId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: tcData, isLoading, refetch } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: `GET_TC_DETAILS_${bulletinId}`,
    params: {
      expand: 'article,article.gros,current_scelle,type_tc,parc',
      bulletins__id: bulletinId
    }
  });

  const processedData = useMemo(() => {
    if (!tcData?.data?.results) return { uniqueGros: [], uniqueArticles: [], uniqueScelles: [] };

    const data: ProcessedData = {
      uniqueGros: [],
      uniqueArticles: [],
      uniqueScelles: []
    };

    tcData.data.results.forEach((item: any) => {
      // Extract Gros
      if (item.article?.gros?.gros && !data.uniqueGros.includes(item.article.gros.gros)) {
        data.uniqueGros.push(item.article.gros.gros);
      }

      // Extract Articles
      if (item.article?.numero && !data.uniqueArticles.includes(item.article.numero)) {
        data.uniqueArticles.push(item.article.numero);
      }

      // Extract Scelles
      if (item.current_scelle?.numero && !data.uniqueScelles.includes(item.current_scelle.numero)) {
        data.uniqueScelles.push(item.current_scelle.numero);
      }
    });

    return data;
  }, [tcData]);

  const columns = [
    {
      title: 'Article',
      dataIndex: ['article', 'numero'],
      key: 'article',
    },
    {
      title: 'Gros',
      dataIndex: ['article', 'gros', 'gros'],
      key: 'gros',
    },
    {
      title: 'Scellé',
      dataIndex: ['current_scelle', 'numero'],
      key: 'scelle',
    },
    {
      title: 'Type TC',
      dataIndex: ['type_tc', 'designation'],
      key: 'type_tc',
    },
    {
      title: 'Parc',
      dataIndex: ['parc', 'designation'],
      key: 'parc',
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
    refetch();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Voir détails TC
      </Button>
      <Modal
        title="Détails TC"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <div style={{ marginBottom: 20 }}>
          <Card title="Résumé">
            <div style={{ display: 'flex', gap: '20px' }}>
              <Card size="small" title="Gros" style={{ flex: 1 }}>
                <List
                  size="small"
                  dataSource={processedData.uniqueGros}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
              <Card size="small" title="Articles" style={{ flex: 1 }}>
                <List
                  size="small"
                  dataSource={processedData.uniqueArticles}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
              <Card size="small" title="Scellés" style={{ flex: 1 }}>
                <List
                  size="small"
                  dataSource={processedData.uniqueScelles}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
            </div>
          </Card>
        </div>
        <Table
          dataSource={tcData?.data.results}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default TcDetailsButton;
