import { API_BONS_COMMANDE_ENDPOINT } from "@/api/api"
import Print from "@/components/Print"
import { renderDate } from "@/utils/functions"
import { ProColumns, TableDropdown } from "@ant-design/pro-components"
import { Col, Row } from "antd"

export const getColumns = (): ProColumns<any>[] => [
  {
    title: "Numéro",
    dataIndex: "numero",
    key:"1",
  },
  {
    title: "Date",
    dataIndex: "date_creation",
    key:"2",
    render: (record:any) => renderDate(record),
  },
  
  {
    title: "Actions",
    valueType: "option",
    key: "8",
    align:"center",
    fixed:"right",
    width: 150,
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
]