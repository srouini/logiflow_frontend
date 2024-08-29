import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import useData from "../../hooks/useData";
import { getColumns } from "./data";
import useLoading from "../../hooks/useLoading";
import usePage from "../../hooks/usePage";
import QueryFilters from "./QueryFilters";
import useFilters from "../../hooks/useFilters";
import CustomTable from "../../components/CustomTable";

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
    endpoint: "/api/data/gros/",
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
        path: "",
        title: "Admin",
      },
      {
        path: "",
        title: "Dashboard",
      },
    ],
  };

  return (
    <div>
      <PageContainer
        contentWidth="Fluid"
        header={{
          breadcrumb: breadcrumb,
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
