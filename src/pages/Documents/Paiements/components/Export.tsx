import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import CustomTable from "@/components/CustomTable";
import { getColumns, exportColumns } from "../data";
import { Button, Drawer } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export";
import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import { usePermissions } from "@/utils/permissions";

interface Props {
  expand?: string;
  query_params?: any;
}

export default ({ expand = "gros,article.client", query_params }: Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();
  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<any>(exportColumns);

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_PRFORMAS_ENDPOINT,
    name: "GET_DOCUMENTS_PROFORMAS_EXPORT",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: expand,
      ...query_params,
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

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
      <Button icon={<CloudDownloadOutlined />} type="dashed" onClick={() => setOpen(true)} disabled={!hasPermission("app.can_export_paiement")}>
        Exporter
      </Button>

      <Drawer
        placement="left"
        title="Exportation de données"
        destroyOnClose
        width={"80%"}
        footer={false}
        open={open}
        closeIcon
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

        <ColumnsSelect
          columns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
        />
        
        <CustomTable
          getColumns={getColumns(() => {}).filter((col) => col.key !== "10")}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="DOCUMENTS_PROFORMAS_TABLE_EXPORT"
          toolbar={{
            actions: [
              <Export
                button_text={`Exportez ${countStr()}`}
                columns={selectedColumns}
                endpoint={API_PRFORMAS_ENDPOINT}
                search={search}
                filters={filters}
                expand={expand}
                query_params={query_params}
              />,
            ],
          }}
        />
      </Drawer>
    </div>
  );
};
