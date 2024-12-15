import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_TRANSITAIRE_ENDPOINT } from "@/api/api";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
// import AUForm from "./components/AUForm";
import { Drawer, FloatButton, Modal } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
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
    endpoint: API_TRANSITAIRE_ENDPOINT,
    name: "GET_TRANSITAIRE",
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
  console.log()

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
        tooltip="Transitaire"
        icon={<UserSwitchOutlined />}
        onClick={showModal}
        style={{marginBottom:"8px"}}
      />
      <Drawer
        title="Transitaires"
        destroyOnClose
        width={1200}  
        footer={false}
        open={open}
        closeIcon
        placement="left"
        onClose={() => {
          setOpen(false);
          hanleClose();
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
          key="TRASNITAIRE_TABLE"
          toolbar={{
            actions: [
              <Export button_text={`Exportez ${countStr()}`} columns={selctedColumns} endpoint={API_TRANSITAIRE_ENDPOINT} search={search} filters={filters} />,
              <AUForm  initialvalues={null} refetch={refetch}/>,
            ],
          }}
        />

      </Drawer>
    </div>
  );
};
