import { Space } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_PRESTATIONS_ARTICLE_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void) => [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    key: "rubrique",
    render: (rubrique: any) => rubrique?.designation,
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
  },
  {
    title: "Groupage",
    dataIndex: "groupage",
    key: "groupage",
    render: (groupage: boolean) => (groupage ? "Oui" : "Non"),
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
          url={API_PRESTATIONS_ARTICLE_ENDPOINT}
          class_name="Prestation article"
          id={record.id}
          refetch={refetch}
        />
      </Space>
    ),
  },
];
