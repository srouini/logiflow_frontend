import type { ProColumns } from "@ant-design/pro-components";
import {  Tag } from "antd";
import { renderText } from "@/utils/functions";
import DetailsButton from "@/components/DetailsButton";

export const getColumns = (): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "gros",
    copyable: true,
    ellipsis: false,
    tooltip: "Gros",
    key:"1",
    render: (_, record) => (
      <DetailsButton
        text={record.gros}
        navigate_to={`/facturation/mrns/${record?.id}`}
        key={record?.id}
      />
    ),
    width: 250,
  },
  {
    title: "Regime",
    dataIndex: "regime",
    key:"2",
    render: (record: any) => (
      <Tag color={record.color ? record?.color : "blue"}>
        {" "}
        {record?.designation}{" "}
      </Tag>
    ),
  },
  {
    title: "Accostage",
    ellipsis: true,
    key:"3",
    dataIndex: "accostage",
  },
  {
    title: "Escale",
    ellipsis: true,
    key:"4",
    dataIndex: "escale",
  },
  {
    title: "Navire",
    dataIndex: "navire",
    ellipsis: false,
    key:"5",
    render: (record: any) => renderText(record?.nom),
  },
  {
    title: "Armasteur",
    dataIndex: "armateur",
    ellipsis: false,
    key:"6",
    render: (record: any) => renderText(record?.raison_sociale),
  },
  {
    title: "Consignataire",
    dataIndex: "consignataire",
    ellipsis: false,
    key:"7",
    render: (record: any) => renderText(record?.raison_sociale),
  },

];
