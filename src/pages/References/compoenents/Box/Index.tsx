import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_BOXS_ENDPOINT } from "@/api/api";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
// import AUForm from "./components/AUForm";
import { Card, Drawer, FloatButton, Modal } from "antd";
import { PicCenterOutlined, SettingOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import AUForm from "./AUForm";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export"
import { useAuth } from "@/context/AuthContext";
interface Props {
}
export default ({  }: Props) => {
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
    endpoint: API_BOXS_ENDPOINT,
    name: "GET_BOXS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand:"parc"
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
    if(data?.data?.count > 0){
      count_str = `( ${data?.data?.count.toString()} )` 
    } 

    return count_str;
  }

  const { user } = useAuth();
  
  const card = {
    title: 'Boxs',
    icon: <SettingOutlined style={{ fontSize: '24px' }} />,
    description: 'Gérer les Boxs',
    color:user?.profile?.theme_color || '#3D9970',  }

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
        title="Boxs"
        destroyOnClose
        width={1200}  
        footer={false}
        open={open}
        closeIcon
        placement="left"
        onClose={() => {
          setOpen(false);
        }}
      >
       
        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
          collapsed={false}
        />
        
        <ColumnsSelect columns={selctedColumns} setSelectedColumns={setSelectedColumns}/>
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
          key="BOXS_TABLE"
          toolbar={{
            actions: [
              <Export button_text={`Exportez ${countStr()}`} columns={selctedColumns} endpoint={API_BOXS_ENDPOINT} search={search} filters={filters} expand="parc" />,
              <AUForm  initialvalues={null} refetch={refetch}/>,
            ],
          }}
        />

      </Drawer>
    </div>
  );
};
