import { API_PROFORMAS_GROUPAGE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import AUForm from "./components/AUForm";
import { useEffect } from "react";

interface Props {
  id: string | undefined;
  article?:any,
  refetch_sub_article:() => void;
  activeTab?: string; 
}


export default ({ id,article,refetch_sub_article,activeTab}: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } = useData({
    endpoint: API_PROFORMAS_GROUPAGE_ENDPOINT,
    name: `GET_PROFORMAS_GROUPAGE_${id}`,
    params: {
      sous_article__id: id,
      all: true,
    },
  });


  useEffect(() => {
    if (activeTab === "proformas") {
      refetch();
      refetch_sub_article();
    }
  }, [activeTab]);
  

  return (
    <ProTable<any>
      headerTitle="Proformas"
      // @ts-ignore
      options={{ reload: refetch }}
      columns={getColumns(refetch,refetch_sub_article)}
      loading={isLoading}
      dataSource={data?.data}
      toolbar={{
        actions: [
          <AUForm article={article} refetch={refetch} />,
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

