import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getColumns } from "./data";

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
    endpoint: API_PRFORMAS_ENDPOINT,
    name: "GET_DOCUMENTS_PRFORMAS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "gros,article.client",
    },
  });

  const { isLoading } = useLoading({loadingStates:[ isLoadingData, isRefetching,isFetching ]});

  const breadcrumb = {
    items: [
      {
      
        title: "Documents",
      },
      {
        title: "Proformas",
      },
    ],
  };

  return (
    <div>
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
          getColumns={getColumns(refetch)}
          // @ts-ignore
          data={isLoading ? [] :data}
          isFetching={isFetching}
          getPageSize={getPageSize}
          isLoading={isLoading}
          refetch={refetch}
          setPage={setPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          key="DOCUMENTS_FACTURES_TABLE"
        />
      </PageContainer>
    </div>
  );
};
