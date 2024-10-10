import { API_VISITES_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";


interface Props {
  id: string | undefined;
  article?:any
}
export default ({ id }: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } = useData({
    endpoint: API_VISITES_ENDPOINT,
    name: `GET_VISITES_${id}`,
    params: {
      expand:"transitaire",
      article__id: id,
      all: true,
    },
  });

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
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

