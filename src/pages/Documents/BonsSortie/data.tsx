import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import {Col, Row } from "antd";
import { renderDate, renderText } from "@/utils/functions";
import { API_BONS_SORTIE_ENDPOINT } from "@/api/api";
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
    title: "Date sortie",
    dataIndex: "date_sortie",
    width: 150,
    render:(record:any) =>renderDate(record)
  },
  {
    title: "Date de création",
    dataIndex: "date_creation",
    render:(record:any) =>renderDate(record),
    width: 150,
  },
  {
    title: "Facture",
    dataIndex: "facture",
    render: (record:any) => renderText(record?.numero),
    width: 150,
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    render: record => renderDate(record),
    width: 100,
  },
  {
    title: "D10",
    dataIndex: "d10",
    width:200,
    render: (record:any) => renderText(record),
  },
  {
    title: "Badge",
    dataIndex: "badge",
    render: (record:any) => renderText(record),
    width: 200
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
                endpoint={API_BONS_SORTIE_ENDPOINT}
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_BONS_SORTIE_ENDPOINT}
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
