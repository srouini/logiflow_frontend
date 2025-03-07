import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_BULLETINS_ENDPOINT, API_CONTENEURS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { DetailsColumns, getColumns, breadcrumb } from "./data";
import { useNavigate, useParams } from "react-router";
import Details from "@/components/Details";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Button, Divider, Flex, message, Popconfirm, Modal } from "antd";
import usePost from "@/hooks/usePost";
import { CloudUploadOutlined } from "@ant-design/icons";
import TcDetailsButton from "./components/TcDetailsButton";
import Print from "@/components/Print";
import UpdateDouanier from "./components/UpdateDouanier";

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
    refetch,
  } = useData({
    endpoint: API_BULLETINS_ENDPOINT + id + "/",
    name: `GET_SELECTED_BULLETIN_${id}`,
    params: {
      expand: "gros,charge_chargement",
    },
  });

  const {
    data: loaded,
    isLoading: isLoadingLoadedData,
    isRefetching: isRefetchingLoaded,
    isFetching: isFetchingLoaded,
    refetch: refetchLoaded,
  } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: `GET_BULLETIN_ITEMS_${id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "article,type_tc,current_scelle,receved_by,parc,douanier",
      bulletins__id: id,
    },
  });

  const { isLoading: isLoadingLoaded } = useLoading({
    loadingStates: [isLoadingLoadedData, isRefetchingLoaded, isFetchingLoaded],
  });

  const onSuccess = () => {
    message.success("Le bulletin a été bien validé.");
    refetch();
  };

  const { mutate, isLoading: bulletin_is_patshing } = usePost({
    onSuccess: onSuccess,
    endpoint: API_BULLETINS_ENDPOINT,
  });

  const handleBulltinValidation = () => {
    let all_receved = loaded?.data?.results?.every(
      (item: any) => item?.receved === true
    );

    if (all_receved) {
      if (!selectedRecord?.data?.receved) {
        if (!selectedRecord?.data?.douanier) {
          Modal.confirm({
            title: 'Attention',
            content: "L'agent de douane responsable n'est pas sélectionné. Voulez-vous continuer?",
            okText: 'Oui',
            cancelText: 'Non',
            onOk() {
              mutate({ id: selectedRecord?.data?.id, receved: true });
            }
          });
        } else {
          mutate({ id: selectedRecord?.data?.id, receved: true });
        }
      }
    } else {
      message.error("Tous les conteneurs doivent etre reçus.")
    }
  };

  const navigate = useNavigate();
  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Bulletin -  ${selectedRecord?.data?.numero}`,
        extra: [
          <Popconfirm
            key="validate"
            title="Confirmation"
            description="Êtes-vous sûr de vouloir valider ce bulletin?"
            okText="Oui"
            cancelText="Non"
            onConfirm={handleBulltinValidation}
          >
            <Button type="default" icon={<CloudUploadOutlined />} disabled={selectedRecord?.data?.receved} loading={bulletin_is_patshing}>
              Validez
            </Button>
          </Popconfirm>,
          <Print endpoint={API_BULLETINS_ENDPOINT} id={id} disabled={!selectedRecord?.data?.receved} type="View" endpoint_suffex="generate_pdf/" button_text="Pv de réception" permission="app.print_pc_de_reception" />,
          <TcDetailsButton bulletinId={id} />,
        ],
        onBack: () => navigate(`/rotations/reception/`)

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

      <Divider />
      <Flex style={{ width: "100%" }} justify="end" gap={24}>

        <UpdateDouanier refetch={refetch} bulletin={selectedRecord?.data} />

      </Flex>

      <CustomTable
        getColumns={getColumns({
          refetch: refetchLoaded,
          loaded: selectedRecord?.data?.receved,
        })}
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
