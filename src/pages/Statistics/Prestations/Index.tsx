import { PageContainer } from "@ant-design/pro-components";
import { lazy, Suspense, useMemo, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_FACTURE_ENDPOINT, API_LIGNES_PRESTATION_ENDPOINT } from "@/api/api";
import { getColumns } from "./data";
import Export from "./components/Export";

const QueryFilters = lazy(() => import("./components/QueryFilters"));
const CustomTable = lazy(() => import("@/components/CustomTable"));

export default () => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data:lignePrestations,
    isLoading: isLoadingLignePrestations,
    isRefetching:isRefetchingLignePrestations,
    isFetching:isFetchingLignePrestations,
    refetch:refetchLignePrestations,
  } = useData({
    endpoint: API_LIGNES_PRESTATION_ENDPOINT,
    name: "GET_PRESTATION_ENDPOINT",
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
    loadingStates: [isLoadingLignePrestations, isRefetchingLignePrestations, isFetchingLignePrestations],
  });

  const breadcrumb = {
    items: [
      {
        title: "Statistiques",
      },
      {
        title: "Prestations",
      },
    ],
  };

  // const memoizedColumns = useMemo(() => getColumns(refetch), [refetch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <PageContainer
        contentWidth="Fluid"
        header={{
          breadcrumb: breadcrumb,
          extra: [<Export expand="proforma.gros.regime,proforma.article.client" />],
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
          key="DOCUMENTS_FACTURES_TABLE"
        />
      </PageContainer> */}
    </Suspense>
  );
};