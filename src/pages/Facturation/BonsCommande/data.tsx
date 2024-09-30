import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import {Col, Row } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import { API_BONS_COMMANDE_ENDPOINT } from "@/api/api";
import Print from "@/components/Print";

// @ts-ignore
export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "numero",
    copyable: true,
    width: 150,
    key:"1",
  },
  {
    title: "Date de création",
    dataIndex: "date_creation",
    key:"3",
    render:(record:any) =>renderDate(record),
    width: 150,
  },
  {
    title: "Mrn",
    dataIndex: "article",
    key:"4",
    render: (record:any) => renderText(record?.gros?.gros),
    width: 250,
  },
  {
    title: "Article",
    dataIndex: "article",
    key:"4",
    render: (record:any) => renderText(record?.numero),
    width: 80,
  },
  {
    title: "Client",
    dataIndex: "article",
    key:"5",
    render: (record:any) => renderText(record?.client?.raison_sociale),
    width: 350,
  },
{
    title: "Actions",
    valueType: "option",
    key: "8",
    align:"center",
    fixed:"right",
    width: 60,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
      style={{justifyItems:"center"

        
      }}
        children={
         [<Row gutter={8}>
            <Col>
            <Print
                endpoint={API_BONS_COMMANDE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_BONS_COMMANDE_ENDPOINT}
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
