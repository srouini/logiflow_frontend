import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, Space, Switch, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { AgentDouane } from '@/types/reference';
import { API_AGENT_DOUANE_ENDPOINT } from '@/constants/reference';
import useList from '@/hooks/useList';
import usePost from '@/hooks/usePost';
import usePut from '@/hooks/usePut';
import useDelete from '@/hooks/useDelete';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

export default () => {
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<AgentDouane | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: agents, loading, refetch } = useList<AgentDouane>(API_AGENT_DOUANE_ENDPOINT);
  const { mutateAsync: create } = usePost<AgentDouane>(API_AGENT_DOUANE_ENDPOINT);
  const { mutateAsync: update } = usePut<AgentDouane>(API_AGENT_DOUANE_ENDPOINT);
  const { mutateAsync: remove } = useDelete(API_AGENT_DOUANE_ENDPOINT);

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue(editingRecord);
    } else {
      form.resetFields();
    }
  }, [editingRecord, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await update({ ...editingRecord, ...values });
        message.success('Agent douane mis à jour avec succès');
      } else {
        await create(values);
        message.success('Agent douane créé avec succès');
      }
      setIsModalVisible(false);
      refetch();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (record: AgentDouane) => {
    try {
      await remove(record.id);
      message.success('Agent douane supprimé avec succès');
      refetch();
    } catch (error) {
      console.error('Error deleting record:', error);
      message.error('Une erreur est survenue lors de la suppression');
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      sorter: (a: AgentDouane, b: AgentDouane) => a.nom.localeCompare(b.nom),
    },
    {
      title: 'Prénom',
      dataIndex: 'prenom',
      key: 'prenom',
      sorter: (a: AgentDouane, b: AgentDouane) => a.prenom.localeCompare(b.prenom),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Actif',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => <Switch checked={active} disabled />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AgentDouane) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRecord(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingRecord(null);
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Ajouter
      </Button>

      <Table
        columns={columns}
        dataSource={agents}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingRecord ? 'Modifier Agent Douane' : 'Ajouter Agent Douane'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nom"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="prenom"
            label="Prénom"
            rules={[{ required: true, message: 'Le prénom est requis' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Le code est requis' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="active"
            label="Actif"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
