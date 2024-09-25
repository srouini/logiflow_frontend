import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_VISITES_ENDPOINT, API_VISITES_ITEMS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { DetailsColumns, getColumns } from "./data";
import { useParams } from "react-router";
import { useReferenceContext } from "@/context/ReferenceContext";
import Details from "@/components/Details";
import Containers from "./components/Containers";
import { Button, message } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import usePost from "@/hooks/usePost";
import Print from "@/components/Print";

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
    endpoint: API_VISITES_ENDPOINT + id + "/",
    name: `GET_SELECTED_VISITE_${id}`,
    params: {
      expand: "gros,article,transitaire",
    },
  });

  const {
    data: dataVisiteItems,
    isLoading: isLoadingVisiteItems,
    isRefetching: isRefetchingVisiteItems,
    isFetching: isFetchingVisiteItems,
    refetch: refetchData,
  } = useData({
    endpoint: API_VISITES_ITEMS_ENDPOINT,
    name: `_GET_VISITE_ITEMS_${id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "tc.type_tc,tc.article,visite",
      visite__id: id,
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [
      isFetchingVisiteItems,
      isLoadingVisiteItems,
      isRefetchingVisiteItems,
    ],
  });

  const breadcrumb: any = {
    items: [
      {
        path: "",
        title: "Viste",
      },
      {
        path: "",
        title: "Ordinaire",
      },
    ],
  };

  const onSuccess = () => {
    message.success("La visite a été bien validé.");
    refetch();
    refetchData();
  };

  const { mutate, isLoading: visite_is_patshing } = usePost({
    onSuccess: onSuccess,
    endpoint: API_VISITES_ENDPOINT,
  });

  const handleBulltinValidation = () => {
    mutate({ id: id, validated: true });
  };

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Visite ${selectedRecord?.data?.visite}`,
        extra: [
          <Print
            endpoint={API_VISITES_ENDPOINT}
            id={selectedRecord?.data?.id}
            key={selectedRecord?.data?.id}
            type="View"
            disabled={!selectedRecord?.data?.validated}
          />,
          <Button
            type="default"
            icon={<CloudUploadOutlined />}
            disabled={selectedRecord?.data?.validated}
            loading={visite_is_patshing}
            onClick={handleBulltinValidation}
          >
            Validez
          </Button>,
          <Containers
            visite={id}
            refetchVisiteItems={refetchData}
            disabled={selectedRecord?.data?.validated}
          />,
        ],
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
        getColumns={getColumns(refetchData)}
        data={dataVisiteItems}
        getPageSize={getPageSize}
        isLoading={isLoading}
        refetch={refetchData}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        key="VISITE_ITEMS_TABLE"
      />
    </PageContainer>
  );
};
