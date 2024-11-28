import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_ARTICLES_ENDPOINT, API_MRNS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { DetailsColumns, getColumns } from "./data";
import AUForm from "./components/AUForm";
import { useNavigate, useParams } from "react-router";
import Details from "@/components/Details";
import Chargement from "../Mrns/components/Chargement";
import Conteneurs from "./components/Containers"
import { useReferenceContext } from "@/context/ReferenceContext";
import Export from "./components/Export";

export default () => {
  const { id } = useParams();

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);
  
  const {
    data: selectedMrnData,
    isLoading: isLoadingMrn,
    isRefetching: isRefetchingMrn,
  } = useData({
    endpoint: API_MRNS_ENDPOINT + id + "/",
    name: `GET_SELECTED_MRN_${id}`,
    params: {
      expand: "regime,armateur,consignataire,navire",
    },
  });

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_ARTICLES_ENDPOINT,
    name: `GET_ARTICLES_${id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "client,transitaire",
      gros__id: id,
    },
  });
  const { isLoading } = useLoading({ loadingStates: [isLoadingData, isRefetching, isFetching] });

  const breadcrumb: any = {
    items: [
      {
        title: "Rotation",
      },
      {
        title: "Mrns",
      },
      {
        title: "Articles",
      },
    ],
  };

 
  const navigate = useNavigate();
  
  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `MRN -  ${selectedMrnData?.data?.gros}`,
        extra: [
          <Export query_params={{gros__id: id}} endpoint={API_ARTICLES_ENDPOINT} expand="client,transitaire" key="ARTICLESEXPORT" />,
          <AUForm refetch={refetch} initialvalues={null} gros={id} addText="Article"/>,
          <Chargement refetch={refetch} mrn={selectedMrnData?.data?.id} />,
          <Conteneurs mrn={id}/>
        ],
        onBack : () =>  navigate("/rotations/mrns/")
      }}
      title=" "
    >
      <Details
        dataSource={selectedMrnData?.data}
        isLoading={isLoadingMrn || isRefetchingMrn}
        DetailsColumns={DetailsColumns}
        key={selectedMrnData?.data?.id}
      />

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
        key="ARTICLES_TABLE"

      />
    </PageContainer>
  );
};
