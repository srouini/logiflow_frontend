import { Col, Row, Tag } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT } from "@/api/api";
import { TableDropdown } from "@ant-design/pro-components";

export const getColumns = (refetch: () => void) => [
  {
    title: "Dangereux",
    dataIndex: "dangereux",
    key: "dangereux",
    render: (record: any) =>{ return (
      <>
        {record ? <Tag color="red"> DGX </Tag> : <Tag color=""> Ordinaire </Tag>}
      </>
    )}
  },
  {
    title: "Jour Min",
    dataIndex: "jour_min",
    key: "jour_min",
  },
  {
    title: "Jour Max",
    dataIndex: "jour_max",
    key: "jour_max",
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
              url={API_SEJOURS_SOUS_ARTICLE_GROUPAGE_ENDPOINT}
              class_name='Sejour sous article'
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
    title: "Jour min",
    dataIndex: "jour_min",
    key: "jour_min",
    selected:true, 
  },
  {
    title: "Jour max",
    dataIndex: "jour_max",
    key: "jour_max",
    selected:true, 
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
    selected:true, 
  }
]