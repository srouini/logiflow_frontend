import { API_FACTURE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import { useEffect } from "react";

interface Props {
  id: string | undefined;
  article?:any,
  activeTab?:string
}
export default ({ id,activeTab }: Props) => {
  const {
    data: factures,
    isLoading: isLoadingFactures,
    refetch: refetchFactures,
  } = useData({
    endpoint: API_FACTURE_ENDPOINT,
    name: `GET_FACTURE___${id}`,
    params: {
      expand: "proforma,paiements.banque",
      proforma__article__id: id,
      all: true,
    },
  });

  useEffect(() =>{
    if(activeTab === "factures"){
      refetchFactures();
    }

  },[activeTab])

  return (
    <ProTable<any>
      headerTitle="Factures"
      // @ts-ignore
      options={{ reload: refetchFactures }}
      columns={getColumns({refetch:refetchFactures,isLoadingFacture:isLoadingFactures})}
      loading={isLoadingFactures}
      dataSource={factures?.data}
      toolbar={{
        
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

