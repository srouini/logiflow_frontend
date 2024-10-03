import { API_VISITES_ENDPOINT } from "@/api/api";
import useData from "@/hooks/useData";
import { ProTable } from "@ant-design/pro-components";
import { getColumns } from "./data";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  id: string | undefined;
  article?:any
}
export default ({ id,article }: Props) => {
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

