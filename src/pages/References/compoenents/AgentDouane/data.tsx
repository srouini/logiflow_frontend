import { TableDropdown } from "@ant-design/pro-components";
import { Tag } from "antd";
import { renderText } from "@/utils/functions";
import { API_AGENT_DOUANE_ENDPOINT } from "@/constants/reference";
import Delete from "@/components/Delete";
import AUForm from "./AUForm";

export const getColumns = (refetch: () => void) => [
  {
    title: "Nom",
    dataIndex: "nom",
    copyable: true,
    ellipsis: true,
    key: "1",
    width: 200,
    selected: false,
  },
  {
    title: "Prénom",
    dataIndex: "prenom",
    ellipsis: true,
    key: "2",
    width: 200,
    selected: true,
  },
  {
    title: "Code",
    ellipsis: true,
    key: "3",
    dataIndex: "code",
    width: 150,
    selected: true,
  },
  {
    title: "Actif",
    dataIndex: "active",
    ellipsis: false,
    key: "4",
    width: 100,
    render: (record: boolean) => 
      record ? <Tag color="green">Actif</Tag> : <Tag color="red">Inactif</Tag>,
    selected: true,
  },
  {
    title: "Actions",
    valueType: "option",
    key: "5",
    fixed: "right",
    width: 100,
    render: (text: any, record: any) => [
      <AUForm key="edit" refetch={refetch} initialvalues={record} />,
      <Delete
        key="delete"
        endpoint={`${API_AGENT_DOUANE_ENDPOINT}${record.id}/`}
        refetch={refetch}
      />,
    ],
  },
];

export const columns = [
  {
    title: "Nom",
    dataIndex: "nom",
    copyable: true,
    ellipsis: true,
    key: "1",
    width: 200,
    selected: true,
  },
  {
    title: "Prénom",
    dataIndex: "prenom",
    ellipsis: true,
    key: "2",
    width: 200,
    selected: true,
  },
  {
    title: "Code",
    ellipsis: true,
    key: "3",
    dataIndex: "code",
    width: 150,
    selected: false,
  },
  {
    title: "Actif",
    dataIndex: "active",
    ellipsis: true,
    key: "4",
    width: 100,
    render: (record: boolean) => 
      record ? <Tag color="green">Actif</Tag> : <Tag color="red">Inactif</Tag>,
    selected: false,
  },
];
