import { PageContainer } from '@ant-design/pro-components'
import { useState } from 'react'
import useLoading from '@/hooks/useLoading';
import usePage from '@/hooks/usePage';
import useFilters from '@/hooks/useFilters';
import useData from '@/hooks/useData';
import { API_ARTICLES_ENDPOINT, API_CONTENEURS_ENDPOINT, API_MRNS_ENDPOINT } from '@/api/api';
import QueryFilters from './components/QueryFilters';
import CustomTable from '@/components/CustomTable';
import { getColumns } from './data';
import AUForm from './components/AUForm';
import { useParams } from 'react-router';
import MrnDetails from './components/MrnDetails';

const ContainersPage = () => {

  const { id } = useParams();

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();
  

  const {
    data:selectedArticleData,
    isLoading: isLoadingArticle,
    isRefetching:isRefetchingArticle,
    
  } = useData({
    endpoint: API_ARTICLES_ENDPOINT+id+"/",
    name: "GET_SELECTED_ARTICLE",
    params: {
      expand: "regime,armateur,consignataire,navire",
    },
  });

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
  } = useData({
    endpoint: API_CONTENEURS_ENDPOINT,
    name: "GET_CONTAINERS",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "client,transitaire",
      article__id :id
    },
  });
  const { isLoading } = useLoading({ isLoadingData, isRefetching });
 

  const breadcrumb = {
    items: [
      {
        path: "",
        title: "Rotation",
      },
      {
        path: "",
        title: "Tc",
      },
    ],
  };

  return (
    <PageContainer
    contentWidth="Fluid"
    header={{
      breadcrumb: breadcrumb,
    }}
      title=" "
  >

    <MrnDetails dataSource={selectedArticleData?.data} isLoading={isLoadingArticle || isRefetchingArticle} />
    
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
      key="CONTAINERS_TABLE"
      buttons={ [<AUForm refetch={refetch} initialvalues={null} />]}
    />
  </PageContainer>

  )
}

export default ContainersPage