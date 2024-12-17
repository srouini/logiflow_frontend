import { Col, Row, Space } from "antd";
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
    title: "Groupage",
    dataIndex: "groupage",
    key: "groupage",
    render: (groupage: boolean) => (groupage ? "Oui" : "Non"),
  },
  {
    title: "Actions",
    key: "action",
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
            />,
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
