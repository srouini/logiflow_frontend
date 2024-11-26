import { API_FACTURES_AVOIRE_GROUPAGE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import AUFrom from "./components/AUForm"

interface Props {
  id: string | undefined;
  article?:any
}
export default ({ id,article }: Props) => {
  const {
    data: factures,
    isLoading: isLoadingFactures,
    refetch: refetchFactures,
  } = useData({
    endpoint: API_FACTURES_AVOIRE_GROUPAGE_ENDPOINT,
    name: `GET_FACTURES_AVOIRE_GROUPAGE_${id}`,
    params: {
      expand: "facture",
      facture__proforma__sous_article__id: id,
      all: true,
    },
  });

  return (
    <ProTable<any>
      headerTitle="Factures Avoire"
      // @ts-ignore
      options={{ reload: refetchFactures }}
      columns={getColumns({refetch:refetchFactures,isLoadingFacture:isLoadingFactures})}
      loading={isLoadingFactures}
      dataSource={factures?.data}
      toolbar={{
        actions: [
          <AUFrom  article={article} refetch={refetchFactures} key={id}/>,
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};
