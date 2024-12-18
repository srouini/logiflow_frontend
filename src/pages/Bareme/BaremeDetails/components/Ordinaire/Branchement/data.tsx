import { Col, Row, Tag } from "antd";
import AUForm from "./components/AUForm";
import Delete from "@/components/Delete";
import { API_BRANCHEMENTS_ENDPOINT } from "@/api/api";
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
              url={API_BRANCHEMENTS_ENDPOINT}
              class_name='Branchement'
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
    title: "Type Tc",
    key: "type_tc",
    dataIndex: "type_tc",
    selected:true, 
    schema: ["type_tc","designation"],
  },
  {
    title: "Jour Min",
    dataIndex: "jour_min",
    key: "jour_min",
    selected:true, 
  },
  {
    title: "Jour Max",
    dataIndex: "jour_max",
    key: "jour_max",
    selected:true, 
  },
  {
    title: "Prix",
    dataIndex: "prix",
    key: "prix",
    selected:true, 
  },
]