import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_ZONES_ENDPOINT } from "@/api/api";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
// import AUForm from "./components/AUForm";
import { FloatButton, Modal } from "antd";
import { BorderTopOutlined } from "@ant-design/icons";
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
    endpoint: API_ZONES_ENDPOINT,
    name: "GET_ZONES",
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

  return (
    <div>
      <FloatButton
        tooltip="Zone"
        icon={<BorderTopOutlined />}
        onClick={showModal}
        style={{marginBottom:"8px"}}
      />
      <Modal
        title="Zones"
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
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="Zone_TABLE"
          scrollY={350}
          toolbar={{
            actions: [
              <Export button_text={`Exportez ${countStr()}`} columns={selctedColumns} endpoint={API_ZONES_ENDPOINT} search={search} filters={filters} expand="parc" />,
              <AUForm  initialvalues={null} refetch={refetch}/>,
            ],
          }}
        />

      </Modal>
    </div>
  );
};
