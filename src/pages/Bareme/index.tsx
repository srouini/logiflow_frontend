import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_BAREMES_ENDPOINT } from "@/api/api";
import CustomTable from "@/components/CustomTable";
import { columns, getColumns } from "./data";
import AUForm from "./components/AUForm";
import Export from "@/components/Export";

export default () => {
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
    isFetching
  } = useData({
    endpoint: API_BAREMES_ENDPOINT,
    name: "GET_BAREMES",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "regime,armateur,consignataire,navire",
    },
  });

  const { isLoading } = useLoading({ loadingStates:[isLoadingData, isRefetching] });

  return (
    <div>
      <PageContainer
        contentWidth="Fluid"
        header={{
          extra: [<Export filters={[]} search={search} columns={columns} endpoint={API_BAREMES_ENDPOINT} expand="" key="BAREMESEXPORT" />,<AUForm refetch={refetch} initialvalues={null} />],
        }}
      >

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
          key="MRN_TABLE"
        />
      </PageContainer>
    </div>
  );
};
