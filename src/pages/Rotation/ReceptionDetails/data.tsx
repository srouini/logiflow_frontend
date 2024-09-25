import type { ProColumns } from "@ant-design/pro-components";
import { Badge, Tag } from "antd";
import { renderDate, renderDateTime, renderText } from "@/utils/functions";
import AUForm from "./components/AUForm";

interface Props {
  refetch: () => void,
  loaded: any
}
export const getColumns = ({refetch, loaded}:Props): ProColumns<any>[] => [
  {
    title: "Reçu",
    dataIndex: "tc",
    key: "1",
    width: 60,
    render: (_,record) => record?.receved ? <Badge status="success" /> :  <Badge status="warning" />
  },
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "2",
    width: 200,
    render: (_,record) => <AUForm initialvalues={record}  key={record?.id} refetch={refetch} disabled={loaded}/> 
  },
  {
    title: "Type",
    dataIndex: "type_tc",
    key: "3",
    render: (record: any) =>
      record ? <Tag color="blue">{record?.designation}</Tag> : "-",
    width: 100,
  },
  {
    title: "Article",
    key: "4",
    dataIndex: "article",
    width: 100,
    render: (record: any) => renderText(record.numero),
  },
  {
    title: "Date réception",
    key: "5",
    dataIndex: "date_entree_port_sec",
    width: 200,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Chargé réception",
    key: "6",
    dataIndex: "receved_by",
    width: 300,
    render: (record: any) => renderText(record?.full_name),
  },
  {
    title: "Observation de réception",
    key: "7",
    dataIndex: "observation_reception",
    width: 300,
    ellipsis:true,
    render: (record: any) => renderText(record),
  },
  {
    title: "Date chargement",
    key: "8",
    dataIndex: "date_sortie_port",
    width: 200,
    render: (record: any) => renderDateTime(record),
  },
  {
    title: "Matricule",
    key: "9",
    dataIndex: "matricule_camion",
    width: 150,
    render: (record: any) => renderText(record),
  },
  {
    title: "Scelle",
    key: "10",
    dataIndex: "current_scelle",
    width: 150,
    render: (record: any) => renderText(record?.numero),
  },
  {
    title: "Observation de chargement",
    key: "11",
    ellipsis:true,
    dataIndex: "observation_chargement",
    width: 300,
    render: (record: any) => renderText(record),
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
      title: "Réception",
    },
  ],
};
