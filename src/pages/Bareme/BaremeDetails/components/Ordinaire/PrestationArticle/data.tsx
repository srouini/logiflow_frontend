import { Col, Row, Space, Tag } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_PRESTATIONS_ARTICLE_ENDPOINT } from "@/api/api";
import { TableDropdown } from "@ant-design/pro-components";

export const getColumns = (refetch: () => void) => [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    key: "rubrique",
    render: (rubrique: any) => rubrique?.designation,
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
  },
  {
    title: "groupage",
    key: "groupage",
    dataIndex: "groupage",
    render: (record:any) => record? <Tag color="blue"> Groupage </Tag> : <Tag> Ordinaire </Tag>
  },
  {
    title: "Actions",
    key: "action",
    fixed: "right",
    width: 100,
    render: (_: any, record: any) => 
    [
      <TableDropdown
      key="actionGroup"
      children={[
        <Row gutter={8}>
          <Col>
            <AUForm
              refetch={refetch}
              initialvalues={record}
              bareme={record.bareme}
              hasIcon={true}
              editText=""
            />
          </Col>
          <Col>
            <Delete
              url={API_PRESTATIONS_ARTICLE_ENDPOINT}
              class_name='Prestation Article'
              id={record.id}
              refetch={refetch}
              type="dashed"
              link={false}
              text=""
              has_icon
            />
          </Col>
        </Row>
      ]}
    />,
    ]
  },

];



export const columns = [
  {
    title: "Bareme",
    dataIndex: "bareme",
    key: "bareme",
    selected:true,
    schema: ["bareme","designation"],
  },
  {
    title: "Rubrique",
    key: "rubrique",
    dataIndex: "rubrique",
    selected:true, 
    schema: ["rubrique","designation"],
  },
  {
    title: "Groupage",
    dataIndex: "groupage",
    key: "groupage",
    selected:true, 
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
    selected:true, 
  }
]