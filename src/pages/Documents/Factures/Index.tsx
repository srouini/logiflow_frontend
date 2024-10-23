import { PageContainer } from "@ant-design/pro-components";
import { lazy, Suspense, useMemo, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_FACTURE_ENDPOINT } from "@/api/api";
import { getColumns } from "./data";

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
    endpoint: API_FACTURE_ENDPOINT,
    name: "GET_DOCUMENTS_FACTURES",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "proforma.gros.regime,proforma.article.client",
      enabled: false,
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
          extra: [],
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
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="DOCUMENTS_FACTURES_TABLE"
        />
      </PageContainer>
    </Suspense>
  );
};
