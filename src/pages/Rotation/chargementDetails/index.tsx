import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_BULLETINS_ENDPOINT, API_CONTENEURS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { DetailsColumns, getColumns,breadcrumb } from "./data";
import { useNavigate, useParams } from "react-router";
import Details from "@/components/Details";
import { useReferenceContext } from "@/context/ReferenceContext";
import Containers from "./components/Containers";
import { Button, message } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import usePost from "@/hooks/usePost";


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
    data: selectedRecord,
    isLoading: isLoadingRecord,
    isRefetching: isRefetchingRecord,
    refetch
  } = useData({
    endpoint: API_BULLETINS_ENDPOINT + id + "/",
    name: `GET_SELECTED_BULLETIN_${id}`,
    params: {
      expand: "gros,charge_chargement",
    },
  });

  const {
    data:loaded,
    isLoading: isLoadingLoadedData,
    isRefetching:isRefetchingLoaded,
    isFetching:isFetchingLoaded,
    refetch:refetchLoaded,
  } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: `GET_BULLETIN_ITEMS_${id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "article,type_tc,current_scelle",
      bulletins__id: id,
    },
  });

  const { isLoading:isLoadingLoaded } = useLoading({loadingStates: [isFetchingLoaded, isLoadingLoadedData, isRefetchingLoaded] });
  


  const onSuccess = () => {
    message.success("Le bulletin a été bien validé.");
    refetch();
  };

  const { mutate, isLoading:bulletin_is_patshing } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BULLETINS_ENDPOINT,
  });

  const handleBulltinValidation = () => {
  
    // const not_valid = loaded?.data?.results?.some((record:any) => record.matricule_camion === null)
    // if (not_valid){
    //   message.error("Tous les matricules doivent être renseignés pour valider le bulletin.")
    // }else{
    //   mutate({id:id,loaded:true})
    // }
    mutate({id:id,loaded:true})
}
const navigate = useNavigate();
  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Bulletin -  ${selectedRecord?.data?.numero}`,
        extra: [
          <Button type="default" icon={<CloudUploadOutlined />} disabled={selectedRecord?.data?.loaded} loading={bulletin_is_patshing} onClick={handleBulltinValidation}>Validez</Button>,<Containers mrn={selectedRecord?.data?.gros} bulletin={id} refetchLoadedContainers={refetchLoaded} disabled={selectedRecord?.data?.loaded} />
        ],
        onBack : () =>  navigate(`/rotations/chargement/`)
      }}
      title=" "
      
    >
      <Details
        dataSource={selectedRecord?.data}
        isLoading={isLoadingRecord || isRefetchingRecord}
        DetailsColumns={DetailsColumns}
      />

      <QueryFilters
        setFilters={setFilters}
        resetFilters={resetFilters}
        setPage={setPage}
      />

      <CustomTable
        getColumns={getColumns({refetch:refetchLoaded,loaded:selectedRecord?.data?.loaded})}
        data={loaded}
        isFetching={isFetchingLoaded}
        getPageSize={getPageSize}
        isLoading={isLoadingLoaded}
        refetch={refetchLoaded}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="ARTICLES_TABLE"
      />
    </PageContainer>
  );
};
