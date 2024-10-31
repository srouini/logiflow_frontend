import { API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import { useEffect } from "react";

interface Props {
  id: string | undefined;
  article?: any;
  activeTab?: string;
}
export default ({ id, activeTab }: Props) => {
  const {
    data: factures,
    isLoading: isLoadingFactures,
    refetch: refetchFactures,
  } = useData({
    endpoint: API_FACTURES_GROUPAGE_ENDPOINT,
    name: `GET_FACTURES_GROUPAGE___${id}`,
    params: {
      expand: "proforma,paiementsgroupage.banque",
      proforma__sous_article__id: id,
      all: true,
    },
  });

  useEffect(() => {
    if (activeTab === "factures") {
      refetchFactures();
    }
  }, [activeTab]);

  return (
    <ProTable<any>
      headerTitle="Factures"
      // @ts-ignore
      options={{ reload: refetchFactures }}
      columns={getColumns({
        refetch: refetchFactures,
        isLoadingFacture: isLoadingFactures,
      })}
      loading={isLoadingFactures}
      dataSource={factures?.data}
      toolbar={{}}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};
