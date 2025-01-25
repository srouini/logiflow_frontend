import React, { useState } from 'react';
import { Modal, Form, Select, Alert } from 'antd';
import useData from "@/hooks/useData";
import { API_CLIENTS_ENDPOINT } from "@/api/api";
import usePost from "@/hooks/usePost";
import { Client } from '@/types/reference';

interface ManualMergeModalProps {
  visible: boolean;
  onCancel: () => void;
  refetch: () => void;
}

const ManualMergeModal: React.FC<ManualMergeModalProps> = ({
  visible,
  onCancel,
  refetch,
}) => {
  const [form] = Form.useForm();
  const [targetClient, setTargetClient] = useState<number | null>(null);
  const [clientsToMerge, setClientsToMerge] = useState<number[]>([]);

  const { data: clientsData, isLoading } = useData({
    endpoint: API_CLIENTS_ENDPOINT,
    name: "GET_CLIENTS_FOR_MERGE",
    params: {
      all: true, // Get all clients for merging
    },
  });

  const { mutate: mergeClients, isLoading: isMerging } = usePost({
    endpoint: `${API_CLIENTS_ENDPOINT}manual_merge/`,
    onSuccess: () => {
      refetch();
      onCancel();
      form.resetFields();
      setTargetClient(null);
      setClientsToMerge([]);
    },
  });

  const handleMerge = () => {
    if (!targetClient || clientsToMerge.length === 0) {
      return;
    }

    mergeClients({
      target_client: targetClient,
      clients_to_merge: clientsToMerge,
    });
  };

  const clients = clientsData?.data || [];

  console.log(clientsData);
  const clientOptions = clients.map((client: Client) => ({
    label: `${client.raison_sociale} (${client.code || 'No Code'})`,
    value: client.id,
  }));

  return (
    <Modal
      title="Manual Merge Clients"
      open={visible}
      onOk={handleMerge}
      onCancel={onCancel}
      confirmLoading={isMerging}
      okButtonProps={{ disabled: !targetClient || clientsToMerge.length === 0 }}
    >
      <Alert
        message="Warning"
        description="When merging clients, all data from the selected clients will be transferred to the target client. This action cannot be undone."
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Form form={form} layout="vertical">
        <Form.Item
          label="Target Client"
          required
          help="All data will be merged into this client"
        >
         
          <Select
            showSearch
            placeholder="Select target client"
            options={clientOptions}
            loading={isLoading}
            onChange={(value) => setTargetClient(value)}
            filterOption={(input, option) =>
               //@ts-ignore
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          label="Clients to Merge"
          required
          help="Select clients that will be merged into the target client"
        >
          <Select
            mode="multiple"
            showSearch
            placeholder="Select clients to merge"
            options={clientOptions.filter(
              (option:any) => option.value !== targetClient
            )}
            loading={isLoading}
            onChange={(values) => setClientsToMerge(values)}
            filterOption={(input, option) =>
               //@ts-ignore
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManualMergeModal;
