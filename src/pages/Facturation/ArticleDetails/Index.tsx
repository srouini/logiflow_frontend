import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useFilters from "@/hooks/useFilters";
import useData from "@/hooks/useData";
import {
  API_ARTICLES_ENDPOINT,
  API_CONTENEURS_ENDPOINT,
  API_SOUSARTICLES_ENDPOINT,
} from "@/api/api";
import QueryFilters from "./components/QueryFilters";
import CustomTableAll from "@/components/CustomTableAll";
import CustomTable from "@/components/CustomTable";
import { breadcrumb, getColumns, subArticlesColumns } from "./data";
import AUForm from "./components/AUForm";
import { useParams } from "react-router";
import Details from "@/components/Details";
import { DetailsColumns } from "./data";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Divider } from "antd";
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
  const {
    page: pageSubArticle,
    getPageSize: getPageSizeSubArticle,
    setPageSize: setPageSizeSubArticle,
    setPage: setPageSubArticle,
  } = usePage();
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
    name: `GET_CONTAINERS_FACTURATION_${id}`,
    params: {
      expand: "type_tc,current_scelle",
      article__id: id,
      all:true
    },
  });

  const {
    data: dataSubArticles,
    isLoading: isLoadingDataSubArticles,
    isRefetching: isRefetchingSubArticles,
    isFetching: isFetchingSubArticles,
    refetch: refechSubArticles,
  } = useData({
    endpoint: API_SOUSARTICLES_ENDPOINT,
    name: `GET_SOUS_ARTICLES_${id}`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "client,box",
      tc__article__id: id,
    },
  });

  const { isLoading } = useLoading({
    loadingStates: [isLoadingData, isRefetching, isFetching],
  });

  const { isLoading: isLoadingSubArticle } = useLoading({
    loadingStates: [
      isLoadingDataSubArticles,
      isRefetchingSubArticles,
      isFetchingSubArticles,
    ],
  });

  return (
    <PageContainer
      contentWidth="Fluid"
      header={{
        breadcrumb: breadcrumb,
        title: `Article ${selectedArticleData?.data?.numero}`,
        extra: [
        ],
      }}
    >
      <Details
        dataSource={selectedArticleData?.data}
        isLoading={isLoadingArticle || isRefetchingArticle}
        DetailsColumns={DetailsColumns}
      />

      <CustomTableAll
        getColumns={getColumns()}
        data={data}
        headerTitle="Conteneurs"
        isLoading={isLoading}
        refetch={refetch}
        key="CONTAINERS_TABLE"
      />

      <Divider />
      <CustomTable
      headerTitle="Sous Articles"
        getColumns={subArticlesColumns()}
        data={dataSubArticles}
        getPageSize={getPageSizeSubArticle}
        isLoading={isLoadingSubArticle}
        refetch={refechSubArticles}
        setPage={setPageSubArticle}
        setPageSize={setPageSizeSubArticle}
        setSearch={null}
        key="SUB_ARTICLES_TABLE"
      />
    </PageContainer>
  );
};
