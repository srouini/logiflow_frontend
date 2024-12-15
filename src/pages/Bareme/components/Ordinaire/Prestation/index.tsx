import { useEffect, useState } from "react";
import {  Divider, message, Segmented } from "antd";
import { Container } from "@/types/data";
import CustomTable from "@/components/CustomTable";
import useData from "@/hooks/useData";
import { API_PRESTATIONS_ENDPOINT, API_SOUSARTICLES_ENDPOINT } from "@/api/api";
import usePage from "@/hooks/usePage";
import { getColumns } from "./data";
import useLoading from "@/hooks/useLoading";
import AUForm from "./components/AUForm";
import usePost from "@/hooks/usePost";
import { TableSelectionType } from "@/types/antdeing";
import { useReferenceContext } from "@/context/ReferenceContext";
import Export from "./components/Export";
import { Bareme } from "@/types/bareme";
import QueryFilters from "./components/QueryFilters";
import useFilters from "@/hooks/useFilters";

interface SubArticlePageProps {
  container?: Container;
  columns?: any;
  bareme:Bareme | undefined
}

export default ({ bareme,container, columns }: SubArticlePageProps) => {
  const [open, setOpen] = useState(false);

  const { box } = useReferenceContext();
  useEffect(() => {
    box?.fetch();
  }, []);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const { page, getPageSize, setPageSize, setPage } = usePage();

  const { filters, resetFilters, setFilters } = useFilters();

  const {
    data,
    isLoading: isLoadingData,
    isRefetching,
    isFetching,
    refetch,
  } = useData({
    endpoint: API_PRESTATIONS_ENDPOINT,
    name: `GET_PRESTATIONS`,
    params: {
      search: search,
      page: page,
      page_size: getPageSize(),
      expand: "type_tc,rubrique,bareme",
      bareme__id: bareme?.id,
      rubrique__categorie__exact: "Automatique",
      ...filters,
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
    endpoint: API_SOUSARTICLES_ENDPOINT + "bulk_update_box/",
  });

  const handleContainerType = (values: any) => {
    mutate({
      ids: selectedRows,
      box_id: values,
    });
  };



  return (
    <>
    <Divider orientation="left">Préstations Automatique</Divider> 
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
          key="PRESTATIONS_TABLE"
          headerTitle={
          [  <AUForm refetch={refetch} bareme={bareme} initialvalues={null} />,
            <div style={{marginRight:"10px"}}></div>,
            <Export query_params={{tc__id: container?.id}} endpoint={API_SOUSARTICLES_ENDPOINT} expand="client,transitaire,box" key="SOUSARTICLESEXPORT" />,]

          }
        />

    </>
  );
};
