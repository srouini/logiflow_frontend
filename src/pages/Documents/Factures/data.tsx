import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import {Col, Row, Tag } from "antd";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import { API_FACTURE_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";

// @ts-ignore
export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "numero",
    copyable: true,
    width: 150,
  },
  {
    title: "Etat",
    dataIndex: "numero",
    width: 150,
    render:(_,record:any) => record?.paid ?  <Tag color="green"> Payée </Tag>: record?.a_terme ? <Tag>A Terme</Tag> : <Tag color="red">Non Payée</Tag>  
  },
  {
    title: "Mrn",
    dataIndex: "proforma",
    render: (record:any) => renderText(record?.gros?.gros),
    width: 250,
  },
  {
    title: "Article",
    dataIndex: "proforma",
    render: (record:any) => renderText(record?.article?.numero),
    width: 100,
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    render: record => renderDate(record),
    width: 100,
  },
  {
    title: "Client",
    dataIndex: "proforma",
    width:300,
    render: (record:any) => renderText(record?.article?.client?.raison_sociale)
  },
  {
    title: "Proforma",
    dataIndex: "proforma",
    render: (record:any) => renderText(record?.numero),
    width: 150
  },
  {
    title: "HT",
    dataIndex: "HT",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "Timber",
    dataIndex: "timber",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "Actions",
    valueType: "option",
    key: "option",
    align:"center",
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
                endpoint={API_FACTURE_ENDPOINT}
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_FACTURE_ENDPOINT}
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
