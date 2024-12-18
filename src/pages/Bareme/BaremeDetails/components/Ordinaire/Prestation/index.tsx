import { useEffect, useState } from "react";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_PRESTATIONS_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { columns, getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Bareme } from "@/types/bareme";
import QueryFilters from "./components/QueryFilters";
import useFilters from "@/hooks/useFilters";
import Export from "@/components/Export";
import { Divider } from "antd";

interface PrestationProps {
  bareme: Bareme | undefined
}

export default ({ bareme }: PrestationProps) => {

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
    endpoint: API_PRESTATIONS_ENDPOINT,
    name: `GET_PRESTATIONS`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "type_tc,rubrique,bareme",
      bareme__id: bareme?.id,
      rubrique__categorie__exact: "Automatique",
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
      <Divider />
      <CustomTable
        getColumns={getColumns(refetch)}
        data={data}
        cardBordered={false}
        isFetching={isFetching}
        getPageSize={getPageSize}
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="PRESTATIONS_TABLE"
        headerTitle={
          [<AUForm refetch={refetch} bareme={bareme} initialvalues={null} />,
            <div style={{marginRight:"10px"}}></div>,
            <Export filters={{"bareme__id":bareme?.id,...filters}} search={search} columns={columns} endpoint={API_PRESTATIONS_ENDPOINT} expand="type_tc,rubrique,bareme" key="PRESTATIONSEXPORT" />,
          ]

        }
      />

    </>
  );
};
