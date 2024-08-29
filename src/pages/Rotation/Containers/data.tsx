import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import Ajouter from "./components/AUForm";
import {  SettingOutlined } from "@ant-design/icons";
import Delete from "@/components/Delete";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [

  {
    title:"Numero",
    dataIndex:"numero",
    key:"numero",
    width:100,
    ellipsis: true,
},
{
  title: "BL",
  key:"bl",
  dataIndex: "bl",
  width:150,
  render: (record:any) => renderText(record)
},
  {
    title: "Groupage",
    key:"groupage",
    dataIndex: "groupage",
    width:120,
    render: (record:any) => record ?<Tag color="blue" > Groupage </Tag> : <Tag> Ordinaire </Tag>
  },
  {
    title: "Client",
    key:"client",
    dataIndex: "client",
    width:300,
    render: (record:any) => renderText(record?.raison_sociale)
  },
  {
    title: "Designation",
    key:"designation",
    dataIndex: "designation",
    ellipsis:true,
    width:350,
    render: (record:any) => renderText(record)
  },
  {
    title: "Transitaire",
    key:"transitaire",
    width:300,
    dataIndex: "transitaire",
    render: (record:any) => renderText(record?.raison_sociale)
  },
  {
    title: "Depoté",
    key:"depote",
    width:100,
    dataIndex: "depote",
    render: (_,record:any) => record.depote && record.groupage ?<Tag color="green" > Depté </Tag> :  record.groupage ? <Tag color="red" > Non depoté </Tag> : "-"
  },
  {
    title:"Date dépotage",
    dataIndex:"date_depotage",
    key:"date_depotage",
    width:150,
    render:(record) => renderDate(record),
},
  {
    title: "Actions",
    valueType: "option",
    key: "option",
    width:80,
    render: (_,record:any) => [

      <TableDropdown
        key="actionGroup"
        menus={[
          { key: "delete", name: <Delete url="/api/data/gros/" id={record?.id}  refetch={refetch} class_name="MRN"/> },
          { key: "Ajouter", name: <Ajouter initialvalues={record} refetch={refetch}></Ajouter>},
        ]}
        children={<Button style={{width:"50px"}} icon={<SettingOutlined />} size="small"></Button>}
      />,
    ],
  },
];


export const DetailsColumns = [
  {
      title: "Numéro",
      dataIndex: "gros",
      copyable: true,
      ellipsis: false,
      tooltip: "Gros",
    },
    {
      title: "Regime",
      dataIndex: "regime",
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
      dataIndex: "accostage",
    },
    {
      title: "Escale",
      ellipsis: true,
      dataIndex: "escale",
    },
    {
      title: "Navire",
      dataIndex: "navire",
      ellipsis: false,
      render: (record: any) => renderText(record?.nom),
    },
    {
      title: "Armasteur",
      dataIndex: "armateur",
      ellipsis: false,
      render: (record: any) => renderText(record?.raison_sociale),
    },
    {
      title: "Consignataire",
      dataIndex: "consignataire",
      ellipsis: false,
      render: (record: any) => renderText(record?.raison_sociale),
    },
]