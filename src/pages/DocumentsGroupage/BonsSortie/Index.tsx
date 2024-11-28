import { PageContainer } from "@ant-design/pro-components";
import { lazy, Suspense, useMemo, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_BONS_SORTIE_GROUPAGE_ENDPOINT } from "@/api/api";
import { getColumns } from "./data";
import Export from "./components/Export";
import CustomTable from "@/components/CustomTable";
import QueryFilters from "./components/QueryFilters";

const Index = () => {
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
    endpoint: API_BONS_SORTIE_GROUPAGE_ENDPOINT,
    name: "GET_DOCUMENTS_BONSORTIES_GROUPAGE",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "facture",
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
        title: "Bons sortie",
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
          extra: [<Export expand="facture" />],
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
          key="DOCUMENTS_BON_SORTIE_GROUPAGE_TABLE"
        />
      </PageContainer>
    </Suspense>
  );
};

export default Index;
