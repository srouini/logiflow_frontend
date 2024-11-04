import { API_VISITESGROUPAGE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import AUForm from "@/pages/Visite/Groupage/components/AUForm";


interface Props {
  id: string | undefined;
  article?:any
}
export default ({ article,id }: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } = useData({
    endpoint: API_VISITESGROUPAGE_ENDPOINT,
    name: `GET_VISITES_${id}`,
    params: {
      expand:"transitaire",
      sous_article__id: id,
      all: true,
    },
  });
console.log(article)
  return (
    <ProTable<any>
      headerTitle="Visites"
      // @ts-ignore
      options={{ reload: refetch }}
      columns={getColumns()}
      loading={isLoading}
      dataSource={data?.data}
      toolbar={{
        actions: [
           <AUForm disabled={article?.billed} refetch={refetch} addText="Viste" editText="Visite" hasIcon gros={article?.tc?.article?.gros?.id} initialvalues={{gros:article?.tc?.article?.gros?.id,article:article?.tc?.article?.id,sous_article:article?.id,type_visite:"Visite douane"}}/>
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

