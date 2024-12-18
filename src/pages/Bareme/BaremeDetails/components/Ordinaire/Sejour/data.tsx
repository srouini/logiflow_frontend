import { Col, Row, Tag } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_SEJOURS_ENDPOINT } from "@/api/api";
import { TableDropdown } from "@ant-design/pro-components";
import { renderText } from "@/utils/functions";

export const getColumns = (refetch: () => void) => [
  {
    title: "Type Tc",
    key: "type_tc",
    dataIndex: "type_tc",
    render: (record:any) => <Tag color="green"> {renderText(record?.designation)}</Tag>
  },
  {
    title: "Nature",
    key: "dangereux",
    render: (_,record: any) =>{ return (
      <>
        {record.dangereux ? <Tag color="red"> DGX </Tag> : ""}
        {record.frigo ? <Tag color="blue"> FRIGO </Tag> : ""}
        {!record.frigo && !record.dangereux ? <Tag color=""> Ordinaire </Tag> : ""}
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
              url={API_SEJOURS_ENDPOINT}
              class_name='Sejour'
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
    title: "Type tc",
    key: "type_tc",
    dataIndex: "type_tc",
    selected:true, 
    schema: ["type_tc","designation"],
  },
  {
    title: "DGX",
    dataIndex: "dangereux",
    key: "dangereux",
    selected:true, 
  },
  {
    title: "FRIGO",
    dataIndex: "frigo",
    key: "frigo",
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