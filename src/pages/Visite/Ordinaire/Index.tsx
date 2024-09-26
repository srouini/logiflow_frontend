import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_VISITES_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getColumns } from "./data";
import AUForm from "./components/AUForm";
import Calendair from "./components/Calendar";

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
    endpoint: API_VISITES_ENDPOINT,
    name: "GET_VISITES",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "gros,article,transitaire",
      ordering: "-date_creation,-numero",
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const breadcrumb: any = {
    items: [
      {
        path: "",
        title: "Visite",
      },
      {
        path: "",
        title: "Ordinaire",
      },
    ],
  };

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Chargements`,
        extra: [
          <AUForm refetch={refetch} initialvalues={null} addText="Visite" />,
          <Calendair />,
        ],
      }}
      title=" "
    >
      <QueryFilters
        setFilters={setFilters}
        resetFilters={resetFilters}
        setPage={setPage}
      />

      <CustomTable
        getColumns={getColumns(refetch)}
        data={data}
        getPageSize={getPageSize}
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="ARTICLES_TABLE"
      />
    </PageContainer>
  );
};
