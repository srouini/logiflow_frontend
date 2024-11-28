import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Tag } from "antd";
import { renderDate, renderDateTime, renderText } from "@/utils/functions";
import AUForm from "./components/AUForm";
import DeleteBulletin from "./components/DeleteBulletin";

interface Props {
  refetch: () => void,
  loaded: any,
  mrn:any
}
export const getColumns = ({refetch, loaded,mrn}:Props): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "1",
    width: 200,
    render: (_,record) => <AUForm initialvalues={record} mrn={mrn} key={record?.id} refetch={refetch} disabled={loaded}/> 
  },
  {
    title: "Type",
    dataIndex: "type_tc",
    key: "2",
    render: (record: any) =>
      record ? <Tag color="blue">{record?.designation}</Tag> : "-",
    width: 100,
  },
  {
    title: "Article",
    key: "3",
    dataIndex: "article",
    width: 100,
    render: (record: any) => renderText(record.numero),
  },
  {
    title: "Date chargement",
    key: "4",
    dataIndex: "date_sortie_port",
    width: 150,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Matricule",
    key: "5",
    dataIndex: "matricule_camion",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Scelle",
    key: "6",
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
    key: "7",
    fixed:"right",
    width: 60,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={
          <DeleteBulletin
          disabled={loaded}
          id={record?.id}
          refetch={refetch}
        />
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
