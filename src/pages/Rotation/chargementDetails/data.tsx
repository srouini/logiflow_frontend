import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { renderDate, renderDateTime, renderText } from "@/utils/functions";
import { SettingOutlined } from "@ant-design/icons";
import AUForm from "./components/AUForm";
import DeleteBulletin from "./components/DeleteBulletin";

interface Props {
  refetch: () => void,
  loaded: any
}
export const getColumns = ({refetch, loaded}:Props): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    width: 200,
    render: (_,record) => <AUForm initialvalues={record}  key={record?.id} refetch={refetch} disabled={loaded}/> 
  },
  {
    title: "Type",
    dataIndex: "type_tc",
    key: "type_tc",
    render: (record: any) =>
      record ? <Tag color="blue">{record?.designation}</Tag> : "-",
    width: 100,
  },
  {
    title: "Article",
    key: "article",
    dataIndex: "article",
    width: 100,
    render: (record: any) => renderText(record.numero),
  },
  {
    title: "Date chargement",
    key: "date_sortie_port",
    dataIndex: "date_sortie_port",
    width: 150,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Matricule",
    key: "matricule_camion",
    dataIndex: "matricule_camion",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Scelle",
    key: "current_scelle",
    dataIndex: "current_scelle",
    width: 150,
    render: (record: any) => renderText(record?.numero),
  },
  {
    title: "Observation",
    key: "observation_chargement",
    dataIndex: "observation_chargement",
    width: 300,
    render: (record: any) => renderText(record),
  },

  {
    title: "Actions",
    valueType: "option",
    key: "option",
    width: 80,
    render: (_, record: any) => [
      <TableDropdown
      
        key="actionGroup"
        menus={[
          {
            key: "delete",
            name: (
              <DeleteBulletin
                disabled={loaded}
                id={record?.id}
                refetch={refetch}
              />
            ),
          },
        ]}
        children={
          <Button
            style={{ width: "50px" }}
            icon={<SettingOutlined />}
            disabled={loaded}
            size="small"
          ></Button>
        }
      />,
    ],
  },
];

export const DetailsColumns = [
  {
    title: "Matricule",
    dataIndex: "bulletins",
    key: "bulletins",
    copyable: true,
  },

  {
    title: "Date",
    key: "date_creation",
    dataIndex: "date_creation",
    render: (record: any) => renderDate(record),
  },
  {
    title: "Mrn",
    key: "gros",
    dataIndex: "gros",
    width: 250,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "Etat",
    key: "loaded",
    dataIndex: "loaded",
    render: (record: any) =>
      record ? (
        <Tag color="green">Chargé</Tag>
      ) : (
        <Tag color="red">Non chargé</Tag>
      ),
  },
  {
    title: "Reçu",
    key: "receved",
    dataIndex: "receved",
    render: (record: any) =>
      record ? <Tag color="green">Reçu</Tag> : <Tag color="red">Non Reçu</Tag>,
  },
  {
    title: "Chargé par",
    key: "charge_chargement",
    dataIndex: "charge_chargement",
    render: (record: any) => renderText(record?.full_name),
  },

];

export const breadcrumb = {
  items: [
    {
      path: "",
      title: "Rotation",
    },
    {
      title: "Charegement",
    },
  ],
};
