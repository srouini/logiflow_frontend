import { PageContainer } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/useLoading";
import usePage from "@/hooks/usePage";
import useData from "@/hooks/useData";
import {
  API_ARTICLES_ENDPOINT,
  API_CONTENEURS_ENDPOINT,
  API_SOUSARTICLES_ENDPOINT,
} from "@/api/api";
import CustomTableAll from "@/components/CustomTableAll";
import CustomTable from "@/components/CustomTable";
import { breadcrumb, getColumns, subArticlesColumns } from "./data";
import { useParams } from "react-router";
import Details from "@/components/Details";
import { DetailsColumns } from "./data";
import { useReferenceContext } from "@/context/ReferenceContext";
import { Divider, Segmented } from "antd";


export default () => {
  const { id } = useParams();
  const { containerType } = useReferenceContext();

  useEffect(() => {
    containerType?.fetch();
  }, []);

  // @ts-ignore
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();

  const {
    data: selectedArticleData,
    isLoading: isLoadingArticle,
    isRefetching: isRefetchingArticle,
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

  const [selctedContainer, setSelectedContainer] = useState("");
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
      tc__id: selctedContainer,
    },
    enabled:false
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

useEffect(() => {
  if (selctedContainer) {
    refechSubArticles();
  }
}, [selctedContainer]);

  const handleContainerSelection = (values: any) => {
    setSelectedContainer(values);
  };

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
        isFetching={isFetching}
        getPageSize={getPageSize}
        isLoading={isLoadingSubArticle}
        refetch={refechSubArticles}
        setPage={setPage}
        setPageSize={setPageSize}
        setSearch={null}
        key="SUB_ARTICLES_TABLE"
        toolbar={{actions:[ <Segmented
          options={data?.data?.map((item: any) => {
            return { label: item.tc, value: item.id,disabled: !item.depote,  };
          })}
          onChange={handleContainerSelection}
          allowFullScreen 
          defaultValue={false}
        />]}}
      />
    </PageContainer>
  );
};
