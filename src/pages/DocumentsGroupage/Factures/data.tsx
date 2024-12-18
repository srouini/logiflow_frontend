import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import {Col, Row, Tag } from "antd";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import {  API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api";
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
    dataIndex: "numero",
    width: 150,
    key:"2",
    render:(_,record:any) => record?.paid ?  <Tag color="green"> Payée </Tag>: record?.a_terme ? <Tag>A Terme</Tag> : <Tag color="red">Non Payée</Tag>  
  },
  {
    title: "Mrn",
    dataIndex: "proforma",
    key:"3",
    render: (record:any) => renderText(record?.gros?.gros),
    width: 250,
  },
  {
    title: "Article",
    dataIndex: "proforma",
    key:"4",
    render: (record:any) => renderText(record?.article?.numero),
    width: 100,
  },
  {
    title: "Sous Article",
    dataIndex: "proforma",
    key:"5",
    render: (record:any) => renderText(record?.sous_article?.numero),
    width: 100,
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    key:"6",
    render: record => renderDate(record),
    width: 100,
  },
  {
    title: "Client",
    dataIndex: "proforma",
    width:300,
    key:"7",
    render: (record:any) => renderText(record?.sous_article?.client?.raison_sociale)
  },
  {
    title: "Groupeur",
    dataIndex: "proforma",
    width:300,
    key:"7",
    render: (record:any) => renderText(record?.article?.client?.raison_sociale)
  },
  {
    title: "Proforma",
    dataIndex: "proforma",
    key:"8",
    render: (record:any) => renderText(record?.numero),
    width: 150
  },
  {
    title: "HT",
    dataIndex: "HT",
    key:"9",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    key:"10",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "Timber",
    dataIndex: "timber",
    key:"11",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    key:"12",
    render: (record: any) => renderMoney(record),
    width: 150
  },
  {
    title: "Actions",
    valueType: "option",
    key: "13",
    fixed:"right",
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
                endpoint={API_FACTURES_GROUPAGE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_FACTURES_GROUPAGE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
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

export const exportColumns = [
  {
    title: "Numéro",
    dataIndex: "numero",
    key: "numero",
    selected: true
  },
  {
    title: "Etat",
    dataIndex: "paid",
    key: "etat",
    selected: true
  },
  {
    title: "Mrn",
    dataIndex: "proforma",
    key: "mrn",
    schema: ["proforma", "gros", "gros"],
    selected: true
  },
  {
    title: "Article",
    dataIndex: "proforma",
    key: "article",
    schema: ["proforma", "article", "numero"],
    selected: true
  },
  {
    title: "Sous Article",
    dataIndex: "proforma",
    key: "sous_article",
    schema: ["proforma", "sous_article", "numero"],
    selected: true
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    key: "date",
    selected: true
  },
  {
    title: "Client",
    dataIndex: "proforma",
    key: "client",
    schema: ["proforma", "sous_article", "client", "raison_sociale"],
    selected: true
  },
  {
    title: "Groupeur",
    dataIndex: "proforma",
    width:300,
    key:"groupeur",
    schema: ["proforma","article","client","raison_sociale"]
  },
  {
    title: "Proforma",
    dataIndex: "proforma",
    key: "proforma_num",
    schema: ["proforma", "numero"],
    selected: true
  },
  {
    title: "HT",
    dataIndex: "HT",
    key: "ht",
    selected: true
  },
  {
    title: "TVA",
    dataIndex: "TVA",
    key: "tva",
    selected: true
  },
  {
    title: "Timber",
    dataIndex: "timber",
    key: "timber",
    selected: true
  },
  {
    title: "TTC",
    dataIndex: "TTC",
    key: "ttc",
    selected: true
  }
];
