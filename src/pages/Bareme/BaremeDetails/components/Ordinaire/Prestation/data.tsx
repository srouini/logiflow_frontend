import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Tag } from "antd";
import { renderMoney, renderText } from "@/utils/functions";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import { API_PRESTATIONS_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Rubrique",
    dataIndex: "rubrique",
    key: "rubrique",
    width: 300,
    render: (record:any) => renderText(record?.designation)
  },
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
    title: "Prix",
    key: "prix",
    dataIndex: "prix",
    render: (record:any) => renderMoney(record)
  },
  {
    title: "Debeur",
    key: "debeur",
    dataIndex: "debeur",
    render: (record:any) => record? <Tag color="blue"> Oui </Tag> : <Tag> Non </Tag>
  },
  {
    title: "Groupage",
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
              url={API_PRESTATIONS_ENDPOINT}
              class_name='Prestation'
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
    dataIndex: "rubrique",
    key: "rubrique",
    selected:true,
    schema: ["rubrique","designation"],
  },
  {
    title: "Type Tc",
    key: "type_tc",
    dataIndex: "type_tc",
    selected:true, 
    schema: ["type_tc","designation"],
  },
  {
    title: "Nature",
    key: "dangereux",
    selected:true, 
  },
  {
    title: "Prix",
    key: "prix",
    dataIndex: "prix",
    selected:true, 
  },
  {
    title: "groupage",
    key: "groupage",
    dataIndex: "groupage",
    selected:true, 
  },
]