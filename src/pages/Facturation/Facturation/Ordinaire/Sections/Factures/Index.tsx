import { API_FACTURE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";

interface Props {
  id: string | undefined;
  article?:any
}
export default ({ id }: Props) => {
  const {
    data: factures,
    isLoading: isLoadingFactures,
    refetch: refetchFactures,
  } = useData({
    endpoint: API_FACTURE_ENDPOINT,
    name: `GET_FACTURE_${id}`,
    params: {
      expand: "proforma,paiements.banque",
      proforma__article__id: id,
      all: true,
    },
  });

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

