import { API_FACTURES_COMPLIMENTAIRE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import AUForm from "./components/AUForm";

interface Props {
  id: string | undefined;
  article?:any
}
export default ({ id,article }: Props) => {
  const {
    data: factures,
    isLoading: isLoadingFactures,
    refetch,
  } = useData({
    endpoint: API_FACTURES_COMPLIMENTAIRE_ENDPOINT,
    name: `GET_FACTURES_COMPLIMENTAIRE_${id}`,
    params: {
      expand: "facture",
      facture__proforma__article__id: id,
      all: true,
    },
  });


  return (
    <ProTable<any>
      headerTitle="Factures complimentaire"
      // @ts-ignore
      options={{ reload: refetch }}
      columns={getColumns({refetch,isLoadingFacture:isLoadingFactures})}
      loading={isLoadingFactures}
      dataSource={factures?.data}
      toolbar={{
        actions: [
          <AUForm article={article} refetch={refetch}  key={id}/>
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

