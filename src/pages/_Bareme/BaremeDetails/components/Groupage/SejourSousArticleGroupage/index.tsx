import { useEffect, useState } from "react";
import { Divider } from "antd";
import { Container } from "@/types/data";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Bareme } from "@/types/bareme";
import QueryFilters from "./components/QueryFilters";
import useFilters from "@/hooks/useFilters";
import Export from "@/components/Export";
import { columns } from "./data";

interface SejourSousArticleGroupagePageProps {
  container?: Container;
  columns?: any;
  bareme: Bareme | undefined;
}

export default ({ bareme }: SejourSousArticleGroupagePageProps) => {

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
    endpoint: API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT,
    name: `GET_SEJOUR_SOUS_ARTICLE_GROUPAGES`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "bareme",
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
      <Divider />
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
        key="SEJOUR_SOUS_ARTICLE_GROUPAGE_TABLE"
        headerTitle={[
          <AUForm refetch={refetch} bareme={bareme} initialvalues={null} />,
          <div style={{ marginRight: "10px" }}></div>,
          <Export filters={{"bareme__id":bareme?.id,...filters}} search={search} columns={columns} endpoint={API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT} expand="bareme" key="SEJOURSSOUSARTICLEGROUPAGEEXPORT" />,

        ]}
      />
    </>
  );
};
