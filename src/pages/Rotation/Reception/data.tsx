import type { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import DetailsButton from "@/components/DetailsButton";

// @ts-ignore
export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numero",
    dataIndex: "bulletins",
    key: "1",
    width: 250,
    render: (_, record) => (
      <DetailsButton
        text={record.bulletins}
        navigate_to={`/rotations/reception/${record?.id}`}
      />
    ),
  },
  {
    title: "Date",
    key: "2",
    dataIndex: "date_creation",
    render: (record: any) => renderDate(record),
  },
  {
    title: "Mrn",
    key: "3",
    dataIndex: "gros",
    width: 250,
    render: (record: any) => renderText(record?.gros),
  },
  {
    title: "Etat",
    key: "4",
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
    key: "5",
    dataIndex: "receved",
    render: (record: any) =>
      record ? <Tag color="green">Reçu</Tag> : <Tag color="red">Non Reçu</Tag>,
  },
  {
    title: "Chargé par",
    key: "6",
    dataIndex: "charge_chargement",
    render: (record: any) => renderText(record?.full_name),
  },
  {
    title: "Reçu par",
    key: "7",
    dataIndex: "charge_reception",
    render: (record: any) => renderText(record?.full_name),
  },

];


export const columns = [
  {
    title: "Numero",
    dataIndex: "bulletins",
    key: "1",
    selected:true
  },
  {
    title: "Date de création",
    key: "2",
    dataIndex: "date_creation",
    selected:true
  },
  {
    title: "Mrn",
    key: "3",
    dataIndex: "gros",
    selected:true, 
    schema:["gros","gros"]
  },
  {
    title: "Etat",
    key: "4",
    dataIndex: "loaded",
    selected:true,

  },
  {
    title: "Reçu",
    key: "5",
    dataIndex: "receved",
    selected:true
  },
  {
    title: "Chargé par",
    key: "6",
    dataIndex: "charge_chargement",
    selected:true,
    schema:["charge_chargement","full_name"]
  },
  {
    title: "Reçu par",
    key: "7",
    dataIndex: "charge_reception",
    selected:true,
    schema:["charge_reception","full_name"]
  },

];