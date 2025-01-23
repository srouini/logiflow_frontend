import { PageContainer } from "@ant-design/pro-components";
import { lazy, Suspense, useMemo, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api";
import { getColumns } from "./data";
import Export from "./components/Export";
import ExportEtatDFC from "./components/ExportEtatDFC";

const QueryFilters = lazy(() => import("./components/QueryFilters"));
const CustomTable = lazy(() => import("@/components/CustomTable"));

export default () => {
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
    endpoint: API_FACTURES_GROUPAGE_ENDPOINT,
    name: "GET_DOCUMENTS_FACTURES_GROUPAGE",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "proforma.gros,proforma.sous_article.client,proforma.article.client,proforma.article",
      enabled: false,
      ordering:"-date_creation,-numero"
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const breadcrumb = {
    items: [
      {
        title: "Documents",
      },
      {
        title: "Groupage",
      },
      {
        title: "Factures",
      },
    ],
  };

  const memoizedColumns = useMemo(() => getColumns(refetch), [refetch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContainer
        contentWidth="Fluid"
        header={{
          breadcrumb: breadcrumb,
          extra: [
            <Export expand="proforma.gros,proforma.sous_article.client,proforma.article.client,proforma.article" />
          ],
        }}
      >
        <QueryFilters
          setFilters={setFilters}
          resetFilters={resetFilters}
          setPage={setPage}
        />

        <CustomTable
          getColumns={memoizedColumns}
          data={data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="DOCUMENTS_FACTURES_GROUPAGE_TABLE"
        />
      </PageContainer>
    </Suspense>
  );
};
