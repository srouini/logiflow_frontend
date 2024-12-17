import { Col, Row, Space } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_PRESTATIONS_VISITE_GROUPAGE_ENDPOINT } from "@/api/api";
import { TableDropdown } from "@ant-design/pro-components";

export const getColumns = (refetch: () => void) => [
  {
    title: "Dangereux",
    dataIndex: "dangereux",
    key: "dangereux",
    render: (dangereux: boolean) => (dangereux ? "Oui" : "Non"),
  },
  {
    title: "Volume Min",
    dataIndex: "volume_min",
    key: "volume_min",
  },
  {
    title: "Volume Max",
    dataIndex: "volume_max",
    key: "volume_max",
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
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
              url={API_PRESTATIONS_VISITE_GROUPAGE_ENDPOINT}
              class_name='Prestation visite'
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
  }
];
