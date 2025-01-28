import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_CLIENTS_ENDPOINT } from "@/api/api";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
// import AUForm from "./components/AUForm";
import { Drawer, Modal, Button, Card } from "antd";
import { MergeOutlined, TeamOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import AUForm from "./AUForm";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export"
import usePost from "@/hooks/usePost";
import ManualMergeModal from "./ManualMergeModal"; // Assuming ManualMergeModal is defined in this file
import { useAuth } from "@/context/AuthContext";

interface Props {
  hanleClose:() => void;
}
export default ({ }: Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_CLIENTS_ENDPOINT,
    name: "GET_CLIENTS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
    },
  });


  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const [selctedColumns, setSelectedColumns] = useState<any>(columns)

  const countStr = () => {
    let count_str = ""
    if (data?.data?.count > 0) {
      count_str = `( ${data?.data?.count.toString()} )`
    }

    return count_str;
  }

  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [manualMergeVisible, setManualMergeVisible] = useState(false);

  const { mutate: mergeDuplicates, isLoading: mergeLoading } = usePost({
    endpoint: `${API_CLIENTS_ENDPOINT}merge_duplicates/`,
    onSuccess: (data: any) => {
      if (data.message === 'No duplicate clients found') {
        Modal.info({
          title: 'No Duplicates',
          content: 'No duplicate clients were found.',
        });
      } else {
        Modal.success({
          title: 'Success',
          content: 'Successfully merged duplicate clients.',
        });
        refetch();
      }
      setMergeModalVisible(false);
    },
  });

  const handleMergeDuplicates = () => {
    mergeDuplicates({});
  };

  const { user } = useAuth();


  const card = {
    title: 'Clients',
    icon: <TeamOutlined style={{ fontSize: '24px' }} />,
    description: 'Gérer les clients',
    color:user?.profile?.theme_color || '#3D9970',
  }

  return (
    <div>
      <Card
        hoverable
        style={{
          height: '100%',
          borderTop: `2px solid ${card.color}`,
          cursor: 'pointer',
        }}
        onClick={showModal}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ color: card.color }}>{card.icon}</div>
        </div>
        <Card.Meta
          title={<div style={{ textAlign: 'center' }}>{card.title}</div>}
          description={
            <div style={{ textAlign: 'center' }}>{card.description}</div>
          }
        />
      </Card>

      <Drawer
        title="Clients"
        destroyOnClose
        width="80%"
        footer={false}
        open={open}
        closeIcon
        onClose={() => {
          setOpen(false);
        }}
        placement="left"
      >

        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
          collapsed={false}
        />

        <ColumnsSelect columns={selctedColumns} setSelectedColumns={setSelectedColumns} />
        <CustomTable
          getColumns={getColumns(refetch)}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="CLIENTS_TABLE"
          toolbar={{
            actions: [
              <Export button_text={`Exportez ${countStr()}`} columns={selctedColumns} endpoint={API_CLIENTS_ENDPOINT} search={search} filters={filters} />,
              <AUForm initialvalues={null} refetch={refetch} />,
              <Button
                key="merge"
                type="primary"
                icon={<MergeOutlined />}
                onClick={() => setMergeModalVisible(true)}
              >
                Auto Merge
              </Button>,
              <Button
                key="manual-merge"
                type="primary"
                icon={<MergeOutlined />}
                onClick={() => setManualMergeVisible(true)}
              >
                Manual Merge
              </Button>,
            ],
          }}
        />

      </Drawer>
      <Modal
        title="Auto Merge Duplicate Clients"
        open={mergeModalVisible}
        onOk={handleMergeDuplicates}
        onCancel={() => setMergeModalVisible(false)}
        confirmLoading={mergeLoading}
      >
        <p>This will automatically merge duplicate clients based on similar names. The client with the most references will be kept, and others will be merged into it.</p>
        <p>Are you sure you want to continue?</p>
      </Modal>

      <ManualMergeModal
        visible={manualMergeVisible}
        onCancel={() => setManualMergeVisible(false)}
        refetch={refetch}
      />
    </div>
  );
};
