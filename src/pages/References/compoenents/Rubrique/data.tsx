import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderText } from "@/utils/functions";
import { API_TRANSITAIRE_ENDPOINT } from "@/api/api";
import Delete from "@/components/Delete";
import AUForm from "./AUForm";

export const getColumns = (refetch: () => void) => [
  {
    title: "Designation",
    dataIndex: "designation",
    key:"designation",
    copyable:true
  },
  {
    title: "Type Calcule",
    dataIndex: "type_calcule",
    key:"type_calcule",
  },
  {
    title: "Categorie",
    dataIndex: "categorie",
    key:"categorie",
  },
  {
    title: "Direction",
    dataIndex: "direction",
    key:"direction",
    render: (record: any) => <Tag color="green">{renderText(record?.nom)}</Tag>
  },
  {
    title: "Actions",
    valueType: "option",
    key: "11",
    width: 100,
    fixed:"right",
    // @ts-ignore
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Delete
                url={API_TRANSITAIRE_ENDPOINT}
                id={record?.id}
                refetch={refetch}
                class_name="Transitaire"
                type="dashed"
                link={false}
                text=""
                has_icon
              />
            </Col>
            <Col>
              <AUForm
                initialvalues={record}
                refetch={refetch}
              /> 
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];



export const columns = [
  {
    title: "Designation",
    dataIndex: "designation",
    key:"designation",
    selected:true
  },
  {
    title: "Type Calcule",
    dataIndex: "type_calcule",
    key:"type_calcule",
    selected:true
  },
  {
    title: "Categorie",
    dataIndex: "categorie",
    key:"categorie",
    selected:true
  },
]
