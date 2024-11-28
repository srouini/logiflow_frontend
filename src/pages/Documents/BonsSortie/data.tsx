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
    key:"1",
  },
  {
    title: "Date sortie",
    dataIndex: "date_sortie",
    width: 150,
    key:"2",
    render:(record:any) =>renderDate(record)
  },
  {
    title: "Date de création",
    dataIndex: "date_creation",
    key:"3",
    render:(record:any) =>renderDate(record),
    width: 150,
  },
  {
    title: "Facture",
    dataIndex: "facture",
    key:"4",
    render: (record:any) => renderText(record?.numero),
    width: 150,
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    key:"5",
    render: record => renderDate(record),
    width: 100,
  },
  {
    title: "D10",
    dataIndex: "d10",
    width:200,
    key:"6",
    render: (record:any) => renderText(record),
  },
  {
    title: "Badge",
    dataIndex: "badge",
    key:"7",
    render: (record:any) => renderText(record),
    width: 200
  },
  {
    title: "Actions",
    valueType: "option",
    key: "8",
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
                endpoint={API_BONS_SORTIE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_BONS_SORTIE_ENDPOINT}
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
    title: "Date sortie",
    dataIndex: "date_sortie",
    key: "date_sortie",
    selected: true
  },
  {
    title: "Date de création",
    dataIndex: "date_creation",
    key: "date_creation",
    selected: true
  },
  {
    title: "Facture",
    dataIndex: "facture",
    key: "facture",
    schema: ["facture", "numero"],
    selected: true
  },
  {
    title: "D10",
    dataIndex: "d10",
    key: "d10",
    selected: true
  },
  {
    title: "Badge",
    dataIndex: "badge",
    key: "badge",
    selected: true
  }
];
