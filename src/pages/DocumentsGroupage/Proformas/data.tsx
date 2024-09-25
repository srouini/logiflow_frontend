import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import {Col, Row, Tag } from "antd";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import { API_PROFORMAS_GROUPAGE_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";


// @ts-ignore
export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "numero",
    copyable: true,
    key:"1",
    width: 150,
  },
  {
    title: "Etat",
    dataIndex: "valide",
    width: 150,
    key:"2",
    render:(_,record:any) => record?.trashed? <Tag > Annulé </Tag> : record?.valide ?  <Tag color="green"> Valide </Tag>:  <Tag color="red">Non Valide</Tag>  
  },
  {
    title: "Mrn",
    dataIndex: "gros",
    key:"3",
    render: (record:any) => renderText(record?.gros),
    width: 250,
  },
  {
    title: "Article",
    dataIndex: "article",
    key:"4",
    render: (record:any) => renderText(record?.numero),
    width: 100,
  },
  {
    title: "Date",
    dataIndex: "date_proforma",
    key:"5",
    render: record => renderDate(record),
    width: 100,
  },
  {
    title: "Client",
    dataIndex: "article",
    width:300,
    key:"6",
    render: (record:any) => renderText(record?.client?.raison_sociale)
  },

  {
    title: "HT",
    dataIndex: "HT",
    key:"7",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    key:"8",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    key:"9",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "Actions",
    valueType: "option",
    key: "10",
    align:"center",
    fixed:"right",
    width: 100,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
      style={{justifyItems:"center"

        
      }}
        children={
         [<Row gutter={8}>
            <Col>
            <Print
                endpoint={API_PROFORMAS_GROUPAGE_ENDPOINT}
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_PROFORMAS_GROUPAGE_ENDPOINT}
                id={record?.id}
                key={record?.id}
                type="View"
              />
            </Col>
         </Row> 
        ]
        }
      />,
    ],
  },
];
