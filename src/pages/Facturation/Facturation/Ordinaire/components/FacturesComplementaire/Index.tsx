import { API_FACTURES_COMPLIMENTAIRE_ENDPOINT } from "@/api/api";
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
    data: factures,
    isLoading: isLoadingFactures,
    refetch: refetchFactures,
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
      headerTitle="Factures"
      // @ts-ignore
      options={{ reload: refetchFactures }}
      columns={getColumns()}
      loading={isLoadingFactures}
      dataSource={factures?.data}
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

