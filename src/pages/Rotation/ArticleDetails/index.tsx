import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import { API_ARTICLES_ENDPOINT, API_CONTENEURS_ENDPOINT } from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTable from "@/components/CustomTable";
import { breadcrumb, getColumns } from "./data";
import AUForm from "./components/AUForm";
import { useNavigate, useParams } from "react-router";
import Details from "@/components/Details";
import { DetailsColumns } from "./data";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import { message, Segmented } from "antd";
import usePost from "@/hooks/usePost";
import Prestations from "./components/Prestations";
import AUFormDepotage from "./components/AUFormDepotage";
import Print from "@/components/Print";

export default () => {
  const { id } = useParams();
  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data: selectedArticleData,
    isLoading: isLoadingArticle,
    isRefetching: isRefetchingArticle,
    refetch: refetchSelectedArticle,
  } = useData({
    endpoint: API_ARTICLES_ENDPOINT + id + "/",
    name: `GET_SELECTED_ARTICLE_${id}`,
    params: {
      expand: "client,transitairee,gros.regime",
    },
  });

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: `GET_CONTAINERS_${id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "type_tc,current_scelle",
      article__id: id,
    },
  });
  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const rowSelectionFunction: TableSelectionType = {
    // @ts-ignore
    onChange(selectedRowKeys, selectedRows, info) {
      setSelectedRows(selectedRowKeys);
    },
  };

  const onSuccess = () => {
    message.success("Submission successful");
    refetch();
  };

  const { mutate } = usePost({
    onSuccess: onSuccess,
    endpoint: API_CONTENEURS_ENDPOINT + "bulk_update_type_tc/",
  });

  const handleContainerType = (values: any) => {
    mutate({
      ids: selectedRows,
      type_tc_id: values,
    });
  };

  const RowSelectionRnder = (
    <>
      Type:
      <Segmented
        options={containerType?.results}
        onChange={handleContainerType}
        allowFullScreen
        defaultValue={false}
      />
    </>
  );
  const navigate = useNavigate();

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Article ${selectedArticleData?.data?.numero}`,
        extra: [
          <AUForm
            refetch={refetch}
            initialvalues={null}
            article={id}
            addText="Conteneur"
          />,
          <Prestations article={id?.toString()} />,
          selectedArticleData?.data?.groupage && (
            <AUFormDepotage
              article={id}
              disable={selectedArticleData?.data.depote}
              refetch={refetchSelectedArticle}
            />
          ),
          <Print
            type="View"
            endpoint={API_ARTICLES_ENDPOINT}
            id={id}
            endpoint_suffex="generate_ticktage/"
            button_text="Ticktage"
          />,
        ],

        onBack: () =>
          navigate(`/rotations/mrns/${selectedArticleData?.data?.gros?.id}`),
      }}
    >
      <Details
        dataSource={selectedArticleData?.data}
        isLoading={isLoadingArticle || isRefetchingArticle}
        DetailsColumns={DetailsColumns}
      />

      <QueryFilters
        setFilters={setFilters}
        resetFilters={resetFilters}
        setPage={setPage}
      />

      <CustomTable
        getColumns={getColumns(refetch, selectedArticleData?.data)}
        data={data}
        isFetching={isFetching}
        getPageSize={getPageSize}
        isLoading={isLoading}
        refetch={refetch}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={setSearch}
        rowSelectionFunction={rowSelectionFunction}
        RowSelectionRnder={RowSelectionRnder}
        key="CONTAINERS_TABLE"
      />
    </PageContainer>
  );
};
