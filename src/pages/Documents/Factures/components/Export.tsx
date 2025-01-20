import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import CustomTable from "@/components/CustomTable";
import { getColumns, exportColumns } from "../data";
import { Button, Drawer, message } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import QueryFilters from "./QueryFilters";
import ColumnsSelect from "@/components/ColumnsSelect";
import Export from "@/components/Export";
import BatchPDF from "@/components/BatchPDF";
import { API_FACTURE_ENDPOINT } from "@/api/api";
import { useAxios } from "@/hooks/useAxios";
import MergedPDF from "@/components/MergedPDF";

interface Props {
  expand?: string;
  query_params?: any;
}

export default ({ expand = "proforma.gros.regime,proforma.article.client", query_params }: Props) => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();
  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<any>(exportColumns);
  //@ts-ignore
  const [loadingPdf, setLoadingPdf] = useState(false);

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_FACTURE_ENDPOINT,
    name: "GET_DOCUMENTS_FACTURES_EXPORT",
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
  const api = useAxios()
  //@ts-ignore
  const handleBatchPdfExport = async () => {
    if (!data?.data?.results?.length) {
      message.warning("No factures available for export");
      return;
    }
  
    setLoadingPdf(true);
    try {
      const response = await api.post(
        `${API_FACTURE_ENDPOINT}generate_batch_pdf/`,
        {
          facture_ids: data?.data?.results.map((facture: any) => facture.id),
        },
        {
          responseType: 'blob' // Important for binary data
        }
      );
  
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'factures.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success("PDFs generated and downloaded successfully");
    } catch (error) {
      console.error('Error generating PDFs:', error);
      message.error("Failed to generate PDFs");
    } finally {
      setLoadingPdf(false);
    }
  };
  return (
    <>
      <Button icon={<CloudDownloadOutlined />} type="dashed" onClick={() => setOpen(true)}>
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
          getColumns={getColumns(() => {}).filter((col) => col.key !== "12")}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="DOCUMENTS_FACTURES_TABLE_EXPORT"
          toolbar={{
            actions: [
              <Export
                button_text={`Exportez ${countStr()}`}
                columns={selectedColumns}
                endpoint={API_FACTURE_ENDPOINT}
                search={search}
                filters={filters}
                expand={expand}
                query_params={query_params}
              />,
              <BatchPDF
              endpoint={API_FACTURE_ENDPOINT}
              filters={filters}
              search={search}
              expand={expand}
              query_params={query_params}
              button_text={`Factures (ZIP) ${countStr()}`}
              />,
              <MergedPDF
              filters={filters}
              search={search}
              endpoint={API_FACTURE_ENDPOINT}
              expand={expand}
              query_params={query_params}
              button_text={`Factures (PDF) ${countStr()}`}
            />
            ],
          }}
        />
      </Drawer>
    </>
  );
};