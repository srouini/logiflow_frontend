import { API_FACTURES_GROUPAGE_ENDPOINT } from "@/api/api"
import Print from "@/components/Print"
import { renderDate, renderMoney, renderText } from "@/utils/functions"
import { ProColumns, TableDropdown } from "@ant-design/pro-components"
import { Col, Row, Tag } from "antd"
import AUForm from "../FactureDetails/index"


// @ts-ignore
export const getColumns = ({refetch,isLoadingFacture}): ProColumns<any>[] => [
    {
      title: "Numéro",
      dataIndex: "numero",
      copyable: true,
      width: 150,
      key:"1",
      render: (_,record:any) => <AUForm  facture={record} key={record?.id} refetchFacture={refetch} isLoadingFacture={isLoadingFacture}/>
    },
    {
      title: "Etat",
      dataIndex: "numero",
      width: 150,
      key:"2",
      render:(_,record:any) => record?.paid ?  <Tag color="green"> Payée </Tag>: record?.a_terme ? <Tag>A Terme</Tag> : <Tag color="red">Non Payée</Tag>  
    },
    {
      title: "Date",
      dataIndex: "date_creation",
      key:"5",
      render: record => renderDate(record),
      width: 100,
    },
    {
      title: "Proforma",
      dataIndex: "proforma",
      key:"7",
      render: (record:any) => renderText(record?.numero),
      width: 150
    },
    {
      title: "HT",
      dataIndex: "HT",
      key:"8",
      render: (record: any) => renderMoney(record),
      width: 150
    },
    {
      title: "TVA",
      dataIndex: "TVA",
      key:"9",
      render: (record: any) => renderMoney(record),
      width: 150
    },
    {
      title: "Timber",
      dataIndex: "timber",
      key:"10",
      render: (record: any) => renderMoney(record),
      width: 150
    },
    {
      title: "TTC",
      dataIndex: "TTC",
      key:"11",
      render: (record: any) => renderMoney(record),
      width: 150
    },
    {
      title: "Actions",
      valueType: "option",
      key: "12",
      align:"center",
      width: 100,
      fixed:"right",
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
                  permission="billing.can_print_facturegroupage"
                />
              </Col>
              <Col>
              <Print
                  endpoint={API_FACTURES_GROUPAGE_ENDPOINT}
                  endpoint_suffex="generate_pdf/"
                  id={record?.id}
                  key={record?.id}
                  type="View"
                  permission="billing.can_print_facturegroupage"
                />
              </Col>
           </Row> 
          ]
          }
        />,
      ],
    },
]