import type { ProColumns } from "@ant-design/pro-components";
import { TableDropdown } from "@ant-design/pro-components";
import { Col, Row, Space } from "antd";

import DetailsButton from "@/components/DetailsButton";
import Delete from "@/components/Delete";
import AUForm from "./components/AUForm";
import CloneButton from "@/components/CloneButton";
import { API_BAREMES_ENDPOINT } from "@/api/api";

export const getColumns = (refetch: () => void): ProColumns<any>[] => [
  {
    title: "Designation",
    dataIndex: "designation",
    key:"designation",
    render: (_, record) => (
      <DetailsButton
        text={record?.designation}
        navigate_to={`/bareme/${record?.id}`}
        key={record?.id}
      />
    ),
  },
  {
    title: "Actions",
    valueType: "option",
    key: "actions",
    fixed: "right",
    width: 150,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Space size="middle">
                <AUForm
                  initialvalues={record}
                  refetch={refetch}
                  editText=""
                  hasIcon
                />
                <Delete
                  url={API_BAREMES_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="BAREME"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                />
                <CloneButton
                  endpoint={API_BAREMES_ENDPOINT}
                  id={record.id}
                  refetch={refetch}
                />
              </Space>
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];


export const getColumnsRubrique = (refetch: () => void): ProColumns<any>[] => [
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
    title: "Categorie",
    dataIndex: "categorie",
    key:"categorie",
  },
  {
    title: "Actions",
    valueType: "option",
    key: "actions",
    fixed: "right",
    width: 150,
    render: (_, record: any) => [
      <TableDropdown
        key="actionGroup"
        children={[
          <Row gutter={8}>
            <Col>
              <Space size="middle">
                <AUForm
                  initialvalues={record}
                  refetch={refetch}
                  editText=""
                  hasIcon
                />
                <Delete
                  url={API_BAREMES_ENDPOINT}
                  id={record?.id}
                  refetch={refetch}
                  class_name="BAREME"
                  type="dashed"
                  link={false}
                  text=""
                  has_icon
                />
                <CloneButton
                  endpoint={API_BAREMES_ENDPOINT}
                  id={record.id}
                  refetch={refetch}
                />
              </Space>
            </Col>
          </Row>,
        ]}
      />,
    ],
  },
];


export const  columns =  [ {
  title: "Designation",
  dataIndex: "designation",
  selected:true,
  key:"1"
},
{
  title: "À partir de la date d'accostage",
  dataIndex: "accostage",
  selected:true,
  key:"2"
}]