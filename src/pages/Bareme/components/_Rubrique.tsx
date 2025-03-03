import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
// import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns, getColumnsRubrique } from "../data";
// import AUForm from "./components/AUForm";
import { Button, Drawer } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export";
import { usePermissions } from "@/utils/permissions";
import { API_RUBRIQUES_ENDPOINT } from "@/api/api";

interface Props {
  expand?:string, 
  endpoint:string 
}
export default ({expand,endpoint}:Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
    isFetching,
  } = useData({
    endpoint: API_RUBRIQUES_ENDPOINT,
    name: "GET_RUBRIQUES",
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

  const hasPermission = usePermissions();

  return (
    <div>
      <Button icon={<CloudDownloadOutlined />} type="dashed" onClick={showModal} disabled={!hasPermission("app.can_export_bareme")}>
        Rubriques
      </Button>
      <Drawer
      placement="left"
        title="Rubrique"
        destroyOnClose
       width={"80%"}
        footer={false}
        open={open}
        closeIcon
        onClose={() => {
          setOpen(false);
        }}
      >
        <ColumnsSelect
          columns={selctedColumns}
          setSelectedColumns={setSelectedColumns}
        />
        <CustomTable
          getColumns={getColumnsRubrique(refetch)}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="RUBRIQUES_TABLE"
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
      </Drawer>
    </div>
  );
};
