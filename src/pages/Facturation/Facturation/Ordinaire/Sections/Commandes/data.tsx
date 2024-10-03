import { API_BONS_COMMANDE_ENDPOINT } from "@/api/api"
import Print from "@/components/Print"
import { renderText } from "@/utils/functions"
import { ProColumns, TableDropdown } from "@ant-design/pro-components"
import { Col, Row } from "antd"

export const getColumns = (): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "bon_commande",
    width: 150,
    key:"1",
    render: (record:any) => renderText(record?.numero)
  },
  {
    title: "Article",
    dataIndex: "bon_commande",
    key:"4",
    render: (record:any) => renderText(record?.article?.numero),
    width: 80,
  },
  {
    title: "Tc",
    dataIndex: "tc",
    width: 150,
    key:"2",
    render:(record:any) => renderText(record?.tc)
  },
  {
    title: "Type",
    dataIndex: "type",
    key:"5",
    render: record => renderText(record),
    width: 100,
  },

  {
    title: "Quantité",
    dataIndex: "quantite",
    key:"7",
    render: (record: any) => renderText(record),
    width: 150
  },
  {
    title: "Observation",
    dataIndex: "observation",
    key:"8",
    render: (record: any) => renderText(record),
    width: 150
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
                id={record?.bon_commande?.id}
                key={record?.bon_commande?.id}
                type="Download"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_BONS_COMMANDE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.bon_commande?.id}
                key={record?.bon_commande?.id}
                type="View"
              />
            </Col>
         </Row> 
        ]
        }
      />,
    ],
  },
]