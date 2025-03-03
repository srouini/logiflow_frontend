import { API_PRFORMAS_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";

import AUForm from "./components/AUFormTwo";
import { useEffect } from "react";

interface Props {
  id: string | undefined;
  article?:any,
  activeTab?:string
}


export default ({ id,article,activeTab }: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } = useData({
    endpoint: API_PRFORMAS_ENDPOINT,
    name: `GET_PROFORMA_${id}`,
    params: {
      expand: "type_tc,current_scelle",
      article__id: id,
      all: true,
    },
  });


  useEffect(() =>{
    if(activeTab === "proformas"){
      refetch();
    }

  },[activeTab])

  
  return (
    <ProTable<any>
      headerTitle="Proformas"
      // @ts-ignore
      options={{ reload: refetch }}
      columns={getColumns(refetch)}
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

