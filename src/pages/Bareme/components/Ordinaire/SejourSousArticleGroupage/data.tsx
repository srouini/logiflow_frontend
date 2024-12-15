import { Space } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void) => [
  {
    title: "Dangereux",
    dataIndex: "dangereux",
    key: "dangereux",
    render: (dangereux: boolean) => (dangereux ? "Oui" : "Non"),
  },
  {
    title: "Jour Min",
    dataIndex: "jour_min",
    key: "jour_min",
  },
  {
    title: "Jour Max",
    dataIndex: "jour_max",
    key: "jour_max",
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
  },
  {
    title: "Actions",
    key: "action",
    render: (_: any, record: any) => (
      <Space size="middle">
        <AUForm
          refetch={refetch}
          initialvalues={record}
          bareme={record.bareme}
          editText="MODIFIER"
          hasIcon={true}
        />
        <Delete
          url={API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT}
          class_name="Sejour sous article"
          id={record.id}
          refetch={refetch}
        />
      </Space>
    ),
  },
];
