import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_BULLETINS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getColumns } from "./data";
import { useReferenceContext } from "@/context/ReferenceContext";
import Export from "./components/Export";

export default () => {

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_BULLETINS_ENDPOINT,
    name: `GET_RECEPTIONS`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      loaded:true,
      expand: "gros,charge_chargement,charge_reception",
      ordering: "-date_creation,-numero",
    },
  });
  const { isLoading } = useLoading({ loadingStates: [isLoadingData, isRefetching,isFetching ]});

  const breadcrumb: any = {
    items: [
      {
        path: "",
        title: "Rotation",
      },
      {
        path: "",
        title: "Réception",
      },
    ],
  };

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Réception`,
        extra: [
          <Export  endpoint={API_BULLETINS_ENDPOINT} query_params={{ordering: "-date_creation,-numero",}} expand="gros,charge_chargement,charge_reception" key="BULLETINSEXPORT" />,
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
        isFetching={isFetching}
        getPageSize={getPageSize}
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="RECEPTION_TABLE"
      />
    </PageContainer>
  );
};
