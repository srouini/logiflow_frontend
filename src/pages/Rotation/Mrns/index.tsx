import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_MRNS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { getColumns } from "./data";
import AUForm from "./components/AUForm";

export default () => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
  } = useData({
    endpoint: API_MRNS_ENDPOINT,
    name: "GET_MRNS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "regime,armateur,consignataire,navire",
    },
  });

  const { isLoading } = useLoading({ isLoadingData, isRefetching });

  const breadcrumb = {
    items: [
      {
      
        title: "Rotations",
      },
      {
        title: "Mrns",
      },
    ],
  };

  return (
    <div>
      <PageContainer
        contentWidth="Fluid"
        header={{
          breadcrumb: breadcrumb,
          extra: [<AUForm refetch={refetch} initialvalues={null} />],
        }}
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
          key="MRN_TABLE"
        />
      </PageContainer>
    </div>
  );
};
