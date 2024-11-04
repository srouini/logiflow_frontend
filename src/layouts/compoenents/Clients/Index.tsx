import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_CLIENTS_ENDPOINT } from "@/api/api";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
// import AUForm from "./components/AUForm";
import { FloatButton, Modal } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import AUForm from "./AUForm";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export"
interface Props {
  hanleClose: () => void;
}
export default ({ hanleClose }: Props) => {
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

  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    if (!isFetching) {
      setTableData(data);
    }
  }, [data, isFetching]);

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const [selctedColumns, setSelectedColumns] = useState<any>(columns)

  return (
    <div>
      <FloatButton
        tooltip="Client"
        icon={<UserAddOutlined />}
        onClick={showModal}
      />
      <Modal
        title="Clients"
        destroyOnClose
        width={1200}  
        footer={false}
        open={open}
        closeIcon
        onCancel={() => {
          setOpen(false);
          hanleClose();
        }}
      >
       
        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
        />
        
        <ColumnsSelect columns={selctedColumns} setSelectedColumns={setSelectedColumns}/>
        <CustomTable
          getColumns={getColumns(refetch)}
          data={tableData}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="CLIENTS_TABLE"
          scrollY={350}
          toolbar={{
            actions: [
              <Export columns={selctedColumns} endpoint={API_CLIENTS_ENDPOINT} search={search} filters={filters} />,
              <AUForm  initialvalues={null} refetch={refetch}/>,
            ],
          }}
        />

      </Modal>
    </div>
  );
};
