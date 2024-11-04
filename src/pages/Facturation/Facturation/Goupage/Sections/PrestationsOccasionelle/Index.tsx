import { API_PRESTATIONS_OCCASIONNELLE_GROUPAGE_ENDPOINT } from "@/api/api";
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
    data,
    isLoading,
    refetch,
  } =  useData({
    endpoint: API_PRESTATIONS_OCCASIONNELLE_GROUPAGE_ENDPOINT,
    name: `GET_PRESTATIONS_OCCASIONNELLE_${id}`,
    params: {
      sous_article__id: id,
      all: true,
    },
  });

  return (
    <ProTable<any>
      headerTitle="Prestations Occasionnelle"
      // @ts-ignore
      options={{ reload: refetch }}
      columns={getColumns(refetch)}
      loading={isLoading}
      dataSource={data?.data}
      toolbar={{
        actions: [
         <AUForm article={article} refetch={refetch} />
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

