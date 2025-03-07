import { API_BONS_COMMANDE_ENDPOINT } from "@/api/api"
import Delete from "@/components/Delete"
import Print from "@/components/Print"
import { renderDate } from "@/utils/functions"
import { ProColumns, TableDropdown } from "@ant-design/pro-components"
import { Col, Row } from "antd"

export const getColumns = (refetch:() => void): ProColumns<any>[] => [
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
                permission="billing.can_print_boncommande"
              />
            </Col>
            <Col>
            <Print
                endpoint={API_BONS_COMMANDE_ENDPOINT}
                endpoint_suffex="generate_pdf/"
                id={record?.id}
                key={record?.id}
                type="View"
                permission="billing.can_print_boncommande"
              />
            </Col>
            <Col>
            <Delete permission="billing.delete_boncommande" class_name="Bon commande" id={record?.id} refetch={refetch} url={API_BONS_COMMANDE_ENDPOINT} has_icon type="dashed" link={false} text="" />
            </Col>
         </Row> 
        ]
        }
      />,
    ],
  },
]