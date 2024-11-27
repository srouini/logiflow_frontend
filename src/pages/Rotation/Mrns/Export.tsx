import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
// import AUForm from "./components/AUForm";
import { Button, Modal } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import QueryFilters from "./components/QueryFilters";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export";

interface Props {
  expand?:string, 
  endpoint:string 
}
export default ({expand,endpoint}:Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
    isFetching,
  } = useData({
    endpoint: endpoint,
    name: "GET_MRNS_EXPORT",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: expand,
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const [selctedColumns, setSelectedColumns] = useState<any>(columns);

  const countStr = () => {
    let count_str = "";
    if (data?.data?.count > 0) {
      count_str = `( ${data?.data?.count.toString()} )`;
    }

    return count_str;
  };

  return (
    <div>
      <Button icon={<CloudDownloadOutlined />} type="dashed" onClick={showModal}>
        Exporter
      </Button>
      <Modal
        title="Mrns"
        destroyOnClose
        width={1200}
        footer={false}
        open={open}
        closeIcon
        onCancel={() => {
          setOpen(false);
        }}
      >
        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
        />

        <ColumnsSelect
          columns={selctedColumns}
          setSelectedColumns={setSelectedColumns}
        />
        <CustomTable
          getColumns={getColumns(refetch).filter((col) => col.key !== "actions")}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="MRNS_EXPORT_TABLE"
          scrollY={350}
          toolbar={{
            actions: [
              <Export
                button_text={`Exportez ${countStr()}`}
                columns={selctedColumns}
                endpoint={endpoint}
                search={search}
                filters={filters}
                expand={expand}
              />,
            ],
          }}
        />
      </Modal>
    </div>
  );
};
