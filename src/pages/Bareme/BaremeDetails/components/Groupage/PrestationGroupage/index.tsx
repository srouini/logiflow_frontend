import { useEffect, useState } from "react";
import { Divider, message } from "antd";
import { Container } from "@/types/data";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_PRESTATIONS_GROUPAGE_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Bareme } from "@/types/bareme";
import QueryFilters from "./components/QueryFilters";
import useFilters from "@/hooks/useFilters";

interface PrestationGroupagePageProps {
  container?: Container;
  columns?: any;
  bareme: Bareme | undefined;
}

export default ({ bareme }: PrestationGroupagePageProps) => {

  const { box } = useReferenceContext();
  useEffect(() => {
    box?.fetch();
  }, []);


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
    endpoint: API_PRESTATIONS_GROUPAGE_ENDPOINT,
    name: `GET_PRESTATION_GROUPAGES`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "rubrique,bareme",
      bareme__id: bareme?.id,
      ...filters,
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  return (
    <>
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
        key="PRESTATION_GROUPAGE_TABLE"
        headerTitle={[
          <AUForm refetch={refetch} bareme={bareme} initialvalues={null} />,
          <div style={{ marginRight: "10px" }}></div>,
        ]}
      />
    </>
  );
};
