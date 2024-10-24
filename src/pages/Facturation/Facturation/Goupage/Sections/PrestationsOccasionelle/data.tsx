
import { API_PRESTATIONS_OCCASIONNELLE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import { renderDate, renderMoney, renderText } from "@/utils/functions";
import { ProColumns, TableDropdown } from "@ant-design/pro-components";
import { Col, Row } from "antd";

export const getColumns = (refetch:() => void): ProColumns<any>[] => [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    copyable: true,
    width: 300,
    key: "1",
  },
  {
    title: "Conteneur",
    dataIndex: "tc",
    width: 200,
    key: "2",
    render: (record: any) => renderText(record?.tc)
      
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "5",
    render: (record) => renderDate(record),
    width: 200,
  },

  {
    title: "Montant",
    dataIndex: "prix",
    key: "7",
    render: (record: any) => renderMoney(record),
    width: 200,
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
              <Delete disabled={record?.tc?.billed} class_name="Prestation occasionnelle" id={record?.id} refetch={refetch} url={API_PRESTATIONS_OCCASIONNELLE_ENDPOINT} has_icon type="dashed" link={false} text="" />
            </Col>
         </Row> 
        ]
        }
      />,
    ],
  },
];
