import { API_PRESTATIONS_OCCASIONNELLE_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  id: string | undefined;
  article?:any
}
export default ({ id, article }: Props) => {
  const {
    data,
    isLoading,
    refetch,
  } =  useData({
    endpoint: API_PRESTATIONS_OCCASIONNELLE_ENDPOINT,
    name: `GET_PRESTATIONS_OCCASIONNELLE_${id}`,
    params: {
      expand: "tc",
      tc__article__id: id,
      all: true,
    },
  });

  return (
    <ProTable<any>
      headerTitle="Prestations Occasionnelle"
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

