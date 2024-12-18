import { Col, Row, Space, Tag } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_PRESTATIONS_VISITE_GROUPAGE_ENDPOINT } from "@/api/api";
import { TableDropdown } from "@ant-design/pro-components";

export const getColumns = (refetch: () => void) => [
  {
    title: "Dangereux",
    dataIndex: "dangereux",
    key: "dangereux",
    render: (record: boolean) => record ? <Tag color="red"> DGX </Tag> : <Tag color=""> Ordinaire </Tag>,
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


export const columns = [
  {
    title: "Bareme",
    dataIndex: "bareme",
    key: "bareme",
    selected:true,
    schema: ["bareme","designation"],
  },
  {
    title: "DGX",
    dataIndex: "dangereux",
    key: "dangereux",
    selected:true, 
  },
  {
    title: "Volume max",
    key: "volume_min",
    dataIndex: "volume_min",
    selected:true, 
  },
  {
    title: "Volume max",
    dataIndex: "volume_max",
    key: "volume_max",
    selected:true, 
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
    selected:true, 
  }
]