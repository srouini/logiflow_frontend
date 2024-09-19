import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import { SettingOutlined } from "@ant-design/icons";
import { API_CONTENEURS_ENDPOINT } from "@/api/api";
import React from "react";
import SubArticlePage from "../ContainerDetails";

const Delete = React.lazy(() => import('@/components/Delete'));
const Ajouter = React.lazy(() => import('./components/AUForm'));

export const getColumns = (refetch: () => void, article:any): ProColumns<any>[] => [
  {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    width: 100,
    render: (_,record) => article?.groupage ? <SubArticlePage container={record} columns={columns} /> : record?.tc
  },
  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    width: 150,
    render: (record:any) => <Tag color="blue" > {record?.designation} </Tag>
  },
  {
    title: "Tar",
    key: "tar",
    dataIndex: "tar",
    width: 150,
  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    width: 120,
  },
  {
    title: "Nature",
    key: "dangereux",
    dataIndex: "dangereux",
    width: 150,
    render: (_,record:any) => <> {record.dangereux ? <Tag color="red" > DGX </Tag> :""} {record.frigo ? <Tag color="blue" > FRIGO </Tag> :""}</>
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
              <Delete
                url={API_CONTENEURS_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Conteneur"
              />
            ),
          },
          {
            key: "Ajouter",
            name: <Ajouter initialvalues={record} refetch={refetch} article={record?.article}></Ajouter>,
          },
        ]}
        children={
          <Button
            style={{ width: "50px" }}
            icon={<SettingOutlined />}
            size="small"
          ></Button>
        }
      />,
    ],
  },
];

export const columns = [ {
    title: "Matricule",
    dataIndex: "tc",
    key: "tc",
    width: 100,
  },
  {
    title: "Type",
    key: "type_tc",
    dataIndex: "type_tc",
    width: 150,
    render: (record:any) => <Tag color="blue" > {record?.designation} </Tag>
  },
  {
    title: "Tar",
    key: "tar",
    dataIndex: "tar",
    width: 150,
  },
  {
    title: "Poids",
    key: "poids",
    dataIndex: "poids",
    width: 120,
    render: (record: any) => record + " kg",
  },
  {
    title: "Nature",
    key: "dangereux",
    dataIndex: "dangereux",
    width: 150,
    render: (_,record:any) => <> {record.dangereux ? <Tag color="red" > DGX </Tag> :""} {record.frigo ? <Tag color="blue" > FRIGO </Tag> :""}</>
  }];


export const DetailsColumns = [
  {
    title:"Mrn",
    dataIndex:"gros",
    key:"gros",
    width:100,
    render: (record:any) => renderText(record?.gros)
},
{
  title: "BL",
  key:"bl",
  dataIndex: "bl",
  width:150,
  render: (record:any) => renderText(record)
},
{
  title: "Client",
  key:"client",
  dataIndex: "client",
  width:300,
  render: (record:any) => renderText(record?.raison_sociale)
},
  {
    title: "Groupage",
    key:"groupage",
    dataIndex: "groupage",
    width:120,
    render: (record:any) => record ?<Tag color="blue" > Groupage </Tag> : <Tag> Ordinaire </Tag>
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
    render:(record:any) => renderDate(record),
},

{
  title: "Transitaire",
  key:"transitaire",
  width:300,
  dataIndex: "transitaire",
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
]

export const breadcrumb: any = {
  items: [
    {
      title: "Rotation",
    },
    {
      title: "Mrns",
    },
    {
      title: "Articles",
    },
    {
      title: "Containers",
    },
  ],
};