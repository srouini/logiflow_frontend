import { API_COMMANDES_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  id: string | undefined;
}
export default ({ id }: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } = useData({
    endpoint: API_COMMANDES_ENDPOINT,
    name: `GET_COMMANDE_${id}`,
    params: {
      expand: "bon_commande.article,tc",
      bon_commande__article__id: id,
      all: true,
    },
  });


  return (
    <ProTable<any>
      headerTitle="Commandes"
      // @ts-ignore
      options={{ reload: refetch }}
      columns={getColumns()}
      loading={isLoading}
      dataSource={data?.data}
      toolbar={{
        actions: [
          <Button
            key="primary"
            type="primary"
            onClick={() => {
              alert("add");
            }}
            icon={<PlusOutlined />}
            style={{ paddingLeft: "20px", paddingRight: "20px" }}
          ></Button>,
        ],
      }}
      rowKey={(item) => item?.id}
      search={false}
    />
  );
};

