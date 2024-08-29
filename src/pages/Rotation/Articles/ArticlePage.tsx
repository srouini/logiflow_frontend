import { PageContainer } from '@ant-design/pro-components'
import { useState } from 'react'
import useLoading from '@/hooks/useLoading';
import usePage from '@/hooks/usePage';
import useFilters from '@/hooks/useFilters';
import useData from '@/hooks/useData';
import { API_ARTICLES_ENDPOINT, API_MRNS_ENDPOINT } from '@/api/api';
import QueryFilters from './components/QueryFilters';
import CustomTable from '@/components/CustomTable';
import { getColumns } from './data';
import AUForm from './components/AUForm';
import { useParams } from 'react-router';
import MrnDetails from './components/MrnDetails';

const ArticlePage = () => {

  const { id } = useParams();

  console.log(id)
  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();
  const { filters, resetFilters, setFilters } = useFilters();
  

  const {
    data:selectedMrnData,
    isLoading: isLoadingMrn,
    isRefetching:isRefetchingMrn,
    
  } = useData({
    endpoint: API_MRNS_ENDPOINT+id+"/",
    name: "GET_SELECTED_MRN",
    params: {
      expand: "regime,armateur,consignataire,navire",
    },
  });

  console.log(selectedMrnData)
  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    refetch,
  } = useData({
    endpoint: API_ARTICLES_ENDPOINT,
    name: "GET_ARTICLES",
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      ...filters,
      expand: "client,transitaire",
      gros__id :id
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
        title: "Articles",
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

    <MrnDetails dataSource={selectedMrnData?.data} isLoading={isLoadingMrn || isRefetchingMrn} />
    
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
      key="ARTICLES_TABLE"
      buttons={ [<AUForm refetch={refetch} initialvalues={null} />]}
    />
  </PageContainer>

  )
}

export default ArticlePage